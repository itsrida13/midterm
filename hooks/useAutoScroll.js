import { useRef, useEffect, useState } from 'react';

export default function useAutoScroll(selectedSurah, selectedAyah, setSelectedAyah) {
  const ayahListRef = useRef(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);  // ✅ Allow pausing

  useEffect(() => {
    if (selectedAyah && selectedSurah) {
      const index = selectedSurah.ayahs.findIndex(ayah => ayah.number === selectedAyah);
      if (index !== -1) {
        ayahListRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.5 });
      }
    }
  }, [selectedAyah]);

  useEffect(() => {
    if (isAutoScrolling && selectedAyah !== null && selectedSurah) {
      const currentIndex = selectedSurah.ayahs.findIndex(ayah => ayah.number === selectedAyah);
      if (currentIndex !== -1 && currentIndex < selectedSurah.ayahs.length - 1) {
        const nextAyahNumber = selectedSurah.ayahs[currentIndex + 1].number;
        const timer = setTimeout(() => {
          setSelectedAyah(nextAyahNumber);
        }, 2000);

        return () => clearTimeout(timer);
      }
    }
  }, [selectedAyah, isAutoScrolling]);

  return { ayahListRef, isAutoScrolling, setIsAutoScrolling };
}