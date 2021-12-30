import React, {useState, useEffect} from "react";
import * as Location from 'expo-location';
import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Fontisto } from '@expo/vector-icons'; 

const {width:SCREEN_WIDTH} = Dimensions.get('window');

const API_KEY = `${WEATHER_API_KEY}`

const icons = {
  Clouds: "cloudy",
  Snow: "snow",
  Clear: "day-sunny",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning"
}

export default function App() {

  const [days, setDays] = useState([]);
  const [city, setCity] = useState("Loading...");
  const [ok, setOk] = useState(true);

  const getWeather = async () => {
    // 유저에게 위치추적 허용여부
    const {granted} = await Location.requestForegroundPermissionsAsync();
    // 유저가 허락하지 않을 경우
    if(!granted) {
      setOk(false);
    }
    // 유저의 현재 위치의 위도와 경도
    const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy: 5});
    // 유저의 위도와 경도를 이용하여 나온 주소 // 그냥 geocode는 주소를 알려주면 위도와 경도를 알려줌
    const location = await Location.reverseGeocodeAsync(
      {latitude, longitude}, 
      {useGoogleMaps: false}
      );
    // city 상태 변경  
    setCity(location[0].city)
    // API 요청
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`)
    const json = await response.json();
    setDays(json.daily)
  }

  // 처음 렌더링 될 때 실행
  useEffect(() => {
    getWeather();
    }, [])

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        pagingEnabled // 페이지 자동 넘김 제어
        horizontal // 수평으로 스크롤
        indicatorStyle="white" // 페이지 슬라이더
        contentContainerStyle={styles.weather} // 한 페이지 안에 박스 하나가 완전히 차지하도록 하는 props
       >
        {days.length === 0 ? 
         ( <View style={styles.day}>
            <ActivityIndicator color="white" size="large" style={{marginTop: 10}} />
          </View> ) :
         ( 
           days.map((day, index) => 
            <View key={index} style={styles.day}>
              <Fontisto name={icons[day.weather[0].main]} size={74} color="white" style={{marginTop: 5}}/>
              <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.smallText}>{day.weather[0].description}</Text>
            </View>
          )
          )
        }
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato"
  },
  city: {
    flex: 1.2,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30
  },
  cityName: {
    fontSize: 68,
    fontWeight: "500",
  },
  weather: {
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp: {
    marginTop: 20,
    fontSize: 148,
  },
  description: {
    marginTop: -20,
    fontSize: 50,
    fontWeight: "bold"
  },
  smallText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "teal"
  }
});
