#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';

const allowedPatterns = [
  /node_modules/,
  /dist/,
  /build/,
  /\.prettierrc/,
  /\.git/,
  /package-lock\.json/,
  /\.log$/,
  /\.min\.js$/,
  /check-any\.ts$/,
];

const forbiddenPatterns = [
  /:\s*any\b/g, // Type annotation: variable: any
  /<any>/g, // Generic: Array<any>
  /as\s+any/g, // Type assertion: as any
  /any\[\]/g, // Array type: any[]
  /any\s*\|/g, // Union type: any | string
  /\|\s*any/g, // Union type: string | any
  /any\s*&/g, // Intersection type: any & string
  /&\s*any/g, // Intersection type: string & any
  /Promise<any>/g, // Promise<any>
  /Record<string,\s*any>/g, // Record<string, any>
  /Map<.*,\s*any>/g, // Map<string, any>
  /Set<any>/g, // Set<any>
];

function shouldCheckFile(filePath: string): boolean {
  const relativePath = path.relative(process.cwd(), filePath);

  for (const pattern of allowedPatterns) {
    if (pattern.test(relativePath)) {
      return false;
    }
  }

  return /\.(ts|tsx|js|jsx)$/.test(filePath);
}

function checkFile(filePath: string): {
  hasAny: boolean;
  lines: Array<{ line: number; content: string }>;
} {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const issues: Array<{ line: number; content: string }> = [];

  lines.forEach((line, index) => {
    // Skip comments
    if (line.trim().startsWith('//') || line.trim().startsWith('*')) {
      return;
    }

    for (const pattern of forbiddenPatterns) {
      if (pattern.test(line)) {
        issues.push({
          line: index + 1,
          content: line.trim(),
        });
        break; // Only report once per line
      }
    }
  });

  return {
    hasAny: issues.length > 0,
    lines: issues,
  };
}

function findTypeScriptFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findTypeScriptFiles(filePath, fileList);
    } else if (shouldCheckFile(filePath)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function main(): void {
  const srcDir = path.join(process.cwd(), 'src');

  if (!fs.existsSync(srcDir)) {
    console.error('❌ src directory not found');
    process.exit(1);
  }

  const files = findTypeScriptFiles(srcDir);
  const errors: Array<{ file: string; issues: Array<{ line: number; content: string }> }> = [];

  files.forEach((file) => {
    const result = checkFile(file);
    if (result.hasAny) {
      errors.push({
        file: path.relative(process.cwd(), file),
        issues: result.lines,
      });
    }
  });

  if (errors.length > 0) {
    console.error('\n❌ Found "any" types in the codebase:\n');

    errors.forEach((error) => {
      console.error(`\n📄 ${error.file}:`);
      error.issues.forEach((issue) => {
        console.error(`   Line ${issue.line}: ${issue.content}`);
      });
    });

    console.error('\n⚠️  Please replace all "any" types with proper TypeScript types.\n');
    process.exit(1);
  }

  console.log('✅ No "any" types found in the codebase!');
  process.exit(0);
}

main();
