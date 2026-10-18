// 天气组件 - Open-Meteo + IP 定位 + localStorage 缓存版
// 设计目标：首屏无跳变、请求有熔断、定位有降级、支持点击手动刷新
(function () {
    'use strict';

    // ===== 常量 =====
    const CACHE_KEY = 'weather-cache-v1';
    const CACHE_TTL_MS = 20 * 60 * 1000;       // 缓存有效期 20 分钟
    const REFRESH_INTERVAL_MS = 20 * 60 * 1000; // 定时器与 TTL 对齐
    const REQUEST_TIMEOUT_MS = 4000;           // 外部请求 4 秒超时熔断
    const DEFAULT_CITY = { city: '襄阳', lat: 32.0088, lon: 112.1226 };

    // WMO 天气代码 -> Emoji（补全 53/78/85/86，未知代码兜底 🌡️）
    function getWeatherEmoji(code) {
        if (code === 0) return '☀️';                 // 晴
        if (code === 1 || code === 2) return '⛅';    // 少云/多云
        if (code === 3) return '☁️';                  // 阴
        if ((code >= 45 && code <= 48) || code === 53) return '🌫️'; // 雾/冻雾
        if (code >= 51 && code <= 67) return '🌧️';    // 毛毛雨/雨
        if (code >= 71 && code <= 77 || code === 78) return '❄️';   // 雪/雪粒
        if (code >= 80 && code <= 82) return '🌦️';    // 阵雨
        if (code === 85) return '🌧️';                // 强阵雨
        if (code === 86) return '🌨️';                // 强阵雨(冰粒)
        if (code >= 95 && code <= 99) return '⛈️';    // 雷暴
        return '🌡️';                                  // 未知代码兜底
    }

    // ===== localStorage 缓存（TTL 20 分钟）=====
    function readCache() {
        try {
            const raw = localStorage.getItem(CACHE_KEY);
            if (!raw) return null;
            const cached = JSON.parse(raw);
            return (cached && typeof cached.timestamp === 'number') ? cached : null;
        } catch (e) {
            return null; // 缓存损坏/存储不可用时静默降级
        }
    }

    function isCacheFresh(cached) {
        return !!cached && Date.now() - cached.timestamp < CACHE_TTL_MS;
    }

    function writeCache(city, temp, code) {
        try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ city, temp, code, timestamp: Date.now() }));
        } catch (e) {
            /* 隐私模式等存储不可用时忽略 */
        }
    }

    function clearCache() {
        try {
            localStorage.removeItem(CACHE_KEY);
        } catch (e) { /* 忽略 */ }
    }

    // ===== 带 4 秒超时熔断的 fetch =====
    function fetchWithTimeout(url) {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
        return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer));
    }

    // 城市名必须包含中文才采用，否则视为外文/罗马化名称（如 Seolcheon），走默认城市
    function isChineseCityName(name) {
        return typeof name === 'string' && /[\u4e00-\u9fa5]/.test(name);
    }

    async function fetchWeatherData() {
        // 1. IP 定位：超时/CORS 拒绝/非中文城市名 -> 优雅降级到默认城市（襄阳）
        let lat = DEFAULT_CITY.lat;
        let lon = DEFAULT_CITY.lon;
        let cityName = DEFAULT_CITY.city;
        try {
            const ipRes = await fetchWithTimeout('https://ipinfo.io/json');
            if (ipRes.ok) {
                const ipData = await ipRes.json();
                if (isChineseCityName(ipData.city) && ipData.loc) {
                    const parts = String(ipData.loc).split(',');
                    const l = parseFloat(parts[0]);
                    const lo = parseFloat(parts[1]);
                    if (Number.isFinite(l) && Number.isFinite(lo)) {
                        lat = l;
                        lon = lo;
                        cityName = ipData.city;
                    }
                }
            }
        } catch (e) {
            console.warn('[Weather] IP 定位失败（超时或跨域被拒），使用默认定位', e && e.message);
        }

        // 2. Open-Meteo 当前天气：timezone=auto + 数值防御
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto`;
        const weatherRes = await fetchWithTimeout(url);
        if (!weatherRes.ok) {
            throw new Error('天气接口请求失败: HTTP ' + weatherRes.status);
        }
        const data = await weatherRes.json();

        const temp = data.current && data.current.temperature_2m;
        if (typeof temp !== 'number' || !Number.isFinite(temp)) {
            throw new Error('天气数据缺少有效温度值');
        }

        const code = data.current.weather_code;
        return {
            city: cityName,
            temp: Math.round(temp),
            code: Number.isFinite(code) ? code : null,
            icon: getWeatherEmoji(Number.isFinite(code) ? code : undefined)
        };
    }

    // ===== 渲染（仅成功时更新 DOM，失败保持当前显示，杜绝"未知"跳变）=====
    function render(payload) {
        const widget = document.getElementById('weather-widget');
        if (!widget) return;
        const cityEl = widget.querySelector('.weather-city');
        const iconEl = widget.querySelector('.weather-icon');
        const tempEl = widget.querySelector('.weather-temp');
        if (cityEl) cityEl.textContent = payload.city;
        if (iconEl) iconEl.textContent = payload.icon;
        if (tempEl) tempEl.textContent = payload.temp + '°';
    }

    let refreshing = false; // 并发保护：避免定时器/点击/后台刷新叠加

    async function refresh() {
        if (refreshing) return;
        refreshing = true;
        const iconEl = document.querySelector('#weather-widget .weather-icon');
        if (iconEl) iconEl.classList.add('is-refreshing');
        try {
            const data = await fetchWeatherData();
            render(data);
            writeCache(data.city, data.temp, data.code);
        } catch (e) {
            console.warn('[Weather] 天气更新失败，保持当前显示', e && e.message);
        } finally {
            refreshing = false;
            if (iconEl) iconEl.classList.remove('is-refreshing');
        }
    }

    // ===== 初始化 =====
    document.addEventListener('DOMContentLoaded', () => {
        // 防御性检查：无天气容器的页面直接跳过，不产生任何外部请求与定时器
        const widget = document.getElementById('weather-widget');
        if (!widget) return;

        const cached = readCache();
        if (cached && cached.city && typeof cached.temp === 'number') {
            // 有缓存（无论是否过期）先渲染缓存内容，杜绝首屏闪烁
            render({ city: cached.city, temp: cached.temp, icon: getWeatherEmoji(cached.code) });
            if (isCacheFresh(cached)) {
                // 缓存期内不发出任何外部请求
            } else {
                // 缓存过期：后台静默刷新，成功后替换
                refresh();
            }
        } else {
            // 无缓存：首屏保持 HTML 静态默认（襄阳 ☁️ --°），成功后更新
            refresh();
        }

        setInterval(refresh, REFRESH_INTERVAL_MS);

        // 点击手动刷新：清缓存 + 立即重新获取（图标带旋转淡入过渡）
        widget.addEventListener('click', () => {
            clearCache();
            refresh();
        });
    });
})();
