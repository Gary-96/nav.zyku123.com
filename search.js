// 搜索区交互逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 搜索引擎配置
    const searchEngines = {
        local: {
            placeholder: '搜索站内资源...',
            action: '#',
            name: '站内资源'
        },
        baidu: {
            placeholder: '百度一下，你就知道...',
            action: 'https://www.baidu.com/s',
            target: '_blank',
            name: '百度'
        },
        bing: {
            placeholder: '在 Bing 中搜索...',
            action: 'https://www.bing.com/search',
            target: '_blank',
            name: 'Bing'
        },
        google: {
            placeholder: 'Google 搜索...',
            action: 'https://www.google.com/search',
            target: '_blank',
            name: 'Google'
        },
        duckduckgo: {
            placeholder: 'DuckDuckGo 搜索...',
            action: 'https://duckduckgo.com/',
            target: '_blank',
            name: 'DuckDuckGo'
        }
    };

    // 分类配置
    const categoryConfig = {
        site: {
            engines: ['local'],
            defaultEngine: 'local'
        },
        resources: {
            engines: ['local'],
            defaultEngine: 'local'
        },
        search: {
            engines: ['baidu', 'bing', 'google', 'duckduckgo'],
            defaultEngine: 'baidu'
        },
        movies: {
            engines: ['baidu', 'bing'],
            defaultEngine: 'baidu'
        },
        music: {
            engines: ['baidu', 'bing'],
            defaultEngine: 'baidu'
        }
    };

    // DOM 元素
    const categoryItems = document.querySelectorAll('.category-item');
    const engineItems = document.querySelectorAll('.engine-item');
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');

    // 当前状态
    let currentCategory = 'site';
    let currentEngine = 'local';

    // 分类切换
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有激活状态
            categoryItems.forEach(cat => cat.classList.remove('active'));
            // 添加当前激活状态
            this.classList.add('active');
            
            // 更新当前分类
            currentCategory = this.dataset.category;
            
            // 更新引擎选项
            updateEngines(currentCategory);
        });
    });

    // 引擎切换
    engineItems.forEach(item => {
        item.addEventListener('click', function() {
            // 移除所有激活状态
            engineItems.forEach(eng => eng.classList.remove('active'));
            // 添加当前激活状态
            this.classList.add('active');
            
            // 更新当前引擎
            currentEngine = this.dataset.engine;
            
            // 更新搜索表单
            updateSearchForm(currentEngine);
        });
    });

    // 更新引擎选项
    function updateEngines(category) {
        const config = categoryConfig[category];
        const engines = config.engines;
        const defaultEngine = config.defaultEngine;
        
        // 隐藏所有引擎
        engineItems.forEach(item => {
            item.style.display = 'none';
            item.classList.remove('active');
        });
        
        // 显示对应分类的引擎
        engines.forEach(engine => {
            const engineItem = document.querySelector(`[data-engine="${engine}"]`);
            if (engineItem) {
                engineItem.style.display = 'block';
            }
        });
        
        // 设置默认引擎
        const defaultEngineItem = document.querySelector(`[data-engine="${defaultEngine}"]`);
        if (defaultEngineItem) {
            defaultEngineItem.classList.add('active');
            currentEngine = defaultEngine;
            updateSearchForm(defaultEngine);
        }
    }

    // 更新搜索表单
    function updateSearchForm(engine) {
        const config = searchEngines[engine];
        if (config) {
            searchInput.placeholder = config.placeholder;
            searchForm.action = config.action;
            
            // 设置target
            if (config.target) {
                searchForm.target = config.target;
            } else {
                searchForm.removeAttribute('target');
            }
            
            // 添加或更新name参数
            if (engine === 'baidu') {
                searchInput.name = 'wd';
            } else if (engine === 'bing' || engine === 'google') {
                searchInput.name = 'q';
            } else {
                searchInput.removeAttribute('name');
            }
        }
    }

    // 搜索表单提交
    searchForm.addEventListener('submit', function(e) {
        const query = searchInput.value.trim();
        if (!query) {
            e.preventDefault();
            searchInput.focus();
            return;
        }
        
        // 站内搜索特殊处理
        if (currentEngine === 'local') {
            e.preventDefault();
            // 这里可以添加站内搜索逻辑
            console.log('站内搜索:', query);
            return;
        }
    });

    // 初始化
    updateEngines(currentCategory);
});
