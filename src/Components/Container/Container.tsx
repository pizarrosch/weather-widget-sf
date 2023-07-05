import React from "react";
import s from './Container.module.scss';
import rainImg from '../../assets/cloud.dark.rain.png';
import sunImg from '../../assets/sun.rays.medium.png';
import cloudImg from '../../assets/cloud.dark.png';
import {TWeatherState} from "../../types.ts";

function Container(
  {
    city,
    typedCity,
    weatherState,
    weatherCondition,
  }:
    {
      city: string,
      typedCity: string,
      weatherState: string,
      weatherCondition: TWeatherState,
    }) {

  return (
    <div className={s.mainContainer}>
      <h2>Weather</h2>
      <img className={s.weatherIcon} src={
        weatherState === 'Rain' ? rainImg :
          weatherState === 'Clouds' ? cloudImg : sunImg}
      />
      <div className={s['data-container']}>
        <span className={s.city}>{typedCity ? typedCity : city}</span>
        <span className={s.temp}>{weatherCondition.temp}°C</span>
        <span>{weatherState}</span>
        <div className={s.extraInfoContainer}>
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
      </div>
    </div>
  )
}

export default Container;