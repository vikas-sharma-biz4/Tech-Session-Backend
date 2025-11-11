import { sequelize, testConnection } from '../db/connection';
// @ts-ignore - Import models to register them
import '../features/books/models/BookModel';
// @ts-ignore - Import models to register them
import '../features/auth/models/UserModel';
import { randomUUID } from 'crypto';

// Import models after they're registered
const Book = sequelize.models.Book;
const User = sequelize.models.User;

const bookTypes = ['fiction', 'non-fiction', 'academic', 'biography', 'other'] as const;
const conditions = ['new', 'like-new', 'good', 'fair', 'poor'] as const;

const authors = [
  'J.K. Rowling',
  'Stephen King',
  'George R.R. Martin',
  'Jane Austen',
  'Charles Dickens',
  'Mark Twain',
  'Ernest Hemingway',
  'F. Scott Fitzgerald',
  'Toni Morrison',
  'Maya Angelou',
  'Harper Lee',
  'J.D. Salinger',
  'Kurt Vonnegut',
  'Ray Bradbury',
  'Isaac Asimov',
  'Agatha Christie',
  'Arthur Conan Doyle',
  'Virginia Woolf',
  'James Joyce',
  'William Shakespeare',
  'Emily Dickinson',
  'Edgar Allan Poe',
  'H.P. Lovecraft',
  'Mary Shelley',
  'Bram Stoker',
  'Oscar Wilde',
  'Lewis Carroll',
  'Rudyard Kipling',
  'H.G. Wells',
  'Jules Verne',
  'Albert Einstein',
  'Stephen Hawking',
  'Carl Sagan',
  'Richard Feynman',
  'Neil deGrasse Tyson',
  'Malcolm Gladwell',
  'Yuval Noah Harari',
  'Jared Diamond',
  'Bill Bryson',
  'Mary Roach',
  'Michelle Obama',
  'Barack Obama',
  'Nelson Mandela',
  'Mahatma Gandhi',
  'Martin Luther King Jr.',
  'Winston Churchill',
  'Theodore Roosevelt',
  'Abraham Lincoln',
  'Benjamin Franklin',
  'Thomas Jefferson',
];

const fictionTitles = [
  'The Great Gatsby',
  'To Kill a Mockingbird',
  '1984',
  'Pride and Prejudice',
  'The Catcher in the Rye',
  'Lord of the Flies',
  'Animal Farm',
  'Brave New World',
  'Fahrenheit 451',
  "The Handmaid's Tale",
  'The Hobbit',
  'The Lord of the Rings',
  'Harry Potter Series',
  'Game of Thrones',
  'The Chronicles of Narnia',
  'Dune',
  'Foundation',
  'The Martian',
  'The Time Machine',
  'Journey to the Center of the Earth',
  'Sherlock Holmes Collection',
  'Murder on the Orient Express',
  'And Then There Were None',
  'The Hound of the Baskervilles',
  'Frankenstein',
  'Dracula',
  'The Picture of Dorian Gray',
  "Alice's Adventures in Wonderland",
  'The Jungle Book',
];

const nonFictionTitles = [
  'Sapiens: A Brief History of Humankind',
  'The Immortal Life of Henrietta Lacks',
  'Educated',
  'The Glass Castle',
  'Into the Wild',
  'The Tipping Point',
  'Outliers',
  'Blink',
  'Thinking, Fast and Slow',
  'The Power of Habit',
  'Atomic Habits',
  'The 7 Habits of Highly Effective People',
  'How to Win Friends and Influence People',
  'The Art of War',
  'Meditations',
  'The Republic',
  'The Prince',
  'The Wealth of Nations',
  'Capital',
  'A Brief History of Time',
  'The Universe in a Nutshell',
  'Cosmos',
  'The Selfish Gene',
  'The Origin of Species',
];

const academicTitles = [
  'Introduction to Algorithms',
  'The C Programming Language',
  'Design Patterns',
  'Clean Code',
  'Database System Concepts',
  'Operating System Concepts',
  'Computer Networks',
  'Artificial Intelligence: A Modern Approach',
  'Introduction to Machine Learning',
  'Deep Learning',
  'Linear Algebra',
  'Calculus',
  'Statistics',
  'Organic Chemistry',
  'Physical Chemistry',
  'Quantum Mechanics',
  'Thermodynamics',
  'Electromagnetism',
  'Principles of Economics',
  'Macroeconomics',
  'Microeconomics',
  'International Trade',
  'Financial Markets',
];

