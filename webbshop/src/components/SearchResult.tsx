/* 
    SearchResult Component
    Render product result of the input from the searchbar.
    Handles adding product to cart, updating product information for modal and displaying the modal.
*/

import { useAppSelector, useAppDispatch } from '../app/hooks';
import { selectFetchedProducts, addToCart, selectIsProductModalOpen, setIsProductModalOpen, setFocusedProduct } from "../redux/webshopSlice";
import ProductModal from './ProductModal';
import { Product } from '../types/types';

export default function SearchResult():JSX.Element {

    const dispatch = useAppDispatch();
    const isProductModalOpen = useAppSelector(selectIsProductModalOpen);
    const fetchedProducts = useAppSelector(selectFetchedProducts);

    const handleAddToCart = (e:React.MouseEvent<HTMLButtonElement>, productId: string): void => {
        e.preventDefault();
        dispatch(addToCart(productId))
    }

    const openProductModal = (e:React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        dispatch(setIsProductModalOpen(true));
    }

    const updateFocusedProduct = (e:React.MouseEvent<HTMLButtonElement>, item: Product): void => {
        e.preventDefault();
        dispatch(setFocusedProduct(item));
    }

    return (
        <div className="search-result">
            <h2>{fetchedProducts && fetchedProducts.length > 0 ? 'Search Result:' : 'No Results'}</h2>
            {fetchedProducts && fetchedProducts.map((product, i) => (
                <div key={i} id={product.id.toString()} className="product-card border">
                    <figure className="product-card-img">
                        <img src={product.images[0]}/>
                    </figure>
                    <div className="product-card-body">
                        <h4>{product.title}</h4>
                        <button onClick={(e) => {openProductModal(e); updateFocusedProduct(e, product)}} className="text-primary">Mer Information</button>
                    </div>
                    <div className="product-card-last">
                        <span className="product-price">{`${product.price} $`}</span>
                        <button onClick={(e) => handleAddToCart(e, product.id.toString())}>Add to cart</button>
                    </div>
                </div>
            ))}
            {isProductModalOpen && <ProductModal/>}
        </div>
    )
}