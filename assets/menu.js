// 全新侧边栏菜单配置 - 包含所有备份的分类
const sidebarMenuConfig = [
    { title: "专题文章", icon: "fa-file-text", link: "#featured-articles" },
    { title: "常用推荐", icon: "fa-star", link: "#常用推荐" },
    { title: "界面灵感", icon: "fa-lightbulb-o", link: "#界面灵感" },
    { title: "社区资讯", icon: "fa-newspaper-o", link: "#社区资讯" },
    { title: "AI工具", icon: "fa-robot", link: "#ai-tools" },
    { title: "跨境支付", icon: "fa-credit-card", link: "#payment" },
    { title: "发现产品", icon: "fa-search", link: "#发现产品" },
    {
        title: "设计资源",
        icon: "fa-palette",
        submenu: [
            { title: "界面灵感", link: "#界面灵感" },
            { title: "网页灵感", link: "#网页灵感" },
            { title: "图标素材", link: "#图标素材" },
            { title: "LOGO设计", link: "#LOGO设计" },
            { title: "平面素材", link: "#平面素材" },
            { title: "UI资源", link: "#UI资源" },
            { title: "Sketch资源", link: "#Sketch资源" },
            { title: "字体资源", link: "#字体资源" },
            { title: "Mockup", link: "#Mockup" },
            { title: "摄影图库", link: "#摄影图库" },
            { title: "PPT资源", link: "#PPT资源" }
        ]
    },
    {
        title: "设计工具",
        icon: "fa-paint-brush",
        submenu: [
            { title: "图形创意", link: "#图形创意" },
            { title: "界面设计", link: "#界面设计" },
            { title: "交互动效", link: "#交互动效" },
            { title: "在线配色", link: "#在线配色" },
            { title: "在线工具", link: "#在线工具" },
            { title: "Chrome插件", link: "#Chrome插件" }
        ]
    },
    {
        title: "学习资源",
        icon: "fa-graduation-cap",
        submenu: [
            { title: "设计规范", link: "#设计规范" },
            { title: "视频教程", link: "#视频教程" },
            { title: "设计文章", link: "#设计文章" },
            { title: "设计电台", link: "#设计电台" },
            { title: "交互设计", link: "#交互设计" }
        ]
    },
    { title: "UED团队", icon: "fa-users", link: "#UED团队" },
    {
        title: "关于本站",
        icon: "fa-heart",
        link: "about.html",
        special: true
    }
];

// 渲染全新侧边栏菜单
function renderSidebarMenu() {
    const sidebarContainer = document.getElementById('sidebar-nav');
    if (!sidebarContainer) return;

    let menuHTML = '';
    
    sidebarMenuConfig.forEach(item => {
        if (item.submenu && item.submenu.length > 0) {
            // 有子菜单的项目
            menuHTML += `
                <li class="has-sub">
                    <a href="${item.link}" class="smooth-scroll">
                        <i class="fa ${item.icon}"></i>
                        <span>${item.title}</span>
                    </a>
                    <ul class="sub-menu">
                        ${item.submenu.map(subItem => `
                            <li>
                                <a href="${subItem.link}" class="smooth-scroll">
                                    <span>${subItem.title}</span>
                                </a>
                            </li>
                        `).join('')}
                    </ul>
                </li>
            `;
        } else {
            // 没有子菜单的项目
            menuHTML += `
                <li>
                    <a href="${item.link}" class="smooth-scroll">
                        <i class="fa ${item.icon}"></i>
                        <span>${item.title}</span>
                    </a>
                </li>
            `;
        }
    });
    
    sidebarContainer.innerHTML = menuHTML;
    
    // 添加平滑滚动事件监听
    initSmoothScroll();
    
    // 强制设置侧边栏位置
    forceSidebarPosition();
}

// 初始化平滑滚动
function initSmoothScroll() {
    const smoothScrollLinks = document.querySelectorAll('.smooth-scroll');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // 平滑滚动到目标位置
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // 更新URL但不触发页面跳转
                    history.pushState(null, null, targetId);
                }
            } else if (this.href && this.href.includes('about.html')) {
                // 对于外部链接，正常跳转
                window.location.href = this.href;
            }
        });
    });
}

