import { useAppSelector, useAppDispatch } from '../app/hooks';
import { selectSearchInput, setSearchInput, filterProducts } from '../redux/webshopSlice';

export default function Searchbar():JSX.Element {

    const dispatch = useAppDispatch();
    const searchInput = useAppSelector(selectSearchInput);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => dispatch(setSearchInput(e.target.value));
    const handleButton = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        dispatch(filterProducts());
    }

    return (
        <form className="search">
            <input type="text" className="searchTerm" value={searchInput} onChange={onChange} placeholder='Search product...'/>
            <button type="submit" onClick={handleButton} className="searchButton">Search</button>
        </form>
    )
}