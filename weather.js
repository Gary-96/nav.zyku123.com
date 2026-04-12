// 天气组件 JavaScript - 真实天气版本 (修复了 ID 匹配问题)
class WeatherWidget {
    constructor() {
        this.defaultCity = '北京'; // 默认保底城市
        this.init();
    }

    init() {
        this.loadWeather();
        // 每30分钟更新一次天气 (30 * 60 * 1000 毫秒)
        setInterval(() => this.loadWeather(), 30 * 60 * 1000);
    }

    async loadWeather() {
        try {
            // 获取并显示真实天气数据
            const weatherData = await this.fetchWeatherData();
            this.updateWeatherDisplay(weatherData);
        } catch (error) {
            console.error('天气数据加载失败:', error);
            this.showDefaultWeather();
        }
    }

    async fetchWeatherData() {
        // 1. 获取地理位置 (IP定位)
        let lat = 39.9042;  // 默认北京纬度
        let lon = 116.4074; // 默认北京经度
        let cityName = this.defaultCity;

        try {
            // 使用更稳定且支持 HTTPS 的 ipinfo.io 接口
            const ipRes = await fetch('https://ipinfo.io/json');
            if (ipRes.ok) {
                const ipData = await ipRes.json();
                // ipinfo 返回的经纬度格式是 "纬度,经度" 的字符串，需要拆分
                if (ipData.loc) {
                    const locParts = ipData.loc.split(',');
                    lat = parseFloat(locParts[0]);
                    lon = parseFloat(locParts[1]);
                }
                cityName = ipData.city || this.defaultCity; 
            }
        } catch (e) {
            console.warn('IP定位失败，使用默认坐标', e);
        }

        // 2. 获取真实天气 (使用免 API Key 的 Open-Meteo)
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`;
        const weatherRes = await fetch(weatherUrl);
        
        if (!weatherRes.ok) {
            throw new Error('天气接口请求失败');
        }

        const data = await weatherRes.json();
        const currentTemp = Math.round(data.current.temperature_2m); // 四舍五入取整
        const weatherCode = data.current.weather_code;

        return {
            city: cityName,
            temp: currentTemp,
            icon: this.getWeatherEmoji(weatherCode)
        };
    }

    // 将 WMO 天气代码转换为 Emoji 图标
    getWeatherEmoji(code) {
        if (code === 0) return '☀️'; // 晴天
        if (code === 1 || code === 2) return '⛅'; // 多云
        if (code === 3) return '☁️'; // 阴天
        if (code >= 45 && code <= 48) return '🌫️'; // 雾
        if (code >= 51 && code <= 67) return '🌧️'; // 雨
        if (code >= 71 && code <= 77) return '❄️'; // 雪
        if (code >= 80 && code <= 82) return '🌦️'; // 阵雨
        if (code >= 95 && code <= 99) return '⛈️'; // 雷暴
        return '🌡️'; // 未知天气保底
    }

    updateWeatherDisplay(data) {
        // 关键修复：这里的 ID 已经改为和 index.html 一致的 weather-widget
        const weatherInfo = document.getElementById('weather-widget');
        if (!weatherInfo) return;

        const cityElement = weatherInfo.querySelector('.weather-city');
        const iconElement = weatherInfo.querySelector('.weather-icon');
        const tempElement = weatherInfo.querySelector('.weather-temp');

        // 更新内容
        if (cityElement) cityElement.textContent = data.city;
        if (iconElement) iconElement.textContent = data.icon;
        if (tempElement) tempElement.textContent = `${data.temp}°`;
    }

    showDefaultWeather() {
        // 关键修复：这里的 ID 已经改为和 index.html 一致的 weather-widget
        const weatherInfo = document.getElementById('weather-widget');
        if (!weatherInfo) return;

        const cityElement = weatherInfo.querySelector('.weather-city');
        const iconElement = weatherInfo.querySelector('.weather-icon');
        const tempElement = weatherInfo.querySelector('.weather-temp');

        if (cityElement) cityElement.textContent = '未知';
        if (iconElement) iconElement.textContent = '☁️';
        if (tempElement) tempElement.textContent = '--°';
    }
}

// 快捷搜索功能
function quickSearch(keyword) {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.value = keyword;
        searchInput.focus();
        
        // 触发搜索
        const searchForm = document.querySelector('.search-form');
        if (searchForm) {
            searchForm.dispatchEvent(new Event('submit'));
        }
    }
}

// 页面加载完成后初始化天气组件
document.addEventListener('DOMContentLoaded', () => {
    new WeatherWidget();
});
