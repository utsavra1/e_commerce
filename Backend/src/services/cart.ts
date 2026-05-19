import { Cart } from "../entites/Cart.ts";
import { Cartitem } from "../entites/Cartitem.ts";
import { Product } from "../entites/Product.ts";
import { AppDataSource } from "../config/database.ts";
import { AddToCartInput, UpdateCartInput } from "../schemas/cart.ts";
import { createError } from "../utils/error.ts";

const addItemToCart = async(user_id: number, input: AddToCartInput) =>{
    const productRepo = AppDataSource.getRepository(Product);
    const product = await productRepo.findOne({
            where: {product_id: input.product_id}
        });

        if(!product){
            throw createError('Product not found', 404);
        }

        if(product.stock < input.quantity){
            throw createError(`Only ${product.stock} items left in stock`, 404);
        }

        const cartRepo = AppDataSource.getRepository(Cart);
        let cart = await cartRepo.findOne({
            where: {user: {user_id}}
        });

        if(!cart){
            cart = cartRepo.create({user: {user_id}});
            await cartRepo.save(cart);
        }

        //checking if product is already in cart 

        const cartitemRepo = AppDataSource.getRepository(Cartitem);
        let cartitem = await cartitemRepo.findOne({
            where: {
                cart: {cart_id: cart?.cart_id},
                product: {product_id: input.product_id},
            },
        });

        if(cartitem){
            cartitem.quantity += input.quantity;
            await cartitemRepo.save(cartitem);
        } else{
            cartitem = cartitemRepo.create({quantity: input.quantity, cart, product });
            await cartitemRepo.save(cartitem);
        }
        return {
        product_name: product.product_name,
        quantity: cartitem.quantity,
        price: product.product_price,
    };
};

const fetchMyCart = async(user_id: number) =>{
    const cartRepo = AppDataSource.getRepository(Cart);
        const cart = await cartRepo.findOne({
            where: {user: {user_id}},
            relations: ['cartitem', 'cartitem.product'],
        });

        if (!cart) {
          return {
              cart_id: 0,
              total_items: 0,
              total_price: 0,
              items: []
          };
}

        const total = cart.cartitem.reduce((sum, item) => {
            return sum + Number(item.product.product_price) * item.quantity;
        }, 0);

        return {
        cart_id: cart.cart_id,
        total_items: cart.cartitem.length,
        total_price: total,
        items: cart.cartitem.map((item) => ({
        cart_item_id: item.cart_item_id,
        product_id: item.product.product_id,
        product_name: item.product.product_name,
        price: item.product.product_price,
        quantity: item.quantity,
        subtotal: Number(item.product.product_price) * item.quantity,
        })),
    };
};

const removeItemFromCart = async (user_id: number, cart_item_id: number) => {
  const cartitemRepo = AppDataSource.getRepository(Cartitem);
  const cartitem = await cartitemRepo.findOne({
    where: {
      cart_item_id,
      cart: { user: { user_id } },
    },
    relations: ['cart', 'cart.user'],
  });

  if (!cartitem) {
    throw createError('Cartitem not found', 404);
  }

  await cartitemRepo.remove(cartitem);
};

const updateCartItemQuantity = async (
  user_id: number,
  cart_item_id: number,
  input: UpdateCartInput
) => {
  const cartitemRepo = AppDataSource.getRepository(Cartitem);
  const cartitem = await cartitemRepo.findOne({
    where: {
      cart_item_id,
      cart: { user: { user_id } },
    },
    relations: ['cart', 'cart.user', 'product'],
  });

  if (!cartitem) {
    throw createError('Cartitem not found', 404);
  }

  if (cartitem.product.stock < input.quantity) {
    const error: any = new Error(`Only ${cartitem.product.stock} items left in stock`);
    error.status = 400;
    throw error;
  }

  cartitem.quantity = input.quantity;
  await cartitemRepo.save(cartitem);

  return {
    cart_item_id: cartitem.cart_item_id,
    product_name: cartitem.product.product_name,
    quantity: cartitem.quantity,
    price: cartitem.product.product_price,
    subtotal: Number(cartitem.product.product_price) * cartitem.quantity,
  };
};

export {fetchMyCart, addItemToCart, removeItemFromCart, updateCartItemQuantity}
