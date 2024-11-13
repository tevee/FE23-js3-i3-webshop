/* 
    This is the Webshop component containing components that completes the webshop.
*/

import '../css/webshop.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Searchbar from "./Searchbar";
import SearchResult from "./SearchResult";
import ShoppingCart from "./ShoppingCart";

export default function Webshop():JSX.Element {
    return(
        <>
            <header>
                    <h1>The Magic Store</h1>
            </header>
            <main>
                <Searchbar/>
                <div className="webshop">
                    <SearchResult/>
                    <ShoppingCart/>
                </div>
            </main>
        </>
    )
}