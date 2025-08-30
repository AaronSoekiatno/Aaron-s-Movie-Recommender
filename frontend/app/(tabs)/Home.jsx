import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useRouter } from 'expo-router';
import { Header, Icon } from 'react-native-elements';
import axios from 'axios';

//screen dimensions
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

//responsive screen sizes
const isSmallScreen = screenWidth < 375;
const isMediumScreen = screenWidth >= 375 && screenWidth < 414;
const isLargeScreen = screenWidth >= 414;

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

export default function HomeScreen() {
  const [movieDetails, setMovieDetails] = useState({});
  const router = useRouter();

  const timeConvert = (num) => {
    const hours = Math.floor(num / 60);
    const minutes = num % 60;
    return `${hours} hrs ${minutes} mins`;
  };

  const getMovie = async () => {
    try {
      const url = "http://localhost:5000/get-movie";
      const response = await axios.get(url);
      let details = response.data.data;
      details["duration"] = timeConvert(details.duration);
      setMovieDetails(details);
    } catch (error) {
      console.log('Error fetching movie:', error.message);

      Alert.alert('Error', 'Failed to load movie. Please check if the server is running.');
    }
  };

  const likedMovie = async () => {
    try {
      const url = "http://localhost:5000/liked-movie";
      await axios.post(url);
      getMovie();
    } catch (error) {
      console.log('Error liking movie:', error.message);
      Alert.alert('Error', 'Failed to record your preference. Please try again.');
    }
  };

  const unlikedMovie = async () => {
    try {
      const url = "http://localhost:5000/unliked-movie";
      await axios.post(url);
      getMovie();
    } catch (error) {
      console.log('Error unliking movie:', error.message);
      Alert.alert('Error', 'Failed to record your preference. Please try again.');
    }
  };

  const notWatched = async () => {
    try {
      const url = "http://localhost:5000/did-not-watch";
      await axios.post(url);
      getMovie();
    } catch (error) {
      console.log('Error updating watch status:', error.message);
      Alert.alert('Error', 'Failed to update watch status. Please try again.');
    }
  };

  useEffect(() => {
    getMovie();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      console.log('Currently on: Home Screen');
      return () => console.log('Leaving: Home Screen');
    }, [])
  );

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
            size={responsiveFont(24, 28, 32)}
          />
        ))}
      </View>
    );
  };

  if (!movieDetails.poster_link) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading movie...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const {
    poster_link,
    title,
    release_date,
    duration,
    overview,
    rating
  } = movieDetails;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Header
          centerComponent={{
            text: "Welcome To Aaron's Movie Recommender!!",
            style: styles.headerTitle
          }}
          containerStyle={styles.headerBar}
          backgroundColor={"#0F1328"}
        />
      </View>
      <View style={styles.subContainer}>
        <View style={styles.subTopContainer}>
          <Image style={styles.posterImage} source={{ uri: poster_link }} />
        </View>
        <View style={styles.subBottomContainer}>
          <View style={styles.upperBottomContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{`${
              release_date?.split("-")[0] || 'N/A'
            } | ${duration}`}</Text>
          </View>
          <View style={styles.middleBottomContainer}>
            <View style={styles.ratingContainer}>
              {renderStarRow(parseRatingToFiveScale(rating))}
            </View>

            <View style={{ flex: 0.6, padding: responsiveSpacing(12, 14, 12)}}>
              <Text style={styles.overview}>{overview}</Text>
            </View>
          </View>
          <View style={styles.lowerBottomContainer}>
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity style={[styles.actionButton, styles.likeButton]} onPress={likedMovie}>
                <Icon name={"check"} type={"entypo"} color={"#fff"} size={responsiveFont(18, 20, 22)} />
                <Text style={styles.actionButtonText}>Like</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.actionButton, styles.dislikeButton]} onPress={unlikedMovie}>
                <Icon name={"cross"} type={"entypo"} color={"#fff"} size={responsiveFont(18, 20, 22)} />
                <Text style={styles.actionButtonText}>Dislike</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={notWatched}
              >
                <Text style={styles.buttonText}>Haven't Watched</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F1328"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: responsiveFont(16, 18, 20),
    fontWeight: '500',
  },
  headerContainer: {
    flex: 0.1,
  },
  headerBar: {
    backgroundColor: '#0F1328',
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(255,255,255,0.15)',
    borderBottomLeftRadius: responsiveSpacing(14, 16, 18),
    borderBottomRightRadius: responsiveSpacing(14, 16, 18),
    shadowColor: '#ffffff',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    overflow: 'visible',
  },
  headerTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: responsiveFont(16, 17, 18)
  },
  subContainer: {
    flex: 0.9
  },
  subTopContainer: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center"
  },
  posterImage: {
    width: "60%",
    height: "90%",
    resizeMode: "stretch",
    borderRadius: responsiveSpacing(25, 28, 30),
    marginHorizontal: responsiveSpacing(8, 9, 10)
  },
  subBottomContainer: {
    flex: 0.6,
    overflow: 'visible',
},
  upperBottomContainer: {
    flex: 0.2,
    alignItems: "center"
  },
  title: {
    fontSize: responsiveFont(20, 22, 24),
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
    paddingHorizontal: responsiveSpacing(12, 14, 16),
  },
  subtitle: {
    fontSize: responsiveFont(16, 18, 20),
    fontWeight: "300",
    color: "#d1d5db",
    marginTop: responsiveSpacing(4, 5, 6),
  },
  middleBottomContainer: {
    flex: 0.35,
    overflow: 'visible',
},
  ratingContainer: {
    flex: 0.34,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: responsiveSpacing(2, 4, 6),
    zIndex: 2,
    overflow: 'visible',
    width: '100%',
},
  starContainer: {
    marginTop: 0,
},
  overview: {
    fontSize: responsiveFont(11, 12, 13),
    textAlign: "center",
    fontWeight: "300",
    color: "#9ca3af",
    lineHeight: responsiveFont(16, 17, 18),
  },
  lowerBottomContainer: {
    flex: 0.45
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: responsiveSpacing(12, 14, 16),
    paddingVertical: responsiveSpacing(6, 8, 10),
    gap: responsiveSpacing(4, 4, 4),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: responsiveSpacing(4, 6, 8),
    paddingHorizontal: responsiveSpacing(14, 16, 28),
    paddingVertical: responsiveSpacing(10, 12, 14),
    borderRadius: responsiveSpacing(10, 12, 14),
    minWidth: responsiveSpacing(120, 130,140),
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 3,
    borderColor: '#ff1744',
    margin: '2px'
  },
  likeButton: {
    backgroundColor: 'transparent',
  },
  dislikeButton: {
    backgroundColor: 'transparent',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: responsiveFont(12, 13, 14),
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    width: responsiveSpacing(140, 150, 290),
    height: responsiveSpacing(45, 48, 50),
    borderRadius: responsiveSpacing(18, 19, 20),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#551313',
    backgroundColor: '#98212F',
    marginTop: responsiveSpacing(2, 2, 2)
  },
  buttonText: {
    fontSize: responsiveFont(13, 14, 15),
    fontWeight: "bold",
    color: "#fff",
  }
});