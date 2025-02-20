import { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, FlatList, StyleSheet,Dimensions, TextInput,Image, Pressable} from "react-native";
import * as Location from "expo-location";
import { getWeatherForecast, searchCity } from "@/services/apiService";

const { width, height } = Dimensions.get("window");

export default function Home () {
    const [query, setQuery] = useState("");
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showListCities, setShowCities] = useState(false);
    const [forecast, setForecast] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [error, setError] = useState('');
    const [backgroundColor, setBackgroundColor] = useState("#fff");
    const [weatherType, setWeatherType] = useState("");

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.length > 2) {
      setLoading(true);
      const results = await searchCity(text);
      setCities(results);
      setLoading(false);
      setShowCities(true);
    } else {
      setCities([]);
    }
  };
  
    const fetchWeather = async (city: any) => {
        var data;
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Permission to access location was denied");
          setLoading(false);
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude, } = location.coords;
  
        if (city !== null) {
        data = await getWeatherForecast(city.lat, city.long);
        } else {
            data = await getWeatherForecast(latitude, longitude);
        }
        if (data) {
          setWeatherType(data.list[0].weather[0].main);
          setForecast(data.list);
        } else {
          setError("Failed to fetch weather data");
        }
        setLoading(false);
      };

useEffect(() => {
fetchWeather(null);
}, []);

useEffect(() => {
  switch (weatherType) {
    case "Clear":
      setBackgroundColor("#FFD700");
      break;
    case "Clouds":
      setBackgroundColor("#B0C4DE");
      break;
    case "Rain":
      setBackgroundColor("#778899");
      break;
    case "Snow":
      setBackgroundColor("#E0FFFF");
      break;
    default:
      setBackgroundColor("#87CEEB");
      break;
  }
}, [weatherType]);

if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }


return (
    <View style={[styles.container,{ backgroundColor }]}>
      <TextInput
        placeholder="Search for a city..."
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={({nativeEvent: {text}}) => handleSearch(text)}
        returnKeyType="search"
        style={{
            height: 50,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 10,
            paddingHorizontal: 15,
            fontSize: 16,
            backgroundColor: "#fff",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        }}
      />

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

        {showListCities && 
      <FlatList
        data={cities}
        keyExtractor={(item) => item['id']}
        renderItem={({ item }) => (
          
          <Pressable
          
          style={{
            padding: 10,
            borderBottomWidth: 1,
            backgroundColor: "#f0f0f0",
          }}
          onPress={() => {
            fetchWeather(item);
            setSelectedCity(item);
            setShowCities(false);
        }}
          >
          <Text>{item['display']}</Text>
          </Pressable>
        )}
      />}

      {!showListCities && forecast.length > 0 && (
            <View> 


      <Text style={{ fontSize: 20, padding: 40, fontWeight: "bold" }}>Clima en {selectedCity !== null ? selectedCity['display'] : 'Ubicación Actual'}</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
          data={forecast}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.date}>
                FECHA: {new Date(item['dt'] * 1000).toLocaleDateString()}
              </Text>
              <Image
                source={{
                    uri: `https://openweathermap.org/img/wn/${item['weather'][0]['icon']}@2x.png`,
                }}
                style={{ width: 80, height: 80 }} />

              <Text>Temp:  {item['main']['temp']}
                °C</Text>
              <Text>Min: 
                {item['main']['temp_min']}
                °C / Max: 
                {item['main']['temp_max']}
                °C</Text>
              <Text>Condición:  
                {item['weather'][0]['description']}
                </Text>
            </View>
          )}
        />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, paddingTop: 40 },
card: {
  width: width * 0.8,
  height: height * 0.3,
  backgroundColor: "#fff",
  borderRadius: 10,
  padding: 20,
  marginHorizontal: 10,
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 4,
  elevation: 5,
},
date: { fontSize: 18, fontWeight: "bold" },
});