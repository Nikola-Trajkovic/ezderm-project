import { useBooks } from "@/lib/BookContext";
import Link from "next/link";

export default function RecentlyViewedBooks() {
  const { recentlyViewedBooks } = useBooks();

  if (recentlyViewedBooks.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mt-8">
      <h2 className="text-2xl font-semibold mb-4">Recently Viewed Books</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recentlyViewedBooks.map((book) => (
          <Link key={book.id} href={`/book/${book.id}`} className="block">
            <div className="p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
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
    </div>
  );
}
