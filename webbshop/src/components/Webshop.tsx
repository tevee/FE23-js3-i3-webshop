import '../css/webshop.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Searchbar from "./Searchbar";
import SearchResult from "./SearchResult";
import ShoppingCart from "./ShoppingCart";

export default function Webshop():JSX.Element {
    return(
        <>
            <h1>The Magic Store</h1>
            <Searchbar/>
            <div className="webshop">
                <SearchResult/>
                <ShoppingCart/>
            </div>
        </>
    )
}