import React, {ChangeEvent, useEffect, useState, Fragment} from 'react';
import s from './App.module.css';
import Container from "./Components/Container/Container.tsx";
import Input from "./Components/Input/Input.tsx";
import {keyboardKey} from "@testing-library/user-event";
import {TWeatherState} from "./types.ts";
import Button from "./Components/Button/Button.tsx";

function App() {

  const [weatherState, setWeatherState] = useState('');
  const [weatherCondition, setWeatherCondition] = useState<TWeatherState>({
    temp: '',
    pressure: 0,
    humidity: 0,
    feelsLike: '',
    windSpeed: ''
  });
  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  const [city, setCity] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [typedCityName, setTypedCityName] = useState('');
  const [searchedWeatherData, setSearchedWeatherData] = useState({
    lat: 0,
    long: 0
  })
  const [clicked, setClicked] = useState(false);

  function getLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;

        setLat(latitude);
        setLong(longitude);
      },
      (error) => console.log(error.message),
      {enableHighAccuracy: true}
    )
  }

  getLocation();

  function setKelvinToCelcius(kelvin: number) {
    return (kelvin - 273).toFixed(0);
  }

  function getMilesPerSecondToKmh(milespersecond: number) {
    return (milespersecond * 3.6).toFixed(0);
  }

  useEffect(() => {
    clicked || fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=en`)
      .then(response => response.json())
      .then(data => setCity(data.city))
  }, [lat, long, clicked])

  useEffect(() => {
    clicked || fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${searchedWeatherData.lat || lat}&lon=${searchedWeatherData.long || long}&appid=4f3468ba2c3db32e9f388f2c91cbd483`)
      .then(response => response.json())
      .then(data => {
          console.log(data)
          data.current.weather.map((weatherInfo: any) => setWeatherState(weatherInfo.main))
          setWeatherCondition({
            temp: setKelvinToCelcius(data.current.temp),
            pressure: data.current.pressure,
            humidity: data.current.humidity,
            feelsLike: setKelvinToCelcius(data.current.feels_like),
            windSpeed: getMilesPerSecondToKmh(data.current.wind_speed)
          });
        }
      )
  }, [long, lat, searchedWeatherData.lat, searchedWeatherData.long, clicked])

  useEffect(() => {
    typedCityName && fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${typedCityName}&limit=5&appid=4f3468ba2c3db32e9f388f2c91cbd483`)
      .then(response => response.json())
      .then(data => {
        if (data) {
          setSearchedWeatherData({
            lat: (data[0].lat),
            long: (data[0].lon)
          });
        } else return
      })
  }, [typedCityName])

  function handleInputChange(e: ChangeEvent) {
    const target = e.target as HTMLInputElement;
    setInputValue(target.value);
  }

  function handleSubmit(e: keyboardKey) {
    if (e.key === 'Enter') {
      setTypedCityName(inputValue);
    }
  }

  function getLocationOnClick() {
    window.location.reload();
  }

  function submitOnClick() {
    setTypedCityName(inputValue);
  }

  return (
    <div className={s.App}>
      <Fragment>
        <Input onChange={handleInputChange} onSubmit={handleSubmit} value={inputValue}/>
        <Button onClick={getLocationOnClick}>Your location</Button>
        <Button onClick={submitOnClick}>Search</Button>
      </Fragment>
      <Container city={city} typedCity={typedCityName} weatherState={weatherState} weatherCondition={weatherCondition}/>
    </div>
  );
}

export default App;
