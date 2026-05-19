import type { Metadata } from "next";
import {Inter} from "next/font/google"
import "./globals.css";
import Navbar from "@/components/layout/Navbar/page";
import Footer from "@/components/layout/Footer/page";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { SocketProvider } from '@/context/SocketContext';
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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
          <CartProvider>
            <SocketProvider>
              <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Navbar />
                <main style={{ flex: 1 }}>
                  {children}
                </main>
                <Footer />
              </div>
              <ToastContainer />
            </SocketProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}