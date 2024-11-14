/* 
    Webshop Slice
    Handles the Webshop reducer
*/

import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { WebshopState, CartItem, CartItemSetQuantity, CartTotalPrice, Product, ProductsResponse} from '../types/types';

const initialState: WebshopState = {
    cart: [],
    searchInput: '',
    isProductModalOpen: false,
    focusedProduct: null,
    fetchedProducts: null
}

export const webshopSlice = createSlice({
    name: 'webshop',
    initialState,
    reducers: {
        setSearchInput: (state, action: PayloadAction<string>) => {state.searchInput = action.payload},
        addToCart: (state, action: PayloadAction<string>) => {
            const existingCartItem = state.cart.find((item) => item.id === action.payload);
            if(existingCartItem) existingCartItem.quantity += 1;
            else state.cart.push({id: action.payload, quantity: 1});
            console.log(JSON.parse(JSON.stringify(state.cart)));  
        },
        setIsProductModalOpen: (state, action: PayloadAction<boolean>) => {
            state.isProductModalOpen = action.payload
        },
        setFocusedProduct: (state, action: PayloadAction<Product>) => {
            state.focusedProduct = action.payload;
        },
        setCartItemQuantity: (state, action: PayloadAction<CartItemSetQuantity>) => {
            const cartItem = state.cart.find((item) => item.id === action.payload.id);
            if(cartItem) cartItem.quantity = Math.max(1, cartItem.quantity + action.payload.value);
        },
        removeCartItem: (state, action: PayloadAction<string>) => {
            state.cart = state.cart.filter(item => item.id !== action.payload);
        }
    },
    extraReducers: builder => {
        builder.addCase(getProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
            state.fetchedProducts = action.payload;
            state.searchInput = '';
            console.log(state.fetchedProducts);
        })
    }
});

// Async Thunks
export const getProducts = createAsyncThunk<Product[], string>('webshop/getProducts', async (searchResult: string) => {
    const productParams = 'select=id,title,description,stock,price,brand,category,images,rating,dimensions';
    const refinedSearchResult = searchResult.toLowerCase().trim();

    const response = await fetch(`https://dummyjson.com/products/search?q=${refinedSearchResult}&limit=10&${productParams}`);
    if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data: ProductsResponse = await response.json();
    return data.products;
})

// Reducer actions
export const {setSearchInput, addToCart, setIsProductModalOpen, setFocusedProduct, setCartItemQuantity, removeCartItem} = webshopSlice.actions;

// Raw data selectors
export const selectSearchInput = (state: RootState) => state.webshop.searchInput;
export const selectCart = (state: RootState) => state.webshop.cart;
export const selectIsProductModalOpen = (state: RootState) => state.webshop.isProductModalOpen;
export const selectFocusedProduct = (state: RootState) => state.webshop.focusedProduct;
export const selectFetchedProducts = (state: RootState) => state.webshop.fetchedProducts;

// Memoized selectors, derived data
// Side note: 
// Memoized selectors remembers the result of the selector
// It keeps track of state changes and
// It also recomputes data accord to dependency (state) changes
export const selectCartItems = createSelector(
    [selectFetchedProducts, selectCart], 
    (products, cart): CartItem[] => {
        if(!products) return [];
        const itemMap = products.reduce<{[key: string]: Product}>((acc, item) => {
            acc[item.id] = item;
            return acc;
        }, {})

        return cart.map(cartItem => {
            if(!itemMap[cartItem.id]) return null;
            return {
                id: itemMap[cartItem.id].id.toString(),
                name: itemMap[cartItem.id].title,
                price: itemMap[cartItem.id].price,
                valuta: '$',
                images: itemMap[cartItem.id].images,
                quantity: cartItem.quantity
            }
        }) as CartItem[];
});

export const selectCartSummary = createSelector(
    [selectCartItems],
    (cartItems): CartTotalPrice => {
        if(!cartItems || cartItems.length === 0) {
            return {totalPrice: 0, valuta: '$'};
        }

        return cartItems.reduce<CartTotalPrice>((acc, item) => {
            acc.totalPrice = Math.round((acc.totalPrice + item.price * item.quantity) * 100) / 100;
            return acc;
        }, {totalPrice: 0, valuta: '$'});
    }
);

export default webshopSlice.reducer;