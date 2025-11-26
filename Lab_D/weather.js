const Api_key = "ff0124d391381b1b5b02fdffa1bed64f";
const btn = document.getElementById("getWeather");
const input = document.getElementById("city");
const result = document.getElementById("result");

// --- Funkcje do renderowania danych ---

function showMessage(html) {
  result.innerHTML = html;
}

function renderCurrent(data) {
  const name = data.name || '';
  const country = data.sys?.country || '';
  const temp = Math.round(data.main?.temp);
  const desc = data.weather?.[0]?.description || '';
  const iconCode = data.weather?.[0]?.icon || '01d'; 

  return `
    <div class="current">
      <h3>Pogoda teraz — ${name}, ${country}</h3>
      <div class="weather-info">
        <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Ikona pogody" class="weather-icon">
        <div>${desc}</div>
      </div>
      <div>Temperatura: **${temp} °C**</div>
      <div>Wilgotność: ${data.main?.humidity}%</div>
      <div>Wiatr: ${data.wind?.speed} m/s</div>
    </div>`;
}

function renderForecast(data) {
  const items = data.list || [];
  if (items.length === 0) return 'Brak danych o prognozie.';

  const itemsToShow = items.slice(0, 12); 

  const itemsHtml = itemsToShow.map(item => {
    const date = new Date(item.dt * 1000);
    const temp = Math.round(item.main?.temp);
    const desc = item.weather?.[0]?.description || '';
    const iconCode = item.weather?.[0]?.icon || '01d'; 

    return `
      <div class="forecast-item" style="text-align: center;">
        <div class="forecast-time">${date.toLocaleString('pl-PL', { weekday: 'short', hour: '2-digit', minute: '2-digit' })}</div>
        <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="Ikona prognozy" class="forecast-icon">
        <div>${desc}</div>
        <div>Temperatura: **${temp} °C**</div>
      </div>`;
  }).join('');

  return `
    <div class="forecast">
      <h3>Prognoza pogody (kolejne 24h)</h3>
      <div class="forecast-list">
        ${itemsHtml}
      </div>
    </div>`;
}


// --- Funkcje do pobierania danych z API ---

function fetchCurrentWeather(city) {
  return new Promise((resolve, reject) => {
    const url = `https://api.openweathermap.org/data/2.5/weather` +
      `?q=${encodeURIComponent(city)}` +
      `&appid=${Api_key}` +
      `&units=metric` +
      `&lang=pl`;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);

    xhr.onload = function() {
      if (xhr.status === 200) {
        try {
          const data = JSON.parse(xhr.responseText);
          resolve(data);
        } catch (e) {
          reject({ message: 'Błąd parsowania JSON dla pogody bieżącej.' });
        }
      } else {
        const errorData = JSON.parse(xhr.responseText || '{}');
        reject({ message: errorData.message || `Błąd pobierania pogody bieżącej: ${xhr.status} ${xhr.statusText}` });
      }
    };

    xhr.onerror = function() {
      reject({ message: 'Błąd sieci podczas pobierania pogody bieżącej.' });
    };

    xhr.send();
  });
}

function fetchForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast` +
    `?q=${encodeURIComponent(city)}` +
    `&appid=${Api_key}` +
    `&units=metric` +
    `&lang=pl`;

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        return response.json().then(errorData => {
            throw new Error(errorData.message || `Błąd HTTP ${response.status} podczas pobierania prognozy.`);
        });
      }
      return response.json();
    })
    .then(data => {
        console.log("Dane Prognozy (Forecast API):", data); 
        return data;
    });
}
// --- Główna logika aplikacji ---

async function getWeatherData() {
  const city = input.value.trim();

  if (city === "") {
    showMessage("Proszę wpisać nazwę miasta.");
    return;
  }

  showMessage("Ładowanie danych...");
  let currentHtml = '';
  let forecastHtml = '';

  try {
    const currentData = await fetchCurrentWeather(city);
    currentHtml = renderCurrent(currentData);
    console.log("Dane Pogody Bieżącej:", currentData);

    const forecastData = await fetchForecast(city);
    forecastHtml = renderForecast(forecastData);

    showMessage(currentHtml + forecastHtml);

  } catch (error) {
    console.error("Błąd API:", error);
    showMessage(`
      <div class="error-message">
        Nie udało się pobrać danych dla **${city}**. 
        Upewnij się, że nazwa miasta jest poprawna (np. **Warsaw,PL**).
        <br>Szczegóły błędu: ${error.message || 'Nieznany błąd.'}
      </div>
    `);
  }
}

// kliknięcie przycisku
btn.addEventListener("click", getWeatherData);