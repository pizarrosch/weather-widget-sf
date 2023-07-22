import s from "./WeatherCard.module.scss";
import rainImg from "../../assets/rain.png";
import cloudImg from "../../assets/clouds.png";
import sunImg from "../../assets/sun.png";
import sunAndClouds from '../../assets/sun-with-clouds.png';
import React from "react";

function weatherCard({actualDateInMs, nextDayData}: { actualDateInMs: number, nextDayData: Array<any> }) {

    const today = Date.now();
    const factor = today / actualDateInMs;

    function setKelvinToCelcius(kelvin: number) {
        return (kelvin - 273).toFixed(0);
    }

    function getIcon(date: any) {
        switch (date.weather[0].main) {
            case ('Rain'):
                return rainImg;
            case ('Clouds'):
                if (date.clouds > 95) return cloudImg;
                if (date.clouds < 95 && date.clouds > 0) return sunAndClouds;
                default:
                return sunImg
        }
    }

    const slicedToFiveDaysArr = nextDayData.slice(1, 6);

    return (
        <div className={s.weatherCardsWrapper}>
            {slicedToFiveDaysArr.map((date, index) => {
                    const dayInMs = Number((date.dt * factor).toFixed());
                    const dateAsDate = new Date(dayInMs)
                    const weekday = dateAsDate.toLocaleString("en-US", {weekday: "long"})

                    return (
                        <div key={index} className={s.weatherCardContainer}>
                            <span className={s.weatherSuperscriptData}>{weekday}</span>
                            <span className={s.weatherCardData}>{setKelvinToCelcius(date.temp.day)}°C</span>
                            <img src={getIcon(date)} alt={''}/>
                        </div>
                    )
                }
            )}
        </div>
    )
}

export default weatherCard;