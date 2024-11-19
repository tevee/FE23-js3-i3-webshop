/* 
    Webshop Slice
    Handles the Webshop reducer
*/

import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../app/store';
import { 
    WebshopState, 
    CartItemSetQuantity, 
    CartTotalPrice, 
    Product, 
    ProductsResponse, 
    RatingsMap, 
    RatedProducts, 
    UpdatedReviewsMap
} from '../types/types';

const initialState: WebshopState = {
    cart: [],
    searchInput: '',
    isProductModalOpen: false,
    focusedProduct: null,
    fetchedProducts: {
        products: [],
        status: 'idle',
        error: '',
    },
    fetchedProductsDropdown: {
        products: [],
        status: 'idle',
        error: '',
    },
    ratedProducts: {}
}

export const webshopSlice = createSlice({
    name: 'webshop',
    initialState,
    reducers: {
        setSearchInput: (state, action: PayloadAction<string>) => {state.searchInput = action.payload},
        addToCart: (state, action: PayloadAction<Product>) => {
            const existingCartItem = state.cart.find((item) => item.details.id === action.payload.id);
            if(existingCartItem) existingCartItem.quantity += 1;
            else state.cart.push({details: action.payload, quantity: 1});
        },
        setIsProductModalOpen: (state, action: PayloadAction<boolean>) => {
            state.isProductModalOpen = action.payload
        },
        setFocusedProduct: (state, action: PayloadAction<Product>) => {
            state.focusedProduct = action.payload;
        },
        setCartItemQuantity: (state, action: PayloadAction<CartItemSetQuantity>) => {
            const cartItem = state.cart.find((item) => item.details.id.toString() === action.payload.id);
            if(cartItem) cartItem.quantity = Math.max(1, cartItem.quantity + action.payload.value);
        },
        removeCartItem: (state, action: PayloadAction<string>) => {
            state.cart = state.cart.filter(item => item.details.id.toString() !== action.payload);
        },
        clearFetchedProductsDropdownState: (state) => {
            state.fetchedProductsDropdown.status = 'idle';
            state.fetchedProductsDropdown.products = null;
        },
        clearSearchInput: (state) => {
            state.searchInput = '';
        },
        setProductRating: (state, action: PayloadAction<RatedProducts>) => {
            Object.assign(state.ratedProducts, action.payload);
        }
    },
    extraReducers: builder => {
        builder.addCase(getProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
            state.fetchedProducts.status = 'succeeded';
            state.fetchedProducts.products = action.payload;
            state.searchInput = '';
        });
        builder.addCase(getProductsDropdown.fulfilled, (state, action: PayloadAction<Product[]>) => {
            state.fetchedProductsDropdown.status = 'succeeded';
            state.fetchedProductsDropdown.products = action.payload;
        })
        builder.addCase(getProductById.fulfilled, (state, action: PayloadAction<Product>) => {
            state.fetchedProducts.status = 'succeeded';
            state.fetchedProducts.products = [action.payload];
            state.searchInput = '';
        })
    }
});

// Async Thunks
export const getProducts = createAsyncThunk<Product[], string>('webshop/getProducts', async (searchResult: string) => {
    const productParams = 'select=id,title,description,stock,price,brand,category,images,reviews,dimensions';
    const refinedSearchResult = searchResult.toLowerCase().trim();

    const response = await fetch(`https://dummyjson.com/products/search?q=${refinedSearchResult}&limit=10&${productParams}`);
    if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data: ProductsResponse = await response.json();
    return data.products;
})

export const getProductsDropdown = createAsyncThunk<Product[], string>('webshop/getProductsDropdown', async (searchResult: string) => {
    const productParams = 'select=id,title,images';
    const refinedSearchResult = searchResult.toLowerCase().trim();

    const response = await fetch(`https://dummyjson.com/products/search?q=${refinedSearchResult}&limit=3&${productParams}`);
    if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data: ProductsResponse = await response.json();
    return data.products;
})

export const getProductById = createAsyncThunk<Product, string>('webshop/getProductById', async (id: string) => {
    const productParams = 'select=id,title,description,stock,price,brand,category,images,reviews,dimensions';

    const response = await fetch(`https://dummyjson.com/products/${id}?${productParams}`);
    if(!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data: Product = await response.json();
    return data;
})

// Raw data selectors
export const selectSearchInput = (state: RootState) => state.webshop.searchInput;
export const selectCart = (state: RootState) => state.webshop.cart;
export const selectIsProductModalOpen = (state: RootState) => state.webshop.isProductModalOpen;
export const selectFocusedProduct = (state: RootState) => state.webshop.focusedProduct;
export const selectFetchedProducts = (state: RootState) => state.webshop.fetchedProducts;
export const selectFetchedProductsDropdown = (state: RootState) => state.webshop.fetchedProductsDropdown;
const selectRatedProducts = (state: RootState) => state.webshop.ratedProducts;

// Memoized selectors, derived data
// Memoized selectors remembers the result of the selector
// It keeps track of state changes and
// It also recomputes data accord to dependency (state) changes
export const selectCartSummary = createSelector(
    [selectCart],
    (cartItems): CartTotalPrice => {
        if(!cartItems || cartItems.length === 0) {
            return {totalPrice: 0, valuta: '$'};
        }

        return cartItems.reduce<CartTotalPrice>((acc, item) => {
            acc.totalPrice = Math.round((acc.totalPrice + item.details.price * item.quantity) * 100) / 100;
            return acc;
        }, {totalPrice: 0, valuta: '$'});
    }
);

export const selectAverageRatings = createSelector(
    [selectFetchedProducts, selectRatedProducts],
    (fetchedProducts, ratedProducts): RatingsMap => {
        const ratingsMap: RatingsMap = {};
        
        fetchedProducts?.products?.forEach((item) => {         
            if(item.reviews && item.reviews.length > 0) {
                const userRating: number = ratedProducts[item.id];
                const reviews = userRating ? [...item.reviews, {rating: userRating}] : item.reviews;
                const totalRating: number = reviews.reduce((acc, review) => acc + review.rating, 0);
                ratingsMap[item.id] = totalRating / item.reviews.length;
            } 
            else ratingsMap[item.id] = 0;
        })
        return ratingsMap;
    }
)

export const selectUpdatedReviews = createSelector(
    [selectFetchedProducts, selectRatedProducts],
    (fetchedProducts, ratedProducts): UpdatedReviewsMap => {
        const updatedReviewsMap: UpdatedReviewsMap = {};

        fetchedProducts?.products?.forEach(item => {
            const userRating: number = ratedProducts[item.id];
            const updatedReviews = userRating ? [...item.reviews, {rating: userRating}] : item.reviews;
            updatedReviewsMap[item.id] = updatedReviews;
        })
        return updatedReviewsMap;
    }
)

// Reducer actions
export const {
    setSearchInput,
    addToCart,
    setIsProductModalOpen,
    setFocusedProduct, setCartItemQuantity,
    removeCartItem,
    clearFetchedProductsDropdownState,
    clearSearchInput,
    setProductRating
} = webshopSlice.actions;

export default webshopSlice.reducer;