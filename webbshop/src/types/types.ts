/* 
  Types needed for TypeScript
*/

interface WebshopState {
  cart: Cart[];
  searchInput: string;
  isProductModalOpen: boolean;
  focusedProduct: Product | null;
  fetchedProducts: FetchedProducts;
  fetchedProductsDropdown: FetchedProductsDropdown;
}

interface FetchedProducts {
  products: Product[] | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed'; 
  error: string | null;
}

interface FetchedProductsDropdown {
  products: ProductsDropdown[] | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed'; 
  error: string | null;
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
  reviews: Reviews[];
  dimensions: Dimensions;
}

interface ProductsDropdown {
  id: number;
  title: string;
  images: string[];
}

interface Reviews {
  rating: number;
}

interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

interface ProductsResponse {
  products: Product[];
}

interface Cart {
  details: Product;
  quantity: number;
}

// interface CartItem {
//   id: string;
//   name: string;
//   price: number;
//   valuta: string;
//   images: string[];
//   quantity: number;
// }

interface CartItemSetQuantity {
  id: string;
  value: number;
}

interface CartTotalPrice {
  totalPrice: number;
  valuta: string;
}

interface RatingsMap {
  [id: number]: number;
}

export type {
  WebshopState,
  Cart,
  // CartItem,
  CartItemSetQuantity,
  CartTotalPrice,
  Product,
  ProductsResponse,
  ProductsDropdown,
  RatingsMap
}