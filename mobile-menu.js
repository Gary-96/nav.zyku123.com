// 移动端抽屉式侧边栏交互
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebarWrapper = document.querySelector('.sidebar-wrapper');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    // 菜单按钮点击事件
    if (mobileMenuBtn && sidebarWrapper && sidebarOverlay) {
        mobileMenuBtn.addEventListener('click', function() {
            toggleSidebar();
        });
        
        // 遮罩层点击事件
        sidebarOverlay.addEventListener('click', function() {
            closeSidebar();
        });
        
        // ESC键关闭侧边栏
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && sidebarWrapper.classList.contains('sidebar-active')) {
                closeSidebar();
            }
        });
    }
    
    // 切换侧边栏状态
    function toggleSidebar() {
        if (sidebarWrapper.classList.contains('sidebar-active')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }
    
    // 打开侧边栏
    function openSidebar() {
        sidebarWrapper.classList.add('sidebar-active');
        sidebarOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    }
    
    // 关闭侧边栏
    function closeSidebar() {
        sidebarWrapper.classList.remove('sidebar-active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = ''; // 恢复背景滚动
    }
    
    // 侧边栏菜单点击后自动关闭
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                setTimeout(closeSidebar, 300); // 延迟关闭，让跳转先执行
            }
        });
    });
    
    // 窗口大小改变时重置状态
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            // 桌面端移除所有移动端类
            sidebarWrapper.classList.remove('sidebar-active');
            sidebarOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});
