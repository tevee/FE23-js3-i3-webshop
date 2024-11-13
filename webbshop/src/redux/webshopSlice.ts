/* 
    Webshop Slice
    Handles the Webshop reducer
*/

import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../app/store';
import productsDB from '../db/fakerDB';
import {ClothingProduct, WebshopState, CartItem, CartItemSetQuantity, CartTotalPrice} from '../types/types';

const initialState: WebshopState = {
    cart: [],
    products: productsDB,
    filteredProducts: [],
    searchInput: '',
    isProductModalOpen: false,
    focusedProduct: null
}

export const webshopSlice = createSlice({
    name: 'webshop',
    initialState,
    reducers: {
        setSearchInput: (state, action: PayloadAction<string>) => {state.searchInput = action.payload},
        filterProducts: (state) => {
            if(state.searchInput !== '') {
                state.filteredProducts = productsDB.filter(product => product.name.toLowerCase().includes(state.searchInput.toLowerCase()));
                state.searchInput = '';
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
        },
        setFocusedProduct: (state, action: PayloadAction<ClothingProduct>) => {
            state.focusedProduct = action.payload;
        },
        setCartItemQuantity: (state, action: PayloadAction<CartItemSetQuantity>) => {
            const cartItem = state.cart.find((item) => item.id === action.payload.id);
            if(cartItem) cartItem.quantity = Math.max(1, cartItem.quantity + action.payload.value);
        },
        removeCartItem: (state, action: PayloadAction<string>) => {
            state.cart = state.cart.filter(item => item.id !== action.payload);
        }
    }
});

// Reducer actions
export const {setSearchInput, filterProducts, addToCart, setIsProductModalOpen, setFocusedProduct, setCartItemQuantity, removeCartItem} = webshopSlice.actions;

// Raw data selectors
export const selectSearchInput = (state: RootState) => state.webshop.searchInput;
export const selectFilteredProducts = (state: RootState) => state.webshop.filteredProducts;
export const selectCart = (state: RootState) => state.webshop.cart;
export const selectProducts = (state: RootState) => state.webshop.products;
export const selectIsProductModalOpen = (state: RootState) => state.webshop.isProductModalOpen;
export const selectFocusedProduct = (state: RootState) => state.webshop.focusedProduct;

// Memoized selectors, derived data
// Side note: 
// Memoized selectors remembers the result of the selector
// It keeps track of state changes and
// It also recomputes data accord to dependency (state) changes
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
                id: itemMap[cartItem.id].id,
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
            return {totalPrice: 0, valuta: 'kr'};
        }

        return cartItems.reduce<CartTotalPrice>((acc, item) => {
            acc.totalPrice += (item.price * item.quantity);
            return acc;
        }, {totalPrice: 0, valuta: 'kr'});
    }
);

export default webshopSlice.reducer;