import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';
import { FaSearch } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

// ✅ Debounced search function
const debouncedSearch = debounce(
  async (query, setResults, setLoading, setError, setRawData) => {
    if (!query || query.trim().length === 0) {
      setResults([]);
      setRawData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const url = `https://backend-mars-hub.onrender.com/api/v1/users/search?query=${encodeURIComponent(query)}`;
      console.log('Fetching users from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Raw response data:', data);
      setResults(data.data);
      setRawData(data.data);
    } catch (error) {
      console.error('Search error:', error);
      setError(`Failed to load search results: ${error.message}`);
      setRawData(null);
      toast.error(`Error searching users: ${error.message}`);
    } finally {
      setLoading(false);
    }
  },
  500
);

const SearchUsers = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [rawData, setRawData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // ✅ navigation hook

  const handleSearch = useCallback((e) => {
    const value = e.target.value;
    setQuery(value);
    setError(null);
    debouncedSearch(value, setResults, setLoading, setError, setRawData);
  }, []);

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setRawData(null);
    setError(null);
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, []);

  return (
    <div className="w-full min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center p-4 transition-colors duration-300">
      <div className="w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-6 text-center">
          Search Users
        </h2>

        <div className="relative mb-6">
          <div className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow-md p-2">
            <FaSearch className="text-gray-500 dark:text-gray-400 ml-3" />
            <input
              type="text"
              value={query}
              onChange={handleSearch}
              placeholder="Search for users by username or name..."
              className="w-full p-2 pl-3 text-gray-700 dark:text-gray-200 bg-transparent rounded-full focus:outline-none"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="text-gray-500 dark:text-gray-400 mr-3 hover:text-gray-700 dark:hover:text-gray-200"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
          </div>
        )}

        {error && (
          <div className="text-red-500 dark:text-red-400 text-center py-4">
            {error}
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <div className="grid gap-4">
            {results.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm hover:shadow-md"
              >
                <div className="flex items-center">
                  <img
                   src={`https://backend-mars-hub.onrender.com${user.profileImage}`}
                   alt={user.username || "User"}
                   crossOrigin="anonymous"
                    className="w-12 h-12 rounded-full object-cover mr-4"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/50x50';
                    }}
                  />
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{user.username}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.firstName || 'No name'}</p>
                  </div>
                </div>
                <Link
                  className="btn btn-sm btn-outline dark:btn-ghost flex items-center space-x-1"
                  title="see"
                  to={`/profile/${user.username}`}
                >
                  <span>See profil</span>
                </Link>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && query && results.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No users found for "{query}"
          </div>
        )}

        {!loading && !query && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Type to search for users
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchUsers;
