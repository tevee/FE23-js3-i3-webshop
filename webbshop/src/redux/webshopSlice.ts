import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../app/store';
import productsDB, { ClothingProduct } from '../db/fakerDB';

interface WebshopState {
    cart: Cart[];
    products: ClothingProduct[];
    filteredProducts: ClothingProduct[];
    searchInput: string;
}

type Cart = {
    id: string;
    quantity: number;
}

const initialState: WebshopState = {
    cart: [],
    products: productsDB,
    filteredProducts: [],
    searchInput: ''
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
            else state.cart.push({id: action.payload, quantity: 1})
            console.log(JSON.parse(JSON.stringify(state.cart)));  
        }
    }
});

export const {setSearchInput, filterProducts, addToCart} = webshopSlice.actions;

export const selectSearchInput = (state: RootState) => state.webshop.searchInput;
export const selectFilteredProducts = (state: RootState) => state.webshop.filteredProducts;
export const selectCart = (state: RootState) => state.webshop.cart;

export default webshopSlice.reducer;