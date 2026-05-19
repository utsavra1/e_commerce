import { Product } from "@/types";
import Link from "next/link";
import { Cart } from "@/types";
import { useCart } from "@/context/CartContext";


export default function ProductCard ({product}: {product: Product}) {

  const {addItem} = useCart();

  const handleAddToCart = (e: React.MouseEvent) =>{
    e.preventDefault();
    addItem(product.product_id, 1);
  };

    return(
      <Link href={`/product/${product.product_id}`} className="group block ...">
      <div className="group bg-white rounded-3xl p-4 border border-transparent hover:border-gray-100 hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500">
      <div className="relative h-64 bg-gray-50 rounded-2xl overflow-hidden mb-6 flex items-center justify-center">
        {product.posters && product.posters.length > 0 ? (
          <img 
            src={product.posters[0].url} 
            alt={product.product_name} 
            className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" 
          />
        ) : (
          <span className="text-gray-300 font-medium italic">No Image</span>
        )}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-900 shadow-sm">
          {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
        </div>
      </div>

      <div className="px-2">
        <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 truncate">{product.product_name}</h3>
        <p className="text-gray-400 text-xs line-clamp-2 h-8 mb-4 leading-relaxed">{product.product_description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">Price</span>
            <span className="text-xl font-black text-gray-900">Rs {product.product_price}</span>
          </div>
          <button 
              onClick={handleAddToCart}
              className="bg-gray-900 text-white p-3 rounded-xl hover:bg-indigo-600 hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-gray-200 hover:shadow-indigo-200">
             <span className="text-sm font-bold">+ Add</span>
          </button>
        </div>
      </div>
    </div>
    </Link>
    );
}