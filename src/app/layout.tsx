import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";

export const metadata: Metadata = {
  title: "Muhammad Ma'sum Juniyanto — Software Engineer",
  description: "Personal portfolio showcasing enterprise systems, IoT hardware automation, and refined interaction design.",
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