import React, { useState, useEffect } from "react";
import { View, Text, ActivityIndicator, FlatList, StyleSheet } from "react-native";

export default function Home () {
const [forecast, setForecast] = useState([]);
const [loading, setLoading] = useState(true);

// Coordenadas de Ciudad de México (Cambia por las tuyas)
const LAT = "19.4326";
const LON = "-99.1332";

useEffect(() => {
const fetchWeather = async () => {
const API_KEY = "a737143c328f1513918788a1e90fab3b";
try {
const response = await fetch(
`https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&exclude=current,minutely,hourly,alerts&appid=${API_KEY}&units=metric`
);
const data = await response.json();
console.log(data);
setForecast(data.daily);
setLoading(false);
} catch (error) {
console.error("Error obteniendo el pronóstico:", error);
}
};

fetchWeather();
}, []);

return (
<View style={styles.container}>
{loading ? (
<ActivityIndicator size="large" color="#0000ff" />
) : (
<FlatList
data={forecast}
keyExtractor={(item, index) => index.toString()}
renderItem={({ item }) => (
<View style={styles.card}>

<Text style={styles.date}>
{new Date(item.dt * 1000).toLocaleDateString()}
</Text>
<Text>Temp: {item.temp.day}°C</Text>
<Text>Min: {item.temp.min}°C / Max: {item.temp.max}°C</Text>
<Text>Condición: {item.weather[0].description}</Text>
</View>
)}
/>
)}
</View>
);
};

const styles = StyleSheet.create({
container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor:'blue' },
card: {
backgroundColor: "#f1f1f1",
padding: 15,
borderRadius: 10,
marginBottom: 10,
width: "100%",
},
date: { fontSize: 18, fontWeight: "bold" },
});