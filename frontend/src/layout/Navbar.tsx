import Link from "next/link";

export default function Navbar() {
    return(
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    <Link href='/' className="text-2xl font-black text-indigo-600 tracking-tighter">
                    E-SHOP
                    </Link>
                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <input 
                        type="text"
                        placeholder="Search products..." 
                        className="w-full bg-gray-50 border-none rounded-full px-6 py-2.5 focus:ring-2 focus:ring-indigo-500 transition-all text-sm" />
                    </div>
                    <div className="flex items-center space-x-8 text-sm font-bold text-gray-700">
                        <Link href="/shop" className="hover:text-indigo-600">SHOP</Link>
                        <Link href="/login" className="hover:text-indigo-600">LoginIn</Link>
                        <div className="relative cursor-pointer hover:scale-110 transition-transform">
                            <span className="text-xl">🛒</span>
                            <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">0</span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}