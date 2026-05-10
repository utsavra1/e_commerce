import { Product } from "@/types";

export default function ProductCard ({product}: {product: Product}){
    return(
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow duration-300">
            {/* Image Placeholder */}
            <div className="h-56 bg-gray-100 flex items-center justify-center">
                {product.posters && product.posters.length > 0 ?(
                    <img src={product.posters[0].url} alt={product.product_name} className="bject-cover w-full h-full" />
                ) : (
                    <span className="text-gray-400 italic">No Image</span>
                )}
            </div>

            {/* Product Details */}
            <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 truncate">
                    {product.product_name}
                </h3>
                <p text-gray-500 text-sm mt-1 line-clamp-2 h-10>
                    {product.product_description}
                </p>

                <div className="mt-4 flex items-center justify-between">
                    <span className="text-2xl font-extrabold text-blue-600">
                        {product.product_price }
                    </span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}