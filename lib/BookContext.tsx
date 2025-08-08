import { createContext, useContext, useState, ReactNode } from "react";

interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
}

interface BookContextType {
  recentlyViewedBooks: Book[];
  addToRecentlyViewed: (book: Book) => void;
  searchTerm: string;
  currentPage: number;
  setSearchTerm: (term: string) => void;
  setCurrentPage: (page: number) => void;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export function BookProvider({ children }: { children: ReactNode }) {
  const [recentlyViewedBooks, setRecentlyViewedBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const addToRecentlyViewed = (book: Book) => {
    setRecentlyViewedBooks((prev) => {
      // Remove the book if it already exists
      const filtered = prev.filter((b) => b.id !== book.id);
      // Add the book to the beginning of the array and keep only the last 6 books
      return [book, ...filtered].slice(0, 6);
    });
  };

  return (
    <BookContext.Provider
      value={{
        recentlyViewedBooks,
        addToRecentlyViewed,
        searchTerm,
        currentPage,
        setSearchTerm,
        setCurrentPage,
      }}
    >
      {children}
    </BookContext.Provider>
  );
}

export function useBooks() {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error("useBooks must be used within a BookProvider");
  }
  return context;
}
