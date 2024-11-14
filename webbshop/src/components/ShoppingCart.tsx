/* 
    ShoppingCart Component
    Handles updating quantity and removing cartItems.
*/

import { useAppSelector, useAppDispatch } from "../app/hooks";
import { selectCartItems, selectCartSummary, setCartItemQuantity, removeCartItem } from "../redux/webshopSlice";

export default function ShoppingCart():JSX.Element {

    const dispatch = useAppDispatch();
    const cartItems = useAppSelector(selectCartItems);
    const {totalPrice, valuta} = useAppSelector(selectCartSummary);

    const setQuantity = (e:React.MouseEvent<HTMLButtonElement>, id:string): void => {
        e.preventDefault(); 
        const value:number = Number(e.currentTarget.dataset.value);
        dispatch(setCartItemQuantity({id, value}));
    }

    const handleRemoveCartItem = (e:React.MouseEvent<HTMLButtonElement>, id:string): void => {
        e.preventDefault();
        dispatch(removeCartItem(id));
    }

    return (
        <div className="cart">
            <h2>Shopping Cart</h2>
            {cartItems.map((item, i) => (
                <div key={i} className="cart-item border">
                    <figure className="cart-item-figure">
                        <img src={item.images[0]}/>
                    </figure>
                    <div className="cart-item-body">
                        <h4>{item.name}</h4>
                        <span>{item.price} kr</span>
                        <div className="cart-item-body-quantity">
                            <button 
                                onClick={(e) => setQuantity(e, item.id)}
                                data-value={-1}
                                data-quantity={item.quantity}
                                disabled={item.quantity <= 1}
                                >
                                <i className="bi bi-dash-lg"></i>
                            </button>
                            <span>{item.quantity}</span>
                            <button onClick={(e) => setQuantity(e, item.id)} data-value={1}>
                                <i className="bi bi-plus-lg"></i>
                            </button>
                        </div>
                        <span>Subtotal: {(item.price * item.quantity).toFixed(2)} {item.valuta}</span>
                    </div>
                    <div className="cart-item-body-right">
                        <button onClick={(e) => handleRemoveCartItem(e, item.id)} className="cart-item-btn-remove">
                            <i className="bi bi-trash3"></i>
                        </button>
                    </div>
              </div>
            ))}
            {
                cartItems.length > 0 
                ? <div className="cart-total">
                    <h3>Total Price:</h3>
                    <h3>{totalPrice} {valuta}</h3>
                </div>
                : <h4>Cart is empty</h4>
            }
        </div>
    )
}