import {useState} from "react";

function Container() {

    const [weather, setWeather] = useState('');
   fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=52.5200&lon=13.4050&appid=4f3468ba2c3db32e9f388f2c91cbd483`)
       .then(response => response.json())
       .then(data => {
           data.current.weather.map(weatherInfo => setWeather(weatherInfo.main))
       }
       )

    return (
        <p>{weather}</p>
    )
}

export default Container;