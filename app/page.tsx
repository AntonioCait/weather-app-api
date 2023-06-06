'use client';
import Image from 'next/image';
import styles from './page.module.css';
import { useState, useEffect } from 'react';
import FormStyles from './Styles/InputForm.module.css';

// open weather api key

// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

// const API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=London&limit=1&appid=${API_KEY}`;

// async function fetchWeather({ city }: { city: string }) {
// 	const res = await fetch(API_URL);
// 	const data = await res.json();
// 	console.log(data);
// }
interface IWeather {
	name: string;
	weather: {
		description: string;
		icon: string;
	}[];
	main: {
		temp: number;
		feels_like: number;
		temp_min: number;
		temp_max: number;
		pressure: number;
		humidity: number;
	};
	visibility: number;
	wind: {
		speed: number;
		deg: number;
	};
}

export default function Home() {
	// get current browser location

	const [city, setCity] = useState('London');
	const [weather, setWeather] = useState<IWeather | null>(null);
	// const API_KEY = 'a55d991e6f9675b78eb2e272d4148d70';
	// const API_URLReadyToQuery = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`;

	// const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;

	useEffect(() => {
		fetchWeather(city)
			.then((data) => {
				setWeather(data);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	async function fetchWeather(city: string): Promise<IWeather> {
		const API_KEY = 'a55d991e6f9675b78eb2e272d4148d70';
		const API_URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`;

		const res = await fetch(API_URL);
		const data = await res.json();

		if (res.status !== 200) {
			throw new Error(data.message);
		}

		return data as IWeather;
	}

	// async function fetchWeather({ city }: { city: string }) {
	// 	const res = await fetch(API_URLReadyToQuery);
	// 	const data = await res.json();
	// 	console.log(data);
	// }

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// by default pass london as city
		fetchWeather(city)
			.then((data) => {
				setWeather(data);
			})
			.catch((error) => {
				console.error(error);
			});
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCity(e.target.value);
	};

	return (
		<main className={styles.main}>
			<h1>Weather App API</h1>
			<h2>{weather && <h2>{weather.name && weather.name[0].toUpperCase() + weather.name.slice(1)}</h2>}</h2>

			{/* div for icon */}
			<div>
				{weather && (
					<div className={FormStyles.IconWeatherInfo}>
						<Image
							src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`}
							alt="Weather Icon"
							width={100}
							height={100}
						/>
						{/* temperature */}
						<p>{weather.main.temp && Math.round(weather.main.temp - 273.15) + '°C'}</p>
					</div>
				)}
			</div>
			<form onSubmit={handleSubmit} className={FormStyles.form}>
				<input type="text" value={city} onChange={handleChange} placeholder="City" />
				<button type="submit">Show</button>
			</form>

			<div className={FormStyles.weatherContainer}>
				{weather && (
					<div className={FormStyles.weatherInformation}>
						{/* first letter capital */}
						<div>
							<h3>
								{weather.weather[0].description &&
									weather.weather[0].description[0].toUpperCase() + weather.weather[0].description.slice(1)}
							</h3>
						</div>

						{/* temp from F to C and only 2 digits */}
						<div>
							<p>Temperature</p>
							<p>{weather.main.temp && Math.round(weather.main.temp - 273.15) + '°C'}</p>
						</div>

						<div>
							<p>Feels Like</p>
							<p>{weather.main.feels_like && Math.round(weather.main.feels_like - 273.15) + '°C'}</p>
						</div>

						<div>
							<p>Min</p>
							<p>{weather.main.temp_min && Math.round(weather.main.temp_min - 273.15) + '°C'}</p>
						</div>

						<div>
							<p>Max</p>
							<p>{weather.main.temp_max && Math.round(weather.main.temp_max - 273.15) + '°C'}</p>
						</div>

						<div>
							<p>Humidity</p>
							<p>{weather.main.humidity + '%'}</p>
						</div>

						{/* wind conver to km/s */}
						<div>
							<p>Wind</p>
							<p>{weather.wind.speed && Math.round(weather.wind.speed * 3.6) + 'km/h'}</p>
						</div>
					</div>
				)}
			</div>
		</main>
	);
}
