// 天气组件 JavaScript - 简化版本
class WeatherWidget {
    constructor() {
        this.city = '北京'; // 默认城市
        this.init();
    }

    init() {
        this.loadWeather();
        // 每30分钟更新一次天气
        setInterval(() => this.loadWeather(), 30 * 60 * 1000);
    }

    async loadWeather() {
        try {
            // 模拟天气数据，实际使用时替换为真实API
            const weatherData = await this.fetchWeatherData();
            this.updateWeatherDisplay(weatherData);
        } catch (error) {
            console.error('天气数据加载失败:', error);
            this.showDefaultWeather();
        }
    }

    async fetchWeatherData() {
        // 模拟天气数据
        return {
            temp: 22,
            description: '晴朗',
            icon: 'fa-sun'
        };
    }

    updateWeatherDisplay(data) {
        const widget = document.getElementById('weather-widget');
        if (!widget) return;

        const tempElement = widget.querySelector('.weather-temp');
        const descElement = widget.querySelector('.weather-desc');
        const iconElement = widget.querySelector('.weather-widget i');

        tempElement.textContent = `${data.temp}°C`;
        descElement.textContent = data.description;
        
        // 更新图标
        if (iconElement) {
            iconElement.className = `fas ${data.icon}`;
        }
    }

    showDefaultWeather() {
        const widget = document.getElementById('weather-widget');
        if (!widget) return;

        const tempElement = widget.querySelector('.weather-temp');
        const descElement = widget.querySelector('.weather-desc');

        if (tempElement) tempElement.textContent = '--°C';
        if (descElement) descElement.textContent = '加载中...';
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
