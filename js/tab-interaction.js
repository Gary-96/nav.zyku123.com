// 全局卡片过滤入口（供 index.html 内联 onclick 调用）
// 用法：filterCards(gridId, subcat, el)
//   subcat='all' 显示全部；否则显示 data-subcat 匹配的卡片
//   el：被点击的 Tab 元素；侧边栏二级菜单触发时为 null，此时通过 onclick 属性值匹配同步 active
window.filterCards = function(gridId, subcat, el) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    // 1. 强制过滤卡片（带 !important 避免被高权重 CSS 覆盖）
    const cards = grid.querySelectorAll('.nav-card');
    cards.forEach(card => {
        const val = card.dataset.subcat || card.dataset.type || card.dataset.category;
        const match = (subcat === 'all' || val === subcat);
        if (match) {
            card.style.removeProperty('display');
        } else {
            card.style.setProperty('display', 'none', 'important');
        }
    });

    // 2. 同步 Tab 高亮样式
    const section = grid.closest('.content-section') || grid.parentElement;
    if (section) {
        const tabs = section.querySelectorAll('.sub-category-tab');
        tabs.forEach(tab => {
            if (el) {
                tab.classList.toggle('active', tab === el);
            } else {
                const onclickStr = tab.getAttribute('onclick') || '';
                tab.classList.toggle('active', onclickStr.includes(`'${subcat}'`));
            }
        });
    }
};


// 侧边栏联动内容区 Tab 交互系统
document.addEventListener('DOMContentLoaded', function() {
    
    // 0. 初始化默认状态
    initializeDefaultState();
    
    // 0.1 初始化全局卡片悬浮效果
    initializeCardHoverEffects();
    
    
    // 1. 侧边栏主菜单点击联动
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // 移除所有菜单项的active类
            menuItems.forEach(mi => mi.classList.remove('active'));
            
            // 为当前点击的菜单项添加active类
            this.classList.add('active');
            
            // 如果有href锚点，进行页面跳转
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // 计算目标滚动位置：顶部偏移 = 目标元素相对视口距离 + 当前页面已滚动距离 - 顶部固定导航栏高度(64) - 更大的缓冲间距(100px)避免贴顶
                    const offsetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 64 - 100;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // 1. 侧边栏二级菜单点击联动
    const submenuItems = document.querySelectorAll('.submenu-item');
    
    submenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // 获取目标ID：仅拦截锚点链接，外部链接（target="_blank"）放行正常跳转
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();

                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // 计算目标滚动位置：顶部偏移 = 目标元素相对视口距离 + 当前页面已滚动距离 - 顶部固定导航栏高度(64) - 更大的缓冲间距(100px)避免贴顶
                    const offsetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 64 - 100;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                    
                }
            }
        });
    });
    
    // 0.1 初始化全局卡片悬浮效果
    function initializeCardHoverEffects() {
        // 专门遍历所有.nav-card元素
        const allNavCards = document.querySelectorAll('.nav-card');
        
        allNavCards.forEach((card, index) => {
            // 如果没有data-description属性，从p标签获取
            if (!card.hasAttribute('data-description')) {
                const description = card.querySelector('p');
                if (description) {
                    const descText = description.textContent.trim();
                    card.setAttribute('data-description', descText);
                } else {
                }
            } else {
            }
        });
    }
    
    // 0. 初始化默认状态函数
    function initializeDefaultState() {
        // 确保侧边栏第一个选项处于active状态
        const firstMenuItem = document.querySelector('.menu-item');
        if (firstMenuItem && !firstMenuItem.classList.contains('active')) {
            firstMenuItem.classList.add('active');
        }
        
        // 遍历所有带二级Tab的section，默认激活第一个Tab
        const sectionsWithTabs = document.querySelectorAll('.content-section');
        sectionsWithTabs.forEach(section => {
            const tabs = section.querySelectorAll('.sub-category-tab');
            if (tabs.length > 0) {
                // 移除所有active类
                tabs.forEach(tab => tab.classList.remove('active'));
                // 激活第一个Tab
                tabs[0].classList.add('active');
            }
        });
        
        // 确保页面加载时在顶部，不产生锚点跳转
        if (window.location.hash === '') {
            window.scrollTo(0, 0);
        }
    }
    
    // 5. 内容区Tab点击功能
    const tabLinks = document.querySelectorAll('.sub-category-tab');
    
    tabLinks.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 移除同section内所有tab的active类
            const sectionTabs = this.closest('.sub-category-tabs').querySelectorAll('.sub-category-tab');
            sectionTabs.forEach(t => t.classList.remove('active'));
            
            // 添加active类到当前tab
            this.classList.add('active');
            
        });
    });
    
    
    // 7. Tab栏横向滑动优化
    const tabContainers = document.querySelectorAll('.sub-category-tabs');
    
    tabContainers.forEach(container => {
        let isDown = false;
        let startX;
        let scrollLeft;
        
        container.addEventListener('mousedown', function(e) {
            isDown = true;
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
            container.style.cursor = 'grabbing';
        });
        
        container.addEventListener('mouseleave', function() {
            isDown = false;
            container.style.cursor = 'grab';
        });
        
        container.addEventListener('mouseup', function() {
            isDown = false;
            container.style.cursor = 'grab';
        });
        
        container.addEventListener('mousemove', function(e) {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2;
            container.scrollLeft = scrollLeft - walk;
        });
    });
    
    // 8. 响应式处理
    function handleResize() {
        const tabContainers = document.querySelectorAll('.sub-category-tabs');
        tabContainers.forEach(container => {
            if (container.scrollWidth > container.clientWidth) {
                container.style.cursor = 'grab';
            } else {
                container.style.cursor = 'default';
            }
        });
    }
    
    window.addEventListener('resize', handleResize);
    handleResize(); // 初始化检查
});
