/* 
  Types needed for TypeScript
*/

interface Cart {
  id: string;
  quantity: number;
}

interface Product {
  id: number;
  title: string;
  description: string;
  stock: number;
  price: number;
  brand: string;
  category: string;
  images: string[];
  rating: number;
  dimensions: Dimensions;
}

interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

interface ProductsResponse {
  products: Product[];
}

interface WebshopState {
  cart: Cart[];
  searchInput: string;
  isProductModalOpen: boolean;
  focusedProduct: Product | null;
  fetchedProducts: Product[] | null;
}


interface CartItem {
  id: string;
  name: string;
  price: number;
  valuta: string;
  images: string[];
  quantity: number;
}

interface CartItemSetQuantity {
  id: string;
  value: number;
}

interface CartTotalPrice {
  totalPrice: number;
  valuta: string;
}

export type {
  WebshopState,
  Cart,
  CartItem,
  CartItemSetQuantity,
  CartTotalPrice,
  Product,
  ProductsResponse
}