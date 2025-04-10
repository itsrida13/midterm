import { useState, useEffect } from 'react';

export default function useFetchSurahs() {
  const [surahs, setSurahs] = useState([]);
  const [filteredSurahs, setFilteredSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchSurahs(1);
  }, []);

  const fetchSurahs = async (pageNumber = 1) => {
    if (pageNumber > totalPages) return; // Stop fetching if all pages are loaded
  
    if (pageNumber === 1) setLoading(true);
    else setLoadingMore(true);
  
    try {
      const response = await fetch('https://api.alquran.cloud/v1/surah');
      const json = await response.json();
  
      if (json.code === 200 && json.data) {
        setSurahs(json.data);///////////
        const itemsPerPage = 10;  // Number of Surahs per page
        const total = Math.ceil(json.data.length / itemsPerPage);
        setTotalPages(total);
  
        const startIndex = (pageNumber - 1) * itemsPerPage;
        const newSurahs = json.data.slice(startIndex, startIndex + itemsPerPage);
  
        setSurahs((prevSurahs) => [...prevSurahs, ...newSurahs]);
        setFilteredSurahs((prevFiltered) => [...prevFiltered, ...newSurahs]);
      }
    } catch (error) {
      console.error("Error fetching Surahs:", error);
    }
  
    if (pageNumber === 1) setLoading(false);
    else setLoadingMore(false);
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    setSurahs([]);
    setFilteredSurahs([]);
    await fetchSurahs();////////
    setRefreshing(false);
  };



  const handleLoadMore = () => {
    if (!loadingMore && page < totalPages) {
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        fetchSurahs(nextPage);
        return nextPage;
      });
    }
  };
  

  return { surahs, filteredSurahs, setFilteredSurahs, loading, loadingMore, refreshing, handleLoadMore, handleRefresh };
}