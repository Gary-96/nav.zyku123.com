// 主题切换逻辑 (由于此脚本包含defer属性，所以无须等待DOMContentLoaded)
(function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    
    if (!themeToggle) {
        console.error('theme-toggle element not found!');
        return;
    }
    
    const icon = themeToggle.querySelector('i');
    
    // 检查本地存储中的主题设置
    const savedTheme = localStorage.getItem('theme');
    
    // 如果有保存的主题则应用，否则默认黑夜模式 (xiaozhongjishu style)
    if (savedTheme === 'light') {
        body.setAttribute('data-theme', 'light');
        if (icon) icon.className = 'fas fa-sun';
    } else {
        body.setAttribute('data-theme', 'dark');
        if (icon) icon.className = 'fas fa-moon';
    }

    // 切换主题功能
    themeToggle.addEventListener('click', () => {
        if (body.getAttribute('data-theme') === 'dark') {
            body.setAttribute('data-theme', 'light');
            if (icon) icon.className = 'fas fa-sun';
            localStorage.setItem('theme', 'light');
        } else {
            body.setAttribute('data-theme', 'dark');
            if (icon) icon.className = 'fas fa-moon';
            localStorage.setItem('theme', 'dark');
        }
    });
})();
