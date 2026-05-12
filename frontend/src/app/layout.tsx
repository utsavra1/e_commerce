import type { Metadata } from "next";
import {Inter} from "next/font/google"
import "./globals.css";
import Navbar from "@/components/layout/Navbar/page";
import Footer from "@/components/layout/Footer/page";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "E-SHOP | Premium Electronics",
  description: "Modern E-commerce store for the latest tech gadgets.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            
            {/* 1. Header (Navbar) stays on top of every page */}
            <Navbar />

            {/* 2. The dynamic content of each page goes here */}
            <main style={{ flex: 1 }}>
              {children}
            </main>

            {/* 3. The Footer stays at the bottom of every page */}
            <Footer />

          </div>
        </AuthProvider>
      </body>
    </html>
  );
}