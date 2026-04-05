const API_KEY = 'b1b15e88fa797225412429c1c50c122a1'; 
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';


const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const weatherInfo = document.getElementById('weatherInfo');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const currentWeather = document.getElementById('currentWeather');


searchBtn.addEventListener('click', () => {
    const city = searchInput.value.trim();
    if (city) {
        getWeather(city);
    }
});


searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = searchInput.value.trim();
        if (city) {
            getWeather(city);
        }
    }
});


async function getWeather(city) {
    showLoading();
    
    try {
        const response = await fetch(`${API_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=pt_br`);
        
        if (!response.ok) {
            throw new Error('Cidade não encontrada');
        }
        
        const data = await response.json();
        displayWeather(data);
        
    } catch (err) {
        showError(err.message);
    }
}


function showLoading() {
    hideAll();
    loading.style.display = 'block';
}


function showError(message) {
    hideAll();
    error.style.display = 'block';
    error.querySelector('p').textContent = message;
}


function displayWeather(data) {
    hideAll();
    currentWeather.style.display = 'block';
    
   
    document.getElementById('cityName').textContent = data.name;
    document.getElementById('currentTemp').textContent = Math.round(data.main.temp);
    document.getElementById('tempMax').textContent = Math.round(data.main.temp_max) + '°';
    document.getElementById('tempMin').textContent = Math.round(data.main.temp_min) + '°';
    document.getElementById('windSpeed').textContent = data.wind.speed + ' m/s';
    document.getElementById('humidity').textContent = data.main.humidity + '%';
    document.getElementById('weatherDesc').textContent = data.weather[0].description;
    
   
    const now = new Date();
    document.getElementById('dateTime').textContent = now.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    
    setWeatherIcon(data.weather[0].main);
}


function setWeatherIcon(weatherMain) {
    const icon = document.getElementById('weatherIcon');
    const icons = {
        Clear: 'fa-sun',
        Clouds: 'fa-cloud',
        Rain: 'fa-cloud-rain',
        Drizzle: 'fa-cloud-drizzle',
        Thunderstorm: 'fa-bolt',
        Snow: 'fa-snowflake',
        Mist: 'fa-smog'
    };
    
    icon.className = `fas ${icons[weatherMain] || 'fa-cloud'}`;
}


function hideAll() {
    loading.style.display = 'none';
    error.style.display = 'none';
    currentWeather.style.display = 'none';
}

// Carregar clima da localização atual (opcional)
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            // Você pode usar a latitude/longitude para buscar o clima
        },
        () => {
            // Geolocation negada
        }
    );
}

// Busca automática para São Paulo ao carregar
window.addEventListener('load', () => {
    getWeather('São Paulo');
});