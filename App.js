import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, View, TouchableOpacity, Image, FlatList, TextInput, ActivityIndicator } from 'react-native';
import useCurrentTime from './hooks/useCurrentTime';
import useFetchSurahs from './hooks/useFetchSurahs';
import useFetchAyahs from './hooks/useFetchAyahs';
import useAutoScroll from './hooks/useAutoScroll';

const screenWidth = Dimensions.get('window').width;

export default function App() {

  
  
  const currentTime = useCurrentTime();
  const { surahs, filteredSurahs, setFilteredSurahs, loading, loadingMore, refreshing, handleLoadMore, handleRefresh } = useFetchSurahs();
  const { selectedSurah, setSelectedSurah, fetchAyahs } = useFetchAyahs();
  const [showSurahs, setShowSurahs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAyah, setSelectedAyah] = useState(null);
  const ayahListRef = useAutoScroll(selectedSurah, selectedAyah, setSelectedAyah);

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = surahs.filter(surah => surah.englishName.toLowerCase().includes(text.toLowerCase()));
    setFilteredSurahs(filtered);
  };
  const handleScrollEnd = () => {
    if (selectedSurah) {
      goToNextSurah();  // Go to the next Surah when reaching the end of the current Surah
    }
  };

  const handleScroll = (event) => {
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;

    if (contentOffsetY + layoutHeight >= contentHeight - 50) {
      // Scroll reached the bottom, load the next Surah
      if (selectedSurah) {
        goToNextSurah(selectedSurah.number, surahs);
      }
    } else if (contentOffsetY <= 0) {
      // Scroll reached the top, load the previous Surah
      if (selectedSurah) {
        goToPreviousSurah(selectedSurah.number, surahs);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('./assets/quran.png')} style={styles.logo} />
        <Text style={styles.title}>Quran</Text>
        <Text style={styles.timestamp}>{currentTime}</Text>
      </View>

      {!showSurahs ? (
        <TouchableOpacity style={styles.featureBox} onPress={() => setShowSurahs(true)}>
          <Text style={styles.featureText}>📖 Read Quran</Text>
        </TouchableOpacity>
      ) : selectedSurah ? (
        <View style={{ flex: 5, padding: 20 }}>
        <Text style={styles.surahTitle}>{selectedSurah.englishName}</Text>
        <FlatList
          ref={ayahListRef}
          data={selectedSurah?.ayahs || []}
          keyExtractor={(item) => item.number.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => setSelectedAyah(item.number)}>
              <Text
                style={[
                  styles.ayahText,
                  selectedAyah === item.number && styles.selectedAyah
                ]}
              >
                {item.text}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 20 }} // Adds space at bottom
        />

        {/* Back to Surah List Button */}
        <TouchableOpacity onPress={() => setSelectedSurah(null)} style={styles.backButton}>
          <Text style={styles.backButtonText}>🔙 Back to Surahs</Text>
        </TouchableOpacity>
      </View>
    ) : (
      
        <FlatList
  data={filteredSurahs || []} 
  keyExtractor={(item) => item?.number?.toString() || Math.random().toString()}
  renderItem={({ item }) => (
    <TouchableOpacity 
      style={styles.surahItem} 
      onPress={() => fetchAyahs(item?.number)}
    >
      <Text style={styles.surahText}>{item?.englishName}</Text>
      <Text style={styles.surahMeaning}>{item?.englishNameTranslation}</Text>
    </TouchableOpacity>
  )}
  onScroll={handleScroll}
  refreshing={refreshing}   
  onRefresh={handleRefresh} 
  onEndReached={handleLoadMore} 
  onEndReachedThreshold={0.8}  
  ListFooterComponent={loadingMore ? <ActivityIndicator size="large" color="#006400" /> : null}
/>

      
      )}</View>
  );
}
const styles = StyleSheet.create({
  
    container: {
      flex: 6,
    },
    greenHalf: {
      flex: 6,  // This makes the top half cover half the screen
      backgroundColor: 'green',  // Set the green background color
    },
    bottomHalf: {
      flex: 8,  // This makes the bottom half take the other half of the screen
      backgroundColor: 'beige',  // Set a gray background for the bottom half
      justifyContent: 'center',
      alignItems: 'center',
    },
  header: { flex: 5, backgroundColor: '#006400', justifyContent: 'center', alignItems: 'center', padding: 100 },
  logo: { width: 100, height: 100, resizeMode: 'contain', marginBottom: 10 },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#000000', 
    marginBottom: 20, 
    fontFamily: 'Amiri' // Custom Arabic-style font
  },
  timestamp: { color: '#000000',fontWeight: 'bold', fontSize: 15,fontFamily: 'Amiri' },
  featuresContainer: { flex: 3, justifyContent: 'center', alignItems: 'center' },
  featureBox: {flex:8, backgroundColor: '#F5F5DC', padding: 200, borderRadius: 10, margin: 10 },
  featureText: { fontSize: 16, fontWeight: 'bold' },
  surahListContainer: { flex: 1, padding: 20 },
  surahItem: { padding: 15, marginVertical: 5, backgroundColor: '#ddd', borderRadius: 10 },
  surahText: { color: '#006400',fontSize: 16, fontWeight: 'bold',fontFamily: 'Amiri' },
  ayahContainer: { flex: 1,padding: 20 },
  surahTitle: { fontSize: 22, fontWeight: 'bold', color: '#006400', textAlign: 'center',fontFamily: 'Amiri' },
 
    ayahText: { 
      fontSize: 28,  // Increase font size here (change as needed)
      color: '#000000', 
      marginVertical: 20,
       
      textAlign: 'right', 
      fontFamily: 'Amiri' // Ensures it uses the Amiri font
    },
  
  
  selectedAyah: {
    backgroundColor: '#FFD700', // Highlight color (Gold)
    padding: 5,
    borderRadius: 5
  },
  searchBar: { 
    backgroundColor: '#fff', 
    padding: 10, 
    borderRadius: 5, 
    marginBottom: 20, 
    fontSize: 16 
  },
  backButton: { backgroundColor: '#444', padding: 10, borderRadius: 5, alignSelf: 'center', marginTop: 10 },
  backButtonText: { color: '#fff', fontWeight: 'bold' }
}); 