// 强制设置侧边栏位置的函数
function forceSidebarPosition() {
    const sidebar = document.querySelector('.sidebar-menu');
    if (sidebar) {
        // 强制设置样式 - 使用325px (导航栏75px + 搜索框250px)
        sidebar.style.setProperty('top', '325px', 'important');
        sidebar.style.setProperty('margin-top', '0px', 'important');
        sidebar.style.setProperty('padding-top', '0px', 'important');
        sidebar.style.setProperty('transform', 'none', 'important');
        sidebar.style.setProperty('position', 'fixed', 'important');
        
        // 添加多重保障
        setTimeout(() => {
            sidebar.style.setProperty('top', '325px', 'important');
            sidebar.style.setProperty('margin-top', '0px', 'important');
            sidebar.style.setProperty('padding-top', '0px', 'important');
            sidebar.style.setProperty('transform', 'none', 'important');
        }, 100);
        
        // 再次强制设置
        setTimeout(() => {
            sidebar.style.setProperty('top', '325px', 'important');
            sidebar.style.setProperty('margin-top', '0px', 'important');
            sidebar.style.setProperty('padding-top', '0px', 'important');
            sidebar.style.setProperty('transform', 'none', 'important');
        }, 500);
    }
}

// 页面加载完成后渲染菜单
document.addEventListener('DOMContentLoaded', function() {
    renderSidebarMenu();
    initSearchComponent();
    initMobileMenu();
});

// 初始化移动端菜单
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const sidebar = document.querySelector('.sidebar-menu');
    
    if (mobileMenuBtn && sidebar) {
        mobileMenuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('show');
        });
        
        // 点击侧边栏外部关闭菜单
        document.addEventListener('click', function(e) {
            if (!sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                sidebar.classList.remove('show');
            }
        });
    }
}

// 初始化搜索组件
function initSearchComponent() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const searchInput = document.getElementById('search-input-main');
    const searchBtn = document.querySelector('.search-btn');
    
    // 搜索类型配置
    const searchTypes = {
        site: {
            placeholder: '站内搜索',
            action: '/search'
        },
        cloud: {
            placeholder: '搜索网盘资源...',
            action: '/search/cloud'
        },
        engine: {
            placeholder: '搜索引擎...',
            action: 'https://www.google.com/search?q='
        },
        api: {
            placeholder: '搜索API工具...',
            action: '/search/api'
        },
        design: {
            placeholder: '搜索设计资源...',
            action: '/search/design'
        }
    };
    
    // 选项卡点击事件
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有active类
            tabBtns.forEach(b => b.classList.remove('active'));
            // 添加active类到当前按钮
            this.classList.add('active');
            
            // 获取搜索类型
            const type = this.getAttribute('data-type');
            const config = searchTypes[type];
            
            // 更新placeholder
            if (searchInput && config) {
                searchInput.placeholder = config.placeholder;
                searchInput.setAttribute('data-type', type);
            }
        });
    });
    
    // 搜索按钮点击事件
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            performSearch();
        });
    }
    
    // 搜索框回车事件
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // 执行搜索
    function performSearch() {
        const query = searchInput.value.trim();
        if (!query) {
            alert('请输入搜索内容');
            return;
        }
        
        const activeTab = document.querySelector('.tab-btn.active');
        const type = activeTab ? activeTab.getAttribute('data-type') : 'site';
        const config = searchTypes[type];
        
        if (config) {
            if (type === 'engine') {
                // 搜索引擎在新窗口打开
                window.open(config.action + encodeURIComponent(query), '_blank');
            } else {
                // 其他搜索类型在当前窗口打开
                window.location.href = config.action + '?q=' + encodeURIComponent(query);
            }
        }
    }
}

// 兼容旧的菜单渲染函数
function renderCommonMenu() {
    renderSidebarMenu();
}

// 额外的强制设置 - 在窗口加载完成后再次执行
window.addEventListener('load', function() {
    forceSidebarPosition();
});

// 在页面内容加载完成后再次强制设置
window.addEventListener('resize', function() {
    forceSidebarPosition();
});