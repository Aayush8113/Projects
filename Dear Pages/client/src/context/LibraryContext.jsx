import React, { createContext, useState, useEffect, useCallback } from 'react';
import client from '../api/client';

export const LibraryContext = createContext();

export const LibraryProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshBooks = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await client.get('/books'); 
      setBooks(data.data || []); 
    } catch (err) {
      console.error("Vault Sync Error:", err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshBooks();
  }, [refreshBooks]);

  return (
    <LibraryContext.Provider value={{ books, loading, refreshBooks }}>
      {children}
    </LibraryContext.Provider>
  );
};