import React, {ChangeEvent, useEffect, useState, useCallback, useRef, ReactNode} from 'react';
import s from './App.module.scss';
import Container from "./Components/Container/Container.tsx";
import Input from "./Components/Input/Input.tsx";
import {keyboardKey} from "@testing-library/user-event";
import {TWeatherState} from "./types.ts";
import Button from "./Components/Button/Button.tsx";
import geolocationImg from './assets/gps.png';
import searchIcon from './assets/magnifying-glass.svg';

function App() {

    console.log('-->', 'App is loaded')
    const [weatherState, setWeatherState] = useState('');
    const [weatherStateNextDays, setWeatherStateNextDays] = useState<string[]>([]);
    const [cloudsVolume, setCloudsVolume] = useState(0);
    const [weatherCondition, setWeatherCondition] = useState<TWeatherState>({
        temp: '',
        pressure: 0,
        humidity: 0,
        feelsLike: '',
        windSpeed: ''
    });
    const [dayTime, setDayTime] = useState({
        day: false,
        night: false
    })
    const [lat, setLat] = useState(0);
    const [long, setLong] = useState(0);
    const [city, setCity] = useState('');
    const [cityExists, setCityExists] = useState(true);
    // const [inputRef, setInputValue] = useState('');
    const [typedCityName, setTypedCityName] = useState<string | null>('');
    const [searchedWeatherData, setSearchedWeatherData] = useState({
        lat: 0,
        long: 0
    })
    const [activeTodayButton, setActiveTodayButton] = useState(true);
    const [activeFiveDayButton, setActiveFiveDayButton] = useState(false);
    const [actualDateInMs, setActualDateInMs] = useState(0);
    const [nextDayData, setNextDayData] = useState<Array<any>>([]);

    const inputRef = useRef<HTMLInputElement>();

    window.onload = () => {
        navigator.geolocation.getCurrentPosition((position) => {
                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;

                setLat(latitude);
                setLong(longitude);
            },
            (error) => console.log(error.message),
            {enableHighAccuracy: true}
        )
        inputRef.current!.focus();
    }

    function setKelvinToCelsius(kelvin: number) {
        return (kelvin - 273).toFixed(0);
    }

    function getMilesPerSecondToKmh(milesPerSecond: number) {
        return (milesPerSecond * 3.6).toFixed(0);
    }

    useEffect(() => {
        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=en`)
            .then(response => response.json())
            .then(data => setCity(data.city))
    }, [lat, long])

    useEffect(() => {
        fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${searchedWeatherData.lat || lat}&lon=${searchedWeatherData.long || long}&appid=3f8c6d14710f3295f0da06c00d91efaa`)
            .then(response => response.json())
            .then(data => {
                    data.current.weather.map((weatherInfo: any) => setWeatherState(weatherInfo.main))
                    setCloudsVolume(data.current.clouds);

                    data.current.dt > data.current.sunrise && data.current.dt < data.current.sunset ?
                        setDayTime({day: true, night: false}) :
                        setDayTime({day: false, night: true});

                    setWeatherCondition({
                        temp: setKelvinToCelsius(data.current.temp),
                        pressure: data.current.pressure,
                        humidity: data.current.humidity,
                        feelsLike: setKelvinToCelsius(data.current.feels_like),
                        windSpeed: getMilesPerSecondToKmh(data.current.wind_speed)
                    });
                }
            )
    }, [long, lat, searchedWeatherData.lat, searchedWeatherData.long])

    useEffect(() => {
        typedCityName && fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${typedCityName}&limit=5&appid=3f8c6d14710f3295f0da06c00d91efaa`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    setSearchedWeatherData({
                        lat: (data[0].lat),
                        long: (data[0].long)
                    });
                } else {
                    setCityExists(false);
                }
            })
    }, [typedCityName])

    function handleSubmit(e: keyboardKey) {
        if (e.key === 'Enter') {
            setCityExists(true);
            setTypedCityName(inputRef.current!.value);
            const clearInput = () => inputRef.current!.value = '';
            clearInput();
        }
    }

    function getLocationOnClick() {
        window.location.reload();
        inputRef.current!.focus();
    }

    function submitOnClick() {
        setTypedCityName(inputRef.current!.value);
        const clearInput = () => inputRef.current!.value = '';
        clearInput();
    }

    function choseTodayWeather() {
        setActiveFiveDayButton(false);
        setActiveTodayButton(true);
    }

    const fetchFiveDayWeather = useCallback(() => {
        fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${searchedWeatherData.lat || lat}&lon=${searchedWeatherData.long || long}&appid=4f3468ba2c3db32e9f388f2c91cbd483`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    setActualDateInMs(data.current.dt);
                    setNextDayData(data.daily);
                    for (let day of data.daily) {
                        setWeatherStateNextDays((prev) => [...prev, day.weather[0].main])
                    }
                }
            })
    }, [lat, long, searchedWeatherData.lat, searchedWeatherData.long])


    useEffect(() => {
        activeFiveDayButton && fetchFiveDayWeather();
    }, [activeFiveDayButton, fetchFiveDayWeather])

    function choseFiveDaysWeather() {
        fetchFiveDayWeather();
        setActiveFiveDayButton(true);
        setActiveTodayButton(false);
    }

    function removeErrorMessage() {
        setCityExists(true);
    }

    window.onclick = () => setCityExists(true);

    return (
        <div className={s.App}>
            <div className={s.formContainer}>
                <Input onSubmit={handleSubmit} ref={inputRef}/>
                <Button onClick={getLocationOnClick}><img src={geolocationImg} alt='my-location'/></Button>
                <Button onClick={submitOnClick}><img src={searchIcon} alt='search'/></Button>
            </div>
            <div className={s.showWeatherButtonContainer}>
                <Button active={activeTodayButton} onClick={choseTodayWeather}>Today</Button>
                <Button active={activeFiveDayButton} onClick={choseFiveDaysWeather}>Next 5 days</Button>
            </div>
            <Container
                activeToday={activeTodayButton}
                activeFiveDays={activeFiveDayButton}
                city={city}
                typedCity={typedCityName!}
                weatherState={weatherState}
                weatherCondition={weatherCondition}
                cloudsVolume={cloudsVolume}
                actualDateInMs={actualDateInMs}
                nextDayData={nextDayData}
                dayTime={dayTime.day}
            />
            {!cityExists &&
                <div>
                    <div className={s.backdrop}></div>
                    <div className={s.errorMessage}>
                        City not found. Please enter the right name of the city!
                        <hr/>
                        <span className={s.closeButton} onClick={removeErrorMessage}>Got it!</span>
                    </div>
                </div>
            }
        </div>
    );
}

export default App;
