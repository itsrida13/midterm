import { useState, useEffect } from 'react';

export default function useFetchAyahs() {
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [surahsList, setSurahsList] = useState([]); // Added surahsList state
  const [loading, setLoading] = useState(false);

  // Fetch the list of Surahs on initial load
  useEffect(() => {
    const fetchSurahList = async () => {
      try {
        const response = await fetch('https://api.alquran.cloud/v1/surah');
        const json = await response.json();
        setSurahsList(json.data); // Set the Surah list
      } catch (error) {
        console.error("Error fetching Surah list:", error);
      }
    };
    fetchSurahList();
  }, []);

  // Fetch Ayahs of a specific Surah
  const fetchAyahs = async (surahNumber) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`);
      const json = await response.json();

      if (json.code === 200 && json.data) {
        setSelectedSurah(json.data);  // Set the Surah data (Arabic text)
      } else {
        console.error("Error: Unexpected response format", json);
      }
    } catch (error) {
      console.error("Error fetching Ayahs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Go to the next Surah
  const goToNextSurah = (currentSurahNumber) => {
    const nextSurahIndex = (surahsList.findIndex(surah => surah.number === currentSurahNumber) + 1) % surahsList.length;
    const nextSurah = surahsList[nextSurahIndex];
    fetchAyahs(nextSurah.number);
  };

  // Go to the previous Surah
  const goToPreviousSurah = (currentSurahNumber) => {
    const previousSurahIndex = (surahsList.findIndex(surah => surah.number === currentSurahNumber) - 1 + surahsList.length) % surahsList.length;
    const previousSurah = surahsList[previousSurahIndex];
    fetchAyahs(previousSurah.number);
  };

  // Handle refresh to reload previous Surah
  const handleRefresh = async () => {
    if (selectedSurah) {
      goToPreviousSurah(selectedSurah.number); // Load the previous Surah
    }
  };

  useEffect(() => {
    return () => {
      setSelectedSurah(null);  // Reset Surah when leaving the Ayah screen
    };
  }, []);

  return { selectedSurah, setSelectedSurah, fetchAyahs, goToNextSurah, goToPreviousSurah, loading, surahsList, handleRefresh };
}
