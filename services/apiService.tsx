import axios from "axios";
const OPENWEATHER_URL = "https://api.openweathermap.org/data/2.5/forecast?";
const RESERVAMOS_API = "https://search.reservamos.mx/api/v2/places";

export const getWeatherForecast = async (latitude: any, longitude: any) => {
   //console.log(latitude + 's' + longitude);
const API_KEY = "a5a47c18197737e8eeca634cd6acb581" //"a737143c328f1513918788a1e90fab3b";
  try {
    const response = await axios.get(OPENWEATHER_URL, {
      params: {
        lat: latitude,
        lon: longitude,
        //q: "Monterrey",
        cnt: 7,
        //exclude: "current,minutely,hourly,alerts",
        units: "metric",
        appid: API_KEY,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
};

export const searchCity = async (query: any) => {
  try {
    const response = await axios.get(RESERVAMOS_API, { params: { q: query } });
    return response.data; 
  } catch (error) {
    console.error("Error searching city:", error);
    return [];
  }
};
