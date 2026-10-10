getLocation();
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, () => {
            document.getElementById("body").style.filter = 'blur(0rem)';
        });
    }
}

function showPosition(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
//     console.log(latitude + " " + longitude);
    getName(latitude, longitude)
}
async function getName(latitude, longitude) {
    var access_key = '2868a03a00fa977f7f1bf835f7b0c557'
    var url = `https://api.openweathermap.org/geo/1.0/reverse?lat=` + latitude + `&lon=` + longitude + `&limit=5&appid=` + access_key;
    var res = await fetch(url);
    var data = await res.json();
    var location = data[0].name.split(" ")[0];
    fetchData(location);
    document.getElementById("body").style.filter = 'blur(0rem)';
}

function findWeather() {
    var location = document.getElementById("search").value;
    fetchData(location)
}
async function fetchData(location) {
    var currentUrl = `https://api.weatherapi.com/v1/current.json?key=1c63857a8e0548f9a1a152750210909&q=` + location + `&aqi=yes`;
    var forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=1c63857a8e0548f9a1a152750210909&q=` + location + `&days=7&aqi=no`;
    
    var res = await fetch(currentUrl);
    var data = await res.json();
    
    if(res.status == 200){
        setValues(data);
        
        var forecastRes = await fetch(forecastUrl);
        var forecastData = await forecastRes.json();
        if(forecastRes.status == 200){
            displayForecast(forecastData);
        }
    }
    else{
        var tags = document.getElementsByClassName('reset');
        for (let index = 0; index < tags.length; index++) {
            tags.item(index).innerHTML = ""
        }
        document.getElementById("name").innerHTML = "Location not Found";
    }
}
function setValues(data) {
    var setter = document.getElementById("temp_c");
    setter.innerHTML = data.current.temp_c + `&#176`;

    setter = document.getElementById('name');
    setter.innerHTML = data.location.name;

    setter = document.getElementById("region");
    setter.innerHTML = `&nbsp;` +  data.location.region + `, ` + data.location.country;
    setter = document.getElementById("feelslike_c");
    setter.innerHTML = `Feels like ` + data.current.feelslike_c + `&#176`;

    setter = document.getElementById("condition");
    setter.innerHTML = data.current.condition.text;

    setter = document.getElementById("cloud");
    setter.innerHTML = data.current.cloud + `%`;

    setter = document.getElementById("humidity");
    setter.innerHTML = data.current.humidity + `%`;

    setter = document.getElementById("wind_kph");
    setter.innerHTML = data.current.wind_kph + ` Km/h ` + data.current.wind_dir;

    setter = document.getElementById("gust_kph");
    setter.innerHTML = data.current.gust_kph + ` Km/h`;

    setter = document.getElementById("precip_mm");
    setter.innerHTML = data.current.precip_mm + `mm`;

    setter = document.getElementById("pressure_mb");
    setter.innerHTML = data.current.pressure_mb + `mb`;

    setter = document.getElementById("vis_km");
    setter.innerHTML = data.current.vis_km + ` KM`;

    setter = document.getElementById("uv");
    setter.innerHTML = data.current.uv + ` `;

}

let tempChart = null;
let rainChart = null;

function displayForecast(data) {
    const forecastContainer = document.getElementById('forecast-cards');
    forecastContainer.innerHTML = '';
    
    const forecastDays = data.forecast.forecastday;
    const dates = [];
    const maxTemps = [];
    const minTemps = [];
    const avgTemps = [];
    const rainChances = [];
    
    forecastDays.forEach((day, index) => {
        const date = new Date(day.date);
        const dayName = index === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' });
        const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        dates.push(dayName);
        maxTemps.push(day.day.maxtemp_c);
        minTemps.push(day.day.mintemp_c);
        avgTemps.push(day.day.avgtemp_c);
        rainChances.push(day.day.daily_chance_of_rain);
        
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <div class="forecast-day">${dayName}</div>
            <div class="forecast-date">${dateStr}</div>
            <img class="forecast-icon" src="https:${day.day.condition.icon}" alt="${day.day.condition.text}">
            <div class="forecast-temp">${Math.round(day.day.avgtemp_c)}°C</div>
            <div class="forecast-temp-range">${Math.round(day.day.mintemp_c)}° / ${Math.round(day.day.maxtemp_c)}°</div>
            <div class="forecast-condition">${day.day.condition.text}</div>
            <div class="forecast-rain">💧 ${day.day.daily_chance_of_rain}%</div>
        `;
        forecastContainer.appendChild(card);
    });
    
    createTemperatureChart(dates, maxTemps, minTemps, avgTemps);
    createRainChart(dates, rainChances);
}

function createTemperatureChart(dates, maxTemps, minTemps, avgTemps) {
    const ctx = document.getElementById('tempChart');
    
    if (tempChart) {
        tempChart.destroy();
    }
    
    tempChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Max Temp (°C)',
                    data: maxTemps,
                    borderColor: '#FF6384',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Avg Temp (°C)',
                    data: avgTemps,
                    borderColor: '#36A2EB',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    tension: 0.4,
                    fill: true
                },
                {
                    label: 'Min Temp (°C)',
                    data: minTemps,
                    borderColor: '#4BC0C0',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.4,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#fff',
                        font: {
                            size: 12
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    ticks: {
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}

function createRainChart(dates, rainChances) {
    const ctx = document.getElementById('rainChart');
    
    if (rainChart) {
        rainChart.destroy();
    }
    
    rainChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: dates,
            datasets: [{
                label: 'Chance of Rain (%)',
                data: rainChances,
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: '#36A2EB',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#fff',
                        font: {
                            size: 12
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: '#fff',
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                x: {
                    ticks: {
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            }
        }
    });
}
