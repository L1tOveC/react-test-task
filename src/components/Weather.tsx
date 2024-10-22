import React, { useCallback, useEffect, useMemo, useState } from 'react'
import './Weather.css'

interface Props {
    lat: number
    long: number
    variables: string[]
}

interface WeatherData {
    utc_offset_seconds: number
    timezone_abbreviation: string
    timezone: string
    latitude: number
    longitude: number
    generationtime_ms: number
    elevation: number
    daily_units: {
        rain_sum: string
        snowfall_sum: string
        time: string
    }
    daily: {
        rain_sum?: number[]
        snowfall_sum?: number[]
        time: string[]
        [key: string]: number[] | string[] | undefined // для избегания ошибки по undefined
    }
}

const defaultStartRequestText = 'https://api.open-meteo.com/v1/forecast?latitude='
const defaultFinishRequestText = '&timezone=Europe/Moscow&past_days=0'

const Weather: React.FC<Props> = ({ long, lat, variables }) => {
    const [weather, setWeather] = useState<WeatherData | null>(null)

    const getWeatherData = useCallback(async () => {
        try {
            const response = await fetch(
                `${defaultStartRequestText}${lat}&longitude=${long}&daily=${variables.join(',')}${defaultFinishRequestText}`,
                { method: 'GET' }
            )
            const data = await response.json()
            setWeather(data)
        } catch (err) {
            console.error('Error: ', err)
        }
    }, [lat, long, variables])

    useEffect(() => {
        getWeatherData()
    }, [getWeatherData])

    return useMemo(() => {
        return (
            <div className="weather-table-container">
                <table className="weather-table">
                    <thead>
                    <tr>
                        <th>Date</th>
                        {variables.map((variable) => (
                            <th key={variable}>{variable}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {weather &&
                        weather.daily?.time?.map((time: string, idx: number) => (
                            <tr key={time}>
                                <td>{time}</td>
                                {variables.map((variable) => (
                                    <td key={variable}>
                                        {/* я намучался с этим блоком, но иначе избежать ошибки с undefined у меня не выходит */}
                                        {weather.daily[variable as keyof typeof weather.daily]?.[idx] !== undefined
                                            ? weather.daily[variable as keyof typeof weather.daily]?.[idx] : 'N/A'}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }, [weather, variables])
}

export default Weather
