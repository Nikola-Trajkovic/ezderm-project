"use client";

import { BookProvider } from "@/lib/BookContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <BookProvider>{children}</BookProvider>;
}
