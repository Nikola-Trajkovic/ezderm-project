"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useBooks } from "@/lib/BookContext";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import RecentlyViewedBooks from "@/components/RecentlyViewedBooks";

interface AuthorDetails {
  name: string;
  birth_date?: string;
  death_date?: string;
  bio?: string | { type: string; value: string };
}

interface BookDetails {
  title: string;
  authors?: Array<{ author: { key: string; name: string } }>;
  description?: string | { type: string; value: string };
  covers?: number[];
  first_publish_date?: string;
  subjects?: string[];
  number_of_pages_median?: number;
  languages?: Array<{ key: string }>;
}

export default function BookPage() {
  const params = useParams();
  const bookId = params.id as string;
  const [bookDetails, setBookDetails] = useState<BookDetails | null>(null);
  const [authorDetails, setAuthorDetails] = useState<AuthorDetails | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToRecentlyViewed, searchTerm, currentPage } = useBooks();

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!bookId) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://openlibrary.org/works/${bookId}.json`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch book details");
        }

        const data: BookDetails = await response.json();
        setBookDetails(data);

        // Fetch author details if available
        if (data.authors?.[0]?.author?.key) {
          const authorKey = data.authors[0].author.key.split("/").pop();
          if (authorKey) {
            try {
              const authorResponse = await fetch(
                `https://openlibrary.org/authors/${authorKey}.json`
              );
              if (authorResponse.ok) {
                const authorData: AuthorDetails = await authorResponse.json();
                setAuthorDetails(authorData);
              }
            } catch (authorError) {
              console.log("Failed to fetch author details:", authorError);
            }
          }
        }

        // Add to recently viewed
        addToRecentlyViewed({
          id: bookId,
          title: data.title,
          author:
            authorDetails?.name ||
            data.authors?.[0]?.author?.name ||
            "Unknown Author",
          coverUrl: data.covers?.[0]
            ? `https://covers.openlibrary.org/b/id/${data.covers[0]}-L.jpg`
            : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYAkd1YLySFcNwImCfMiowVzRXPta5jvQN0A&s",
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  const getDescription = () => {
    if (!bookDetails?.description) return "No description available";

    if (typeof bookDetails.description === "string") {
      return bookDetails.description;
    }

    return bookDetails.description.value || "No description available";
  };

  const getAuthorBio = () => {
    if (!authorDetails?.bio) return "No biography available";

    if (typeof authorDetails.bio === "string") {
      return authorDetails.bio;
    }

    return authorDetails.bio.value || "No biography available";
  };

  const getBackUrl = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("q", searchTerm);
    if (currentPage > 1) params.set("page", currentPage.toString());

    return params.toString() ? `/?${params.toString()}` : "/";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <Link href={getBackUrl()}>
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Button>
          </Link>
          <div className="text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>
        </div>
      </div>
    );
  }

  if (!bookDetails) {
    return (
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <Link href={getBackUrl()}>
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Button>
          </Link>
          <div className="text-gray-500">Book not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <Link href={getBackUrl()}>
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Search
          </Button>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Book Cover */}
          <div className="md:col-span-1">
            <img
              src={
                bookDetails.covers?.[0]
                  ? `https://covers.openlibrary.org/b/id/${bookDetails.covers[0]}-L.jpg`
                  : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYAkd1YLySFcNwImCfMiowVzRXPta5jvQN0A&s"
              }
              alt={bookDetails.title}
              className="w-full rounded-lg shadow-lg"
            />
          </div>

          {/* Book Details */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{bookDetails.title}</h1>
              {(authorDetails?.name ||
                bookDetails.authors?.[0]?.author?.name) && (
                <p className="text-lg text-gray-600">
                  by{" "}
                  {authorDetails?.name ||
                    bookDetails.authors?.[0]?.author?.name}
                </p>
              )}
            </div>

            {/* Publication Info */}
            <div className="space-y-2">
              {bookDetails.first_publish_date && (
                <p className="text-sm text-gray-500">
                  First published: {bookDetails.first_publish_date}
                </p>
              )}
              {bookDetails.number_of_pages_median && (
                <p className="text-sm text-gray-500">
                  Pages: {bookDetails.number_of_pages_median}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-3">Description</h2>
              <p className="text-gray-700 leading-relaxed">
                {getDescription()}
              </p>
            </div>

            {/* Author Information */}
            {authorDetails && (
              <div>
                <h2 className="text-xl font-semibold mb-3">About the Author</h2>
                <div className="space-y-3">
                  <div className="flex gap-4 text-sm text-gray-600">
                    {authorDetails.birth_date && (
                      <span>Born: {authorDetails.birth_date}</span>
                    )}
                    {authorDetails.death_date && (
                      <span>Died: {authorDetails.death_date}</span>
                    )}
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {getAuthorBio()}
                  </p>
                </div>
              </div>
            )}

            {/* Subjects */}
            {bookDetails.subjects && bookDetails.subjects.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Subjects</h2>
                <div className="flex flex-wrap gap-2">
                  {bookDetails.subjects.slice(0, 10).map((subject, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <RecentlyViewedBooks />
      </div>
    </div>
  );
}
