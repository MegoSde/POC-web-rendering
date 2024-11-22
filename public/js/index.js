import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

function App() {
    const [menu, setMenu] = useState([]);
    const [filters, setFilters] = useState({});
    const [imgDir, setImgDir] = useState('imgopti');
    const [imgExt, setImgExt] = useState('webp');

    useEffect(() => {
        fetch('/api/menu')
            .then((response) => response.json())
            .then((data) => {
                setMenu(data);

                // Initialize filters with all categories checked
                const initialFilters = {};
                data.forEach((category) => {
                    initialFilters[category.category] = true;
                });
                setFilters(initialFilters);
            });

        // Check for query parameters to set imgDir and imgExt
        const params = new URLSearchParams(window.location.search);
        const imgParam = params.get('img');
        if (imgParam === 'jpg') {
            setImgDir('img');
            setImgExt('jpg');
        } else if (imgParam === 'png') {
            setImgDir('imgsize');
            setImgExt('png');
        }
    }, []);

    const handleFilterChange = (category) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [category]: !prevFilters[category],
        }));
    };

    return (
        <div>
            <h1>Cafe Menu</h1>
            <details>
                <summary>
                    <h2>Filter</h2>
                </summary>
                <div>
                    {menu.map((category) => (
                        <fieldset key={category.category}>
                            <input
                                type="checkbox"
                                id={`category-${category.category}`}
                                name={category.category}
                                value={category.category}
                                checked={filters[category.category] || false}
                                onChange={() => handleFilterChange(category.category)}
                            />
                            <label htmlFor={`category-${category.category}`}>{category.category}</label>
                        </fieldset>
                    ))}
                </div>
            </details>

            <ul>
                {menu.map((category) =>
                    filters[category.category] ? (
                        category.items.map((item) => (
                            <li key={item.title} className={`category-${category.category}`}>
                                <h3>{item.title}</h3>
                                <img
                                    src={`/${imgDir}/${item.image}.${imgExt}`}
                                    alt={item.title}
                                    width="300px"
                                    height="300px"
                                />
                                <p>{item.description}</p>
                                <h4>{item.price},-</h4>
                            </li>
                        ))
                    ) : null
                )}
            </ul>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