const biographyTitles = [
  'Steve Jobs',
  'Elon Musk',
  'Benjamin Franklin: An American Life',
  'Einstein: His Life and Universe',
  'Leonardo da Vinci',
  'The Autobiography of Malcolm X',
  'Long Walk to Freedom',
  'Gandhi: An Autobiography',
  'The Story of My Experiments with Truth',
  'I Know Why the Caged Bird Sings',
  'Becoming',
  'A Promised Land',
  'The Diary of a Young Girl',
  'Unbroken',
  'The Wright Brothers',
  'Alexander Hamilton',
  'John Adams',
];

const generateISBN = (): string => {
  return `978-${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')}-${Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')}-${Math.floor(Math.random() * 10)}`;
};

const generateBook = (sellerId: string, index: number) => {
  const type = bookTypes[Math.floor(Math.random() * bookTypes.length)];
  let title = '';
  let author = authors[Math.floor(Math.random() * authors.length)];

  // Assign appropriate titles based on type
  if (type === 'fiction') {
    title = fictionTitles[Math.floor(Math.random() * fictionTitles.length)];
  } else if (type === 'non-fiction') {
    title = nonFictionTitles[Math.floor(Math.random() * nonFictionTitles.length)];
  } else if (type === 'academic') {
    title = academicTitles[Math.floor(Math.random() * academicTitles.length)];
  } else if (type === 'biography') {
    title = biographyTitles[Math.floor(Math.random() * biographyTitles.length)];
  } else {
    title = `Book ${index + 1}: A Comprehensive Guide`;
  }

  const price = parseFloat((Math.random() * 200 + 5).toFixed(2));
  const condition = conditions[Math.floor(Math.random() * conditions.length)];
  const hasISBN = Math.random() > 0.2; // 80% have ISBN
  const hasDescription = Math.random() > 0.3; // 70% have description

  return {
    id: randomUUID(),
    title: `${title}${index > 0 && Math.random() > 0.7 ? ` (Edition ${Math.floor(Math.random() * 5) + 1})` : ''}`,
    author,
    isbn: hasISBN ? generateISBN() : undefined,
    type,
    price,
    condition,
    description: hasDescription
      ? `A captivating ${type} book by ${author}. This book explores various themes and provides deep insights into the subject matter. Perfect for readers interested in ${type} literature.`
      : undefined,
    seller_id: sellerId,
    image_url: undefined,
    created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000), // Random date within last year
    updated_at: new Date(),
  };
};

const seedBooks = async (): Promise<void> => {
  try {
    await testConnection();

    // Get all users to assign as sellers
    const users = await User.findAll({ limit: 10 });

    if (users.length === 0) {
      console.error('❌ No users found. Please create users first.');
      await sequelize.close();
      process.exit(1);
    }

    // Check if books already exist
    const existingBooks = await Book.count();
    if (existingBooks > 0) {
      console.log(`⚠️  Found ${existingBooks} existing books. Skipping seed.`);
      console.log('   To reseed, delete all books first.');
      await sequelize.close();
      process.exit(0);
    }

    console.log(`📚 Starting to seed books...`);
    console.log(`👥 Using ${users.length} sellers`);

    const booksToCreate = [];
    const numberOfBooks = 120;

    for (let i = 0; i < numberOfBooks; i++) {
      const seller = users[Math.floor(Math.random() * users.length)];
      const book = generateBook(seller.id, i);
      booksToCreate.push(book);
    }

    // Insert books in batches of 20
    const batchSize = 20;
    for (let i = 0; i < booksToCreate.length; i += batchSize) {
      const batch = booksToCreate.slice(i, i + batchSize);
      await Book.bulkCreate(batch);
      console.log(
        `✅ Created ${Math.min(i + batchSize, booksToCreate.length)}/${booksToCreate.length} books`
      );
    }

    const totalBooks = await Book.count();
    console.log(`\n🎉 Successfully seeded ${totalBooks} books!`);

    // Show summary by type
    const booksByType = await Book.findAll({
      attributes: ['type', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
      group: ['type'],
      raw: true,
    });

    console.log('\n📊 Books by type:');
    booksByType.forEach((item: Record<string, unknown>) => {
      console.log(`   ${item.type}: ${item.count}`);
    });

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding books:', error);
    await sequelize.close();
    process.exit(1);
  }
};

seedBooks();
