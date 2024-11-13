import { useAppSelector } from "../app/hooks";
import { selectCartItems, selectCartSummary } from "../redux/webshopSlice";

export default function ShoppingCart():JSX.Element {

    const cartItems = useAppSelector(selectCartItems);
    const {totalPrice, valuta} = useAppSelector(selectCartSummary);

    return (
        <div className="cart">
            <h2>Shopping Cart</h2>
            {cartItems.map((item, i) => (
                <div key={i} className="cart-item border">
                    <figure className="cart-item-figure">
                        <img src={item.imgUrl}/>
                    </figure>
                    <div className="cart-item-body">
                        <h3>{item.name}</h3>
                        <span>Quantity: {item.quantity}</span>
                        <span>Price Total: {item.price * item.quantity} {item.valuta}</span>
                    </div>
                    <div className="cart-item-body-right">
                        <button className="cart-item-btn-remove">
                            <i className="bi bi-trash3"></i>
                        </button>
                    </div>
              </div>
            ))}
            <h3>Total Price: {totalPrice} {valuta}</h3>
        </div>
    )
}