import React, {useEffect, useState} from "react";
import s from './Container.module.scss';
import rainImg from '../../assets/cloud.dark.rain.png';
import sunImg from '../../assets/sun.rays.medium.png';

function Container() {

    const [weatherData, setWeatherData] = useState<string>('');
    const [weatherCondition, setWeatherCondition] = useState({
        temp: '',
        pressure: 0,
        humidity: 0
    });
    const [lat, setLat] = useState<number>(0);
    const [long, setLong] = useState<number>(0);
    const [city, setCity] = useState('');

   function getPosition() {
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

   function setKelvinToCelcius(kelvin: number) {
       return (kelvin - 273).toFixed(0);
   }

    getPosition();

   useEffect(() => {
       fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=en`)
           .then(response => response.json())
           .then(data => setCity(data.city))
   }, [lat, long])

    useEffect(() => {
        fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${long}&appid=4f3468ba2c3db32e9f388f2c91cbd483`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                    data.current.weather.map((weatherInfo: any) => setWeatherData(weatherInfo.main))
                    setWeatherCondition({
                        temp: setKelvinToCelcius(data.current.temp),
                        pressure: data.current.pressure,
                        humidity: data.current.humidity
                });
                }
            )
    }, [long, lat])

    return (
        <div className={s.mainContainer}>
            <h2>Weather</h2>
            <img className={s.weatherIcon} src={weatherData === 'Rain' ? rainImg : sunImg} />
            <div className={s['data-container']}>
                <span className={s.city}>{city}</span>
                <span className={s.temp}>{weatherCondition.temp}°C</span>
                <span>{weatherData}</span>
                <span>Pressure: {weatherCondition.pressure} bar</span>
                <span>Humidity: {weatherCondition.humidity}%</span>
            </div>
        </div>
    )
}

export default Container;