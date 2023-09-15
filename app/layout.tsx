import "./globals.css";
import cn from "classnames";
import type { Metadata } from "next";
import { Figtree } from "next/font/google";

const figtree = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SuperSellers",
  description: "Affiliate marketing made easy",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className={cn(figtree.className, "h-full ")}>{children}</body>
    </html>
  );
}
