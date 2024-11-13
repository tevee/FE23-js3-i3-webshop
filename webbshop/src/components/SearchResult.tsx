/* 
    SearchResult Component
    Render product result of the input from the searchbar.
    Handles adding product to cart, updating product information for modal and displaying the modal.
*/

import { useAppSelector, useAppDispatch } from '../app/hooks';
import { selectFilteredProducts, addToCart, selectIsProductModalOpen, setIsProductModalOpen, setFocusedProduct } from "../redux/webshopSlice";
import ProductModal from './ProductModal';
import { ClothingProduct } from '../types/types';

export default function SearchResult():JSX.Element {

    const dispatch = useAppDispatch();
    const filteredProducts = useAppSelector(selectFilteredProducts);
    const isProductModalOpen = useAppSelector(selectIsProductModalOpen);

    const handleAddToCart = (e:React.MouseEvent<HTMLButtonElement>, productId: string): void => {
        e.preventDefault();
        dispatch(addToCart(productId))
    }

    const openProductModal = (e:React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        dispatch(setIsProductModalOpen(true));
    }

    const updateFocusedProduct = (e:React.MouseEvent<HTMLButtonElement>, item:ClothingProduct): void => {
        e.preventDefault();
        dispatch(setFocusedProduct(item));
    }

    return (
        <div className="search-result">
            <h2>{filteredProducts.length > 0 ? 'Search Result:' : 'No Results'}</h2>
            {filteredProducts.map((product, i) => (
                <div key={i} id={product.id} className="product-card border">
                    <figure className="product-card-img">
                        <img src={product.imgUrl}/>
                    </figure>
                    <div className="product-card-body">
                        <h4>{product.name}</h4>
                        <button onClick={(e) => {openProductModal(e); updateFocusedProduct(e, product)}} className="text-primary">Mer Information</button>
                    </div>
                    <div className="product-card-last">
                        <span className="product-price">{`${product.price} ${product.valuta}`}</span>
                        <button onClick={(e) => handleAddToCart(e, product.id)}>Add to cart</button>
                    </div>
                </div>
            ))}
            {isProductModalOpen && <ProductModal/>}
        </div>
    )
}