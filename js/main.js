import '/css/style.css'

feather.replace()

const citiesData = {
	kazan: [55.79, 49.12, 'u810XrM1l2g'],
	newYork: [40.714606, -74.002800, 'Y84-eo8drzk'],
	sydney: [-33.86, 151.2, 'fEAhHJdl8KA']
};

const cities = document.querySelectorAll('.city')

cities.forEach((item, index) => {
	if (index === 0) {
		item.classList.add('active')
	}

	item.addEventListener('click', () => {
		const location = item.dataset.location;
		cities.forEach(item => {
			item.classList.remove('active')
		})
		item.classList.add('active')
		getData(citiesData[location]);
		citiesList.classList.remove('active');
		clear();
	})
})

const city = document.querySelector('[data-elem="city"]');
const country = document.querySelector('[data-elem="country"]');
const card = document.querySelector('[data-elem="card"]');
const cardDay = document.querySelector('[data-elem="day"]');
const cardDate = document.querySelector('[data-elem="date"]');
const cardIcon = document.querySelector('[data-elem="icon"]');
const cardTemp = document.querySelector('[data-elem="temp"]');
const cardDesc = document.querySelector('[data-elem="desc"]');
const currentPrecipitation = document.querySelector('[data-elem="precipitation"]');
const currentHumidity = document.querySelector('[data-elem="humidity"]');
const currentWind = document.querySelector('[data-elem="wind"]');
const week = document.querySelector('[data-elem="week"]');
const dayFragment = document.createDocumentFragment();
const button = document.querySelector('[data-elem="button"]');
const citiesList = document.querySelector('[data-elem="cities"]');

function fillTodayInfo(item) {
	currentPrecipitation.textContent = (item.pop * 100).toString();
	currentHumidity.textContent = item.main.humidity;
	currentWind.textContent = Math.round(item.wind.speed).toString();
}
function fillLocationInfo(data) {
	city.textContent = data.city.name;
	country.textContent = data.city.country;
}

function fillWeatherCard(item) {
	const itemTemp = Math.round(item.main.temp).toString();
	const itemWeather = item.weather[0];
	const optionsDay = { weekday: 'long' }
	const optionsDate = { year: 'numeric', month: 'short', day: 'numeric' }
	const weekDay = new Date(item.dt * 1000).toLocaleDateString('ru-RU', optionsDay);
	const weekDate = new Date(item.dt * 1000).toLocaleDateString('ru-RU', optionsDate);

	cardDay.textContent = weekDay;
	cardDate.textContent = weekDate
	cardTemp.textContent = itemTemp;
	cardDesc.textContent = itemWeather.description;
	cardIcon.setAttribute('src', `https://openweathermap.org/img/wn/${itemWeather.icon}@2x.png`);
}

function getData(location) {
	const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${location[0]}&lon=${location[1]}&appid=4559f75d98098656923a7f596c7567f7&units=metric&lang=ru`

	const promise = fetch(url)
		.then(response => response.json())
		.then(data => {
			const daysList = data.list.filter((item) => item['dt_txt'].includes('12:00:00'))

			card.setAttribute('style', `background-image: url(https://unsplash.com/photos/${location[2]}/download?force=true&w=640);`)

			fillLocationInfo(data);

			daysList.forEach((item, index) => {
				const itemTemp = Math.round(item.main.temp).toString();
				const itemWeather = item.weather[0];
				const options = { weekday: 'short' };
				const weekDay = new Date(item.dt * 1000).toLocaleString('ru-RU', options);

				if (index === 0) {
					fillTodayInfo(item);
					fillWeatherCard(item)
				}

				if (week) {
					const day = document.createElement('li');
					const dayIcon = document.createElement('span');
					const dayImg = document.createElement('img');
					const dayName = document.createElement('span');
					const dayTemp = document.createElement('span');
					dayIcon.className = 'day-icon';
					//dayIcon.dataset.feather = itemWeather.icon;
					dayImg.setAttribute('alt', 'weather icon')
					dayImg.setAttribute('src', `https://openweathermap.org/img/wn/${itemWeather.icon}@2x.png`)
					dayName.className = 'day-name';
					dayName.dataset.elem = 'name';
					dayName.textContent = weekDay;
					dayTemp.className = 'day-temp';
					dayTemp.dataset.elem = 'temp';
					dayTemp.textContent = itemTemp + '°C';

					if (index === 0) day.className = 'active';
					dayIcon.appendChild(dayImg);
					day.appendChild(dayIcon);
					day.appendChild(dayName);
					day.appendChild(dayTemp);
					dayFragment.append(day)
				}
			})

			if (week) {
				week.appendChild(dayFragment);

				const weekDays = week.querySelectorAll('li');
				weekDays.forEach((item, index) => {
					item.addEventListener('click', () => {
						weekDays.forEach(item => item.classList.remove('active'))
						item.classList.add('active');

						fillTodayInfo(daysList[index]);
						fillWeatherCard(daysList[index]);
					})
				})
			}
		})
}

function clear() {
	week.innerHTML = '';
}

button.addEventListener('click', () => {
	citiesList.classList.toggle('active');
})

getData(citiesData.kazan)