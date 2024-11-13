import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../app/store';
import productsDB, { ClothingProduct } from '../db/fakerDB';

interface WebshopState {
    cart: Cart[];
    products: ClothingProduct[];
    filteredProducts: ClothingProduct[];
    searchInput: string;
    isProductModalOpen: boolean;
    focusedProduct: ClothingProduct | null;
}

type Cart = {
    id: string;
    quantity: number;
}

const initialState: WebshopState = {
    cart: [],
    products: productsDB,
    filteredProducts: [],
    searchInput: '',
    isProductModalOpen: false,
    focusedProduct: null
}

interface CartItem {
    name: string;
    price: number;
    valuta: string;
    imgUrl: string;
    quantity: number;
}

interface CartTotalPrice {
    totalPrice: number;
    valuta: string;
}

export const webshopSlice = createSlice({
    name: 'webshop',
    initialState,
    reducers: {
        setSearchInput: (state, action: PayloadAction<string>) => {state.searchInput = action.payload},
        filterProducts: (state) => {
            if(state.searchInput !== '') {
                state.filteredProducts = productsDB.filter(product => product.name.toLowerCase().includes(state.searchInput.toLowerCase()))
                state.searchInput = '';
                console.log(state.filteredProducts);
            }
        },
        addToCart: (state, action: PayloadAction<string>) => {
            const existingCartItem = state.cart.find((item) => item.id === action.payload);
            if(existingCartItem) existingCartItem.quantity += 1;
            else state.cart.push({id: action.payload, quantity: 1});
            console.log(JSON.parse(JSON.stringify(state.cart)));  
        },
        setIsProductModalOpen: (state, action: PayloadAction<boolean>) => {
            state.isProductModalOpen = action.payload
            console.log(state.isProductModalOpen);
        },
        setFocusedProduct: (state, action: PayloadAction<ClothingProduct>) => {
            state.focusedProduct = action.payload;
            console.log(state.focusedProduct);
            
        }
    }
});

// Reducer actions
export const {setSearchInput, filterProducts, addToCart, setIsProductModalOpen, setFocusedProduct} = webshopSlice.actions;

// Raw data selectors
export const selectSearchInput = (state: RootState) => state.webshop.searchInput;
export const selectFilteredProducts = (state: RootState) => state.webshop.filteredProducts;
export const selectCart = (state: RootState) => state.webshop.cart;
export const selectProducts = (state: RootState) => state.webshop.products;
export const selectIsProductModalOpen = (state: RootState) => state.webshop.isProductModalOpen;
export const selectFocusedProduct = (state: RootState) => state.webshop.focusedProduct;

// Memoized selectors, derived data
export const selectCartItems = createSelector(
    [selectProducts, selectCart], 
    (productsDB, cart): CartItem[] => {
        const itemMap = productsDB.reduce<{[key: string]: ClothingProduct}>((acc, item) => {
            acc[item.id] = item;
            return acc;
        }, {})

        return cart.map(cartItem => {
            if(!itemMap[cartItem.id]) return null;
            return {
                name: itemMap[cartItem.id].name,
                price: Number(itemMap[cartItem.id].price),
                valuta: itemMap[cartItem.id].valuta,
                imgUrl: itemMap[cartItem.id].imgUrl,
                quantity: cartItem.quantity
            }
        }) as CartItem[];
});

export const selectCartSummary = createSelector(
    [selectCartItems],
    (cartItems): CartTotalPrice => {
        if(!cartItems || cartItems.length === 0) {
            return {totalPrice: 0, valuta: 'SEK'};
        }

        return cartItems.reduce<CartTotalPrice>((acc, item) => {
            acc.totalPrice += (item.price * item.quantity);
            return acc;
        }, {totalPrice: 0, valuta: 'SEK'});
    }
);

export default webshopSlice.reducer;