// 移动端抽屉式侧边栏交互

// 全局暴露以供 onclick="toggleMobileMenu()" 调用
window.toggleMobileMenu = function() {
    const sidebarWrapper = document.querySelector('.sidebar-wrapper');
    let sidebarOverlay = document.getElementById('sidebarOverlay');
    
    // 如果没有遮罩层，动态生成
    if (!sidebarOverlay) {
        sidebarOverlay = document.createElement('div');
        sidebarOverlay.id = 'sidebarOverlay';
        sidebarOverlay.className = 'mobile-overlay';
        document.body.appendChild(sidebarOverlay);
        
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    if (sidebarWrapper.classList.contains('sidebar-active')) {
        closeSidebar();
    } else {
        openSidebar();
    }
};

function openSidebar() {
    const sidebarWrapper = document.querySelector('.sidebar-wrapper');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    if (sidebarWrapper) sidebarWrapper.classList.add('sidebar-active');
    if (sidebarOverlay) sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // 防止主页面背景滚动
}

function closeSidebar() {
    const sidebarWrapper = document.querySelector('.sidebar-wrapper');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    if (sidebarWrapper) sidebarWrapper.classList.remove('sidebar-active');
    if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    document.body.style.overflow = ''; // 恢复背景滚动
}

document.addEventListener('DOMContentLoaded', function() {
    // 监听导航选项的点击事件，当屏幕宽度处于手机状态时，点击后自动关闭侧边栏
    const menuItems = document.querySelectorAll('.menu-item, .submenu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                setTimeout(closeSidebar, 300); // 延迟关闭，让跳转先触发
            }
        });
    });

    // 监听键盘 ESC
    document.addEventListener('keydown', function(e) {
        const sidebarWrapper = document.querySelector('.sidebar-wrapper');
        if (e.key === 'Escape' && sidebarWrapper && sidebarWrapper.classList.contains('sidebar-active')) {
            closeSidebar();
        }
    });

    // 窗口大小改变时重置类名
    });
});

// 自动处理导航栏高亮状态
document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-item, .header-nav-item');
    
    // 获取文件名的通用函数
    const getPageName = (path) => {
        if (!path) return '';
        const parts = path.split('?')[0].split('#')[0].split('/');
        const name = parts[parts.length - 1];
        return (name === '' || name === '/') ? 'index.html' : name;
    };

    const currentPage = getPageName(currentPath);
    
    navLinks.forEach(link => {
        // 先移除所有 active
        link.classList.remove('active'); 
        
        const href = link.getAttribute('href');
        if (!href) return;

        const targetPage = getPageName(href);

        // 匹配逻辑
        if (currentPage === targetPage) {
            link.classList.add('active');
        }
    });
});
