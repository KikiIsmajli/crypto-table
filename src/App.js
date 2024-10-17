import React, { useState, useEffect } from 'react';  // Import React and necessary hooks
import axios from 'axios';                          // Import axios for API requests
import ReactPaginate from 'react-paginate';         // Import ReactPaginate for pagination
import './App.css';                                 // Import your CSS file

const App = () => {
  const [coins, setCoins] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);  // Current page state
  const [coinsPerPage] = useState(10);
  const [goToPage, setGoToPage] = useState('');  // New state for handling go-to-page input

  useEffect(() => {
    axios.get('https://api.coingecko.com/api/v3/coins/list')
      .then(response => setCoins(response.data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);  // Reset to the first page when search term changes
  };

  const handleGoToPageChange = (e) => {
    setGoToPage(e.target.value);  // Track the value of the input
  };

  const handleGoToPageSubmit = () => {
    const pageNumber = Number(goToPage) - 1;  // Convert input to 0-indexed page number
    if (pageNumber >= 0 && pageNumber < pageCount) {
      setCurrentPage(pageNumber);  // Update the page if valid
    } else {
      alert("Invalid page number");  // Optional: Alert if the page number is out of range
    }
  };

  const filteredCoins = coins.filter(coin =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const offset = currentPage * coinsPerPage;
  const currentCoins = filteredCoins.slice(offset, offset + coinsPerPage);
  const pageCount = Math.ceil(filteredCoins.length / coinsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);  // Update the current page when pagination is clicked
  };

  return (
    <div className="App">
      <h1>Crypto Table</h1>
      <input
        type="text"
        placeholder="Search by name or symbol..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Symbol</th>
          </tr>
        </thead>
        <tbody>
          {currentCoins.map(coin => (
            <tr key={coin.id}>
              <td>{coin.id}</td>
              <td>{coin.name}</td>
              <td>{coin.symbol}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        breakLabel={'...'}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        forcePage={currentPage}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />
      <div className="go-to-page">
        <input
          type="number"
          placeholder="Go to page..."
          value={goToPage}
          onChange={handleGoToPageChange}  // Track the input change
          min="1"
          max={pageCount}
        />
        <button onClick={handleGoToPageSubmit}>Go</button>  {/* Button to trigger page change */}
      </div>
    </div>
  );
};

export default App;
