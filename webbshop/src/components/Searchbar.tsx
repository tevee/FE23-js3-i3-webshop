/* 
    Searchbar Component
    Handles the search state
*/

import { useAppSelector, useAppDispatch } from '../app/hooks';
import { selectSearchInput, setSearchInput, getProducts } from '../redux/webshopSlice';

export default function Searchbar():JSX.Element {

    const dispatch = useAppDispatch();
    const searchInput = useAppSelector(selectSearchInput);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => dispatch(setSearchInput(e.target.value));
    const handleGetProducts = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        dispatch(getProducts(searchInput));
    }

    return (
        <form className="search">
            <input type="text" className="searchTerm" value={searchInput} onChange={onChange} placeholder='Search product e.g smartphone...'/>
            <button type="submit" onClick={handleGetProducts} className="searchButton">Search</button>
        </form>
    )
}