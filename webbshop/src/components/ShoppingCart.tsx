import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectCart, selectProducts } from "../redux/webshopSlice";
import { ClothingProduct } from "../db/fakerDB";

export default function ShoppingCart():JSX.Element {

    const dispatch = useAppDispatch();
    const cart = useAppSelector(selectCart);
    const productsDB = useAppSelector(selectProducts);

    const getCartItems = () => {
        const cartItems = cart.map((product, i) => product.id === productsDB[i].id)
        console.log(cartItems);
        return cartItems
    }

    return (
        <div className="cart">
            <h2>Shopping Cart</h2>
            {cart && getCartItems()}
            <h3>Total Price: 0 SEK</h3>
        </div>
    )
}