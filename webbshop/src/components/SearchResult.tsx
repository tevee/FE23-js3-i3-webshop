/* 
    SearchResult Component
    Render product result of the input from the searchbar.
    Handles adding product to cart, updating product information for modal and displaying the modal.
*/

import { useAppSelector, useAppDispatch } from '../app/hooks';
import { 
    selectFetchedProducts, 
    addToCart, 
    selectIsProductModalOpen, 
    setIsProductModalOpen, 
    setFocusedProduct, 
    selectAverageRatings, 
    setProductRating,
    selectUpdatedReviews
} from "../redux/webshopSlice";
import ProductModal from './ProductModal';
import { Product } from '../types/types';

export default function SearchResult():JSX.Element {

    const dispatch = useAppDispatch();
    const isProductModalOpen = useAppSelector(selectIsProductModalOpen);
    const fetchedProducts = useAppSelector(selectFetchedProducts);
    const averageRatings = useAppSelector(selectAverageRatings);
    const updatedReviews = useAppSelector(selectUpdatedReviews);

    const handleAddToCart = (e:React.MouseEvent<HTMLButtonElement>, item: Product): void => {
        e.preventDefault();
        dispatch(addToCart(item))
    }

    const openProductModal = (e:React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        dispatch(setIsProductModalOpen(true));
    }

    const updateFocusedProduct = (e:React.MouseEvent<HTMLButtonElement>, item: Product): void => {
        e.preventDefault();
        dispatch(setFocusedProduct(item));
    }

    const addRating = (e:React.MouseEvent<HTMLButtonElement>, itemId: number) => {
        e.preventDefault();
        const productRating = Number(e.currentTarget.id);
        dispatch(setProductRating({[itemId]: productRating}));
    }

    return (
        <div className="search-result">
            <h2>{fetchedProducts.products && fetchedProducts.products.length > 0 ? 'Search Result:' : 'No Results, try searching for e.g samsung, iphone, laptop...'}</h2>
            {fetchedProducts.products && fetchedProducts.products.map(product => (
                <div key={product.id} id={product.id.toString()} className="product-card border">
                    <figure className="product-card-img">
                        <img src={product.images[0]} alt={product.title}/>
                    </figure>
                    <div className="product-card-body">
                        <h4>{product.title}</h4>
                        <div className="product-card-rating">
                            {Array.from({ length: 5 }, (_, index) => (
                                <button key={index} id={`${index+1}`} onClick={(e) => addRating(e, product.id)}>
                                    <i className={
                                        index < Math.round(averageRatings[product.id])
                                        ? 'bi bi-star-fill'
                                        : 'bi bi-star'
                                    }
                                    ></i>
                                </button>
                            ))}
                            ({updatedReviews[product.id].length})
                        </div>
                        <button onClick={(e) => {openProductModal(e); updateFocusedProduct(e, product)}} className="text-primary">Mer Information</button>
                    </div>
                    <div className="product-card-last">
                        <span className="product-price">{`${product.price} $`}</span>
                        <button onClick={(e) => handleAddToCart(e, product)}>Add to cart</button>
                    </div>
                </div>
            ))}
            {isProductModalOpen && <ProductModal/>}
        </div>
    )
}