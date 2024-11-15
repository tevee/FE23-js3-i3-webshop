/* 
    Searchbar Component
    Handles the search state
*/

import { useAppSelector, useAppDispatch } from '../app/hooks';
import { 
    selectSearchInput,
    setSearchInput,
    getProducts,
    selectFetchedProductsDropdown,
    getProductsDropdown,
    clearFetchedProductsDropdownState,
    clearSearchInput,
    getProductById,
} from '../redux/webshopSlice';
import { useEffect } from 'react';

export default function Searchbar():JSX.Element {
    const dispatch = useAppDispatch();
    const searchInput = useAppSelector(selectSearchInput);
    const fetchedProductsDropdown = useAppSelector(selectFetchedProductsDropdown);

    useEffect(() => {
        const timer = setTimeout(() => {
            if(searchInput.length > 2) dispatch(getProductsDropdown(searchInput));
            else dispatch(clearFetchedProductsDropdownState());
        }, 500);

        return () => clearTimeout(timer);
    }, [searchInput, dispatch])

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => dispatch(setSearchInput(e.target.value));
    const handleGetProducts = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        dispatch(getProducts(searchInput));
    }
    const handleClearSearchInput = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        dispatch(clearSearchInput());
    }

    const getProductInDropdown = (e: React.MouseEvent<HTMLLIElement>, id:string) => {
        e.preventDefault();
        dispatch(getProductById(id));
    }

    return (
        <div className="search-container">
            <form className="search">
                <div className="input-container">
                    <input type="text" className="searchTerm" value={searchInput} onChange={onChange} placeholder='Search product e.g smartphone...'/>
                    {searchInput.length > 0 && 
                    <button onClick={handleClearSearchInput} type="button">
                        <i className="bi bi-x-circle"></i>
                    </button>}
                </div>
                <button type="submit" onClick={handleGetProducts} className="searchButton">Search</button>
                <ul id="dropdownList" className={`search-dropdown ${searchInput.length < 1 && 'hidden'}`}>
                    {
                        fetchedProductsDropdown.products && fetchedProductsDropdown.products.length > 0 ?
                        fetchedProductsDropdown.products.map(item => (
                            <li key={item.id} onClick={(e) => getProductInDropdown(e, item.id.toString())}>
                                <figure>
                                    <img src={item.images[0]} alt={item.title}/>
                                </figure>
                                <span>{item.title}</span>
                            </li>
                        ))
                        : searchInput.length > 0 && <li>No Results found, did you forget to type at least 3 letters?</li>
                    }
                </ul>
            </form>
        </div>
    )
}