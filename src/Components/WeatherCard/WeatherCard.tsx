import s from "./WeatherCard.module.scss";
import rainImg from "../../assets/rain.png";
import cloudImg from "../../assets/clouds.png";
import sunImg from "../../assets/sun.png";
import sunAndClouds from '../../assets/sun-with-clouds.png';
import React from "react";

function weatherCard({weatherState, temp, actualDateInMs, nextDayData, weatherStateNextDays}:
                       {
                         weatherState: string,
                         temp: string,
                         actualDateInMs: number,
                         nextDayData: Array<any>,
                         weatherStateNextDays: string[]
                       }) {

  const today = Date.now();
  const factor = today / actualDateInMs;

  function setKelvinToCelcius(kelvin: number) {
    return (kelvin - 273).toFixed(0);
  }

  const slicedToFiveDaysArr = nextDayData.slice(1, 6);

  return (
    <div className={s.weatherCardsWrapper}>
      {slicedToFiveDaysArr.map((date) => {
          const dayInMs = Number((date.dt * factor).toFixed());
          const dateAsDate = new Date(dayInMs)
          const weekday = dateAsDate.toLocaleString("en-US", {weekday: "long"})

          return (
            <div className={s.weatherCardContainer}>
              <span className={s.weatherSuperscriptData}>{weekday}</span>
              <span className={s.weatherCardData}>{setKelvinToCelcius(date.temp.day)}°C</span>
              <img src={
                date.weather[0].main === 'Rain' ? rainImg :
                  date.weather[0].main === 'Clouds' && date.clouds > 95 ? cloudImg :
                    date.weather[0].main === 'Clouds' && date.clouds < 95 && date.clouds > 0 ? sunAndClouds : sunImg
              }
              />
            </div>
          )

        }
      )}
    </div>
  )
}

export default weatherCard;