import { useAppSelector, useAppDispatch } from '../app/hooks';
import { selectFilteredProducts, addToCart } from "../redux/webshopSlice";

export default function SearchResult():JSX.Element {

    const dispatch = useAppDispatch();
    const filteredProducts = useAppSelector(selectFilteredProducts);

    const handleAddToCart = (e:React.MouseEvent<HTMLButtonElement>, productId: string) => {
        e.preventDefault();
        dispatch(addToCart(productId))
    }

    return (
        <div className="search-result">
            <h2>{filteredProducts.length > 0 ? 'Search Result:' : 'No Results'}</h2>
            {filteredProducts.map((product, i) => (
                <div key={i} id={product.id} className="product-card border">
                    <figure className="product-img">
                        <img src={product.imgUrl}/>
                    </figure>
                    <div className="product-card-body">
                        <h3>{product.name}</h3>
                        <a>Mer Information</a>
                        <span className="product-price">{`${product.price} ${product.valuta}`}</span>
                    </div>
                    <button onClick={(e) => handleAddToCart(e, product.id)}>Add to cart</button>
                </div>
            ))}
        </div>
    )
}