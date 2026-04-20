import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

// --- Types ---
interface Book {
  id: string;
  title: string;
  author: string;
  addedAt: number;
}

// --- Initial Data ---
const INITIAL_BOOKS: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'S. Scott Fitzgerald',
    addedAt: Date.now() - 3000,
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    addedAt: Date.now() - 2000,
  },
  {
    id: '3',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    addedAt: Date.now() - 1000,
  },
];

export default function App() {
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('library_system_books');
    if (saved) return JSON.parse(saved);
    return INITIAL_BOOKS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [newBook, setNewBook] = useState({ title: '', author: '' });

  // Persistence
  useEffect(() => {
    localStorage.setItem('library_system_books', JSON.stringify(books));
  }, [books]);

  // Filtering
  const filteredBooks = useMemo(() => {
    return books.filter(book => 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => b.addedAt - a.addedAt);
  }, [books, searchQuery]);

  // Handlers
  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBook.title.trim() || !newBook.author.trim()) {
      toast.error('Please enter both title and author');
      return;
    }

    const book: Book = {
      id: crypto.randomUUID(),
      title: newBook.title.trim(),
      author: newBook.author.trim(),
      addedAt: Date.now(),
    };

    setBooks(prev => [book, ...prev]);
    setNewBook({ title: '', author: '' });
    toast.success('Book added successfully');
  };

  const handleRemoveBook = (id: string) => {
    setBooks(prev => prev.filter(b => b.id !== id));
    toast.info('Book removed');
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8]/30 flex flex-col items-center py-12 px-4 font-sans select-none">
      <Toaster position="top-center" richColors />
      
      {/* Main Container */}
      <div className="w-full max-w-2xl flex flex-col gap-8">
        
        {/* Title */}
        <h1 className="text-[42px] font-bold text-[#1A2B3C] text-center leading-tight mb-4">
          Library Management<br />System
        </h1>

        {/* Input & Search Panel */}
        <div className="bg-white p-6 rounded-xl border border-[#D9E2EC] shadow-sm flex flex-col gap-4">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search books..."
            className="w-full bg-white border-[#D9E2EC] h-11 text-lg placeholder:text-gray-400 focus-visible:ring-0 focus-visible:border-[#334E68]"
          />
          
          <form onSubmit={handleAddBook} className="flex flex-col sm:flex-row gap-3">
            <Input
              value={newBook.title}
              onChange={(e) => setNewBook(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Book Title"
              className="flex-1 bg-white border-[#D9E2EC] h-11 text-lg focus-visible:ring-0"
            />
            <Input
              value={newBook.author}
              onChange={(e) => setNewBook(prev => ({ ...prev, author: e.target.value }))}
              placeholder="Author"
              className="flex-1 bg-white border-[#D9E2EC] h-11 text-lg focus-visible:ring-0"
            />
            <Button 
              type="submit"
              className="bg-[#0066FF] hover:bg-[#0052CC] text-white px-8 h-11 text-lg font-medium rounded-lg transition-colors"
            >
              Add Book
            </Button>
          </form>
        </div>

        {/* Book List */}
        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredBooks.map((book) => (
              <motion.div
                key={book.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border border-[#D9E2EC] shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-6 flex items-center justify-between">
                    <div className="flex flex-col gap-1 overflow-hidden pr-4">
                      <h3 className="text-2xl font-bold text-[#1A2B3C] truncate leading-tight">
                        {book.title}
                      </h3>
                      <p className="text-xl text-[#334E68] opacity-80">
                        by {book.author}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={() => handleRemoveBook(book.id)}
                      className="bg-[#D64545] hover:bg-[#B13A3A] px-6 h-11 rounded-lg text-lg font-medium shrink-0"
                    >
                      Remove
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredBooks.length === 0 && (
            <p className="text-center text-gray-500 py-10 italic">
              {searchQuery ? 'No matching books found.' : 'No books in the library.'}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
