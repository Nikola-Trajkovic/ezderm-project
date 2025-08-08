"use client";

import { useEffect, useState } from "react";
import { useBooks } from "@/lib/BookContext";
import { useSearchParams, useRouter } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import BookResults from "@/components/BookResults";
import RecentlyViewedBooks from "@/components/RecentlyViewedBooks";

interface Book {
  key: string;
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  author_name?: string[];
  cover_i?: number;
}

interface SearchResponse {
  numFound: number;
  docs: Array<Omit<Book, "id" | "author" | "coverUrl">>;
}

export default function HomeClient() {
  const { searchTerm, setSearchTerm, currentPage, setCurrentPage } = useBooks();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const booksPerPage = 6;
  const [totalBooks, setTotalBooks] = useState(0);
  const totalPages = Math.ceil(totalBooks / booksPerPage);

  const handleSearch = (query: string) => {
    setSearchTerm(query);
    setCurrentPage(1);
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    params.set("page", "1");
    router.push(`/?${params.toString()}`);
  };

  const getCurrentPageBooks = () => {
    return searchResults;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const params = new URLSearchParams();
    if (searchTerm) params.set("q", searchTerm);
    params.set("page", page.toString());
    router.push(`/?${params.toString()}`);
  };

  // Sync context with URL parameters on page load
  useEffect(() => {
    const urlQuery = searchParams.get("q");
    const urlPage = searchParams.get("page");

    if (urlQuery && urlQuery !== searchTerm) {
      setSearchTerm(urlQuery);
    }
    if (urlPage) {
      const pageNum = parseInt(urlPage);
      if (pageNum !== currentPage) {
        setCurrentPage(pageNum);
      }
    }
  }, [searchParams, searchTerm, currentPage, setSearchTerm, setCurrentPage]);

  useEffect(() => {
    const fetchBooks = async () => {
      if (!searchTerm) {
        setSearchResults([]);
        setTotalBooks(0);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const offset = (currentPage - 1) * booksPerPage;
        const response = await fetch(
          `https://openlibrary.org/search.json?title=${encodeURIComponent(
            searchTerm
          )}&limit=${booksPerPage}&offset=${offset}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }

        const data: SearchResponse = await response.json();

        const formattedBooks = data.docs
          .filter((book) => book.cover_i)
          .map((book) => ({
            ...book,
            id: book.key.split("/").pop() || book.key,
            author: book.author_name?.[0] || "Unknown Author",
            coverUrl: `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`,
          }));

        setSearchResults(formattedBooks);
        setTotalBooks(data.numFound);
      } catch (e) {
        setError(e instanceof Error ? e.message : "An error occurred");
        setSearchResults([]);
        setTotalBooks(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [searchTerm, currentPage, booksPerPage]);

  return (
    <div className="min-h-screen p-8 space-y-8">
      <div className="flex flex-col items-center space-y-8">
        <h1 className="text-3xl font-bold">Book Search</h1>
        <SearchBar onSearch={handleSearch} initialQuery={searchTerm} />

        {error && (
          <div className="text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center w-full p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          searchResults.length > 0 && (
            <BookResults
              books={getCurrentPageBooks()}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )
        )}

        {!isLoading && searchTerm && searchResults.length === 0 && !error && (
          <div className="text-gray-500">
            No books found for &quot;{searchTerm}&quot;
          </div>
        )}

        <RecentlyViewedBooks />
      </div>
    </div>
  );
}
