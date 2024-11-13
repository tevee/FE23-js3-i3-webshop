/* 
  Types needed for TypeScript
*/

interface ClothingProduct {
  id: string;
  name: string;
  category: string;
  size: string;
  price: string;
  valuta: string;
  description: string;
  clothingType: string;
  imgUrl: string;
  quantity: number;
}

interface Cart {
  id: string;
  quantity: number;
}

interface WebshopState {
  cart: Cart[];
  products: ClothingProduct[];
  filteredProducts: ClothingProduct[];
  searchInput: string;
  isProductModalOpen: boolean;
  focusedProduct: ClothingProduct | null;
}


interface CartItem {
  id: string;
  name: string;
  price: number;
  valuta: string;
  imgUrl: string;
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
  ClothingProduct, 
  WebshopState,
  Cart,
  CartItem,
  CartItemSetQuantity,
  CartTotalPrice
}