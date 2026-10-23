import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "Rauno Freiberg",
  description: "Interaction designer working with Vercel and Devouring Details",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased overflow-x-hidden">
        {/* Kursor Global Berjalan di Seluruh Halaman */}
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}