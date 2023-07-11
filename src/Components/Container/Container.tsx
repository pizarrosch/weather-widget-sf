import React from "react";
import s from './Container.module.scss';
import rainImg from '../../assets/rain.png';
import sunImg from '../../assets/sun.png';
import cloudImg from '../../assets/clouds.png';
import sunWithCloud from '../../assets/sun-with-clouds.png'
import {TWeatherState} from "../../types.ts";
import WeatherCard from "../WeatherCard/WeatherCard.tsx";

function Container(
  {
    city,
    typedCity,
    weatherState,
    weatherCondition,
    cloudsVolume,
    activeToday,
    activeFiveDays,
    actualDateInMs,
    nextDayData,
    weatherStateNextDays
  }:
    {
      city: string,
      typedCity: string,
      weatherState: string,
      weatherCondition: TWeatherState,
      cloudsVolume: number,
      activeToday: boolean,
      activeFiveDays: boolean,
      actualDateInMs: number,
      nextDayData: Array<any>,
      weatherStateNextDays: string[]
    }) {

  return (
    <div
      className={s.mainContainer}

    >
      <h2>Weather</h2>
      {activeToday ? <img className={s.weatherIcon} src={
        weatherState === 'Rain' ? rainImg :
          weatherState === 'Clouds' && cloudsVolume > 95 ? cloudImg :
            weatherState === 'Clouds' && cloudsVolume < 95 && cloudsVolume > 0 ? sunWithCloud :
              sunImg}
      /> : ''}
      <div className={s['data-container']}>
        <span className={s.city}>{typedCity ? typedCity : city}</span>
        <span className={s.temp}>{weatherCondition.temp}°C</span>
        <span
          style={{"color": "white"}}>{cloudsVolume > 95 && weatherState !== 'Rain' ? 'Overcast' : weatherState}</span>
        {activeToday ? <div className={s.extraInfoContainer}>
            <div className={s.extraInfo}>
              <span>Pressure</span>
              <span className={s.extraInfoData}>{weatherCondition.pressure} bar</span>
            </div>
            <div className={s.extraInfo}>
              <span>Humidity</span>
              <span className={s.extraInfoData}>{weatherCondition.humidity}%</span>
            </div>
            <div className={s.extraInfo}>
              <span>Feels like</span>
              <span className={s.extraInfoData}>{weatherCondition.feelsLike}°C</span>
            </div>
            <div className={s.extraInfo}>
              <span>Wind</span>
              <span className={s.extraInfoData}>{weatherCondition.windSpeed} km/h</span>
            </div>
          </div>
          : activeFiveDays &&
          <div className={s.extraInfoContainer}>
            <WeatherCard
              weatherState={weatherState}
              temp={weatherCondition.temp}
              actualDateInMs={actualDateInMs}
              nextDayData={nextDayData}
              weatherStateNextDays={weatherStateNextDays}
            />
          </div>
        }
      </div>
    </div>
  )
}

export default Container;