"use client";

import { useBooks } from "@/lib/BookContext";
import Link from "next/link";

interface Book {
  key: string;
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  author_name?: string[];
  cover_i?: number;
}

interface BookResultsProps {
  books: Book[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function BookResults({
  books,
  currentPage,
  totalPages,
  onPageChange,
}: BookResultsProps) {
  const { addToRecentlyViewed } = useBooks();

  const handleBookClick = (book: Book) => {
    addToRecentlyViewed({
      id: book.id,
      title: book.title,
      author: book.author,
      coverUrl: book.coverUrl,
    });
  };

  return (
    <div className="w-full max-w-4xl space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map((book) => (
          <Link
            key={book.id}
            href={`/book/${book.id}`}
            className="block"
            onClick={() => handleBookClick(book)}
          >
            <div className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:shadow-lg transition-shadow">
              {book.coverUrl && (
                <img
                  src={book.coverUrl}
                  alt={book.title}
                  className="w-full h-48 object-cover rounded-md mb-2"
                />
              )}
              <h3 className="font-semibold text-lg">{book.title}</h3>
              <p className="text-gray-600">{book.author}</p>
            </div>
          </Link>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 cursor-pointer"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
