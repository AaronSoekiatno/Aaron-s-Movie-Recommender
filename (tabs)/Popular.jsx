import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from 'react-native-elements';
import axios from 'axios';

// screen dimensions
const { width: screenWidth } = Dimensions.get('window');

// responsive helpers
const isSmallScreen = screenWidth < 375;
const isMediumScreen = screenWidth >= 375 && screenWidth < 414;

const responsiveFont = (small, medium, large) => {
  if (isSmallScreen) return small;
  if (isMediumScreen) return medium;
  return large;
};

const responsiveSpacing = (small, medium, large) => {
  if (isSmallScreen) return small;
  if (isMediumScreen) return medium;
  return large;
};

export default function PopularScreen() {
  const [movies, setMovies] = useState([]);

  const timeConvert = (num) => {
    const hours = Math.floor(num / 60);
    const minutes = num % 60;
    return `${hours} hrs ${minutes} mins`;
  };

  const parseRatingToFiveScale = (voteAverage) => {
    const numeric = Number(voteAverage);
    if (Number.isNaN(numeric) || numeric <= 0) return 0;
    const scaled = Math.max(0, Math.min(5, numeric / 2));
    return scaled;
  };

  const renderStarRow = (valueOutOfFive) => {
    const rounded = Math.round(valueOutOfFive);
    const stars = [0, 1, 2, 3, 4];
    return (
      <View style={{ flexDirection: 'row' }}>
        {stars.map((index) => (
          <Icon
            key={index}
            name={index < rounded ? 'star' : 'star-o'}
            type={'font-awesome'}
            color={'#FFD700'}
            size={responsiveFont(14, 16, 18)}
          />
        ))}
      </View>
    );
  };

  const getMovies = async () => {
    try {
      const url = 'http://localhost:5000/popular-movies';
      const response = await axios.get(url);
      setMovies(response.data.data || []);
    } catch (error) {
      console.log('Error fetching popular movies:', error.message);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  const renderItem = ({ item }) => {
    const year = (item.release_date || 'N/A').split('-')[0];
    return (
      <View style={styles.card}>
        <Image source={{ uri: item.poster_link }} style={styles.poster} />
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.cardMeta}>{`${year} | ${timeConvert(item.duration)}`}</Text>
          <View style={{ marginTop: responsiveSpacing(6, 7, 8) }}>
            {renderStarRow(parseRatingToFiveScale(item.rating))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={movies}
        keyExtractor={(item, idx) => `${item.title}-${idx}`}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1328',
  },
  listContent: {
    paddingHorizontal: responsiveSpacing(12, 14, 16),
    paddingBottom: responsiveSpacing(12, 14, 16),
    paddingTop: responsiveSpacing(8, 10, 12),
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#121821',
    borderRadius: responsiveSpacing(12, 14, 16),
    overflow: 'hidden',
    marginVertical: responsiveSpacing(8, 10, 12),
    padding: responsiveSpacing(10, 12, 14),
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  poster: {
    width: responsiveSpacing(70, 80, 90),
    height: responsiveSpacing(100, 110, 120),
    borderRadius: responsiveSpacing(10, 12, 14),
  },
  cardInfo: {
    flex: 1,
    marginLeft: responsiveSpacing(10, 12, 14),
    justifyContent: 'center',
  },
  cardTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: responsiveFont(14, 16, 18),
  },
  cardMeta: {
    color: '#d1d5db',
    marginTop: responsiveSpacing(2, 3, 4),
    fontSize: responsiveFont(11, 12, 13),
  },
});
