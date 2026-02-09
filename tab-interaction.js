// 侧边栏联动内容区 Tab 交互系统
document.addEventListener('DOMContentLoaded', function() {
    
    // 0. 初始化默认状态
    initializeDefaultState();
    
    // 0.1 初始化全局卡片悬浮效果
    initializeCardHoverEffects();
    
    // 1. 侧边栏二级菜单点击联动
    const submenuItems = document.querySelectorAll('.submenu-item');
    
    submenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 获取目标ID
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // 平滑滚动到目标位置
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                    
                    // 激活对应的Tab
                    activateTabByHref(href);
                    
                    // 过滤显示对应分类的卡片
                    filterCardsByCategory(targetId);
                }
            }
        });
    });
    
    // 0.1 初始化全局卡片悬浮效果
    function initializeCardHoverEffects() {
        // 专门遍历所有.nav-card元素
        const allNavCards = document.querySelectorAll('.nav-card');
        console.log('找到.nav-card数量:', allNavCards.length); // 调试信息
        
        allNavCards.forEach((card, index) => {
            // 如果没有data-description属性，从p标签获取
            if (!card.hasAttribute('data-description')) {
                const description = card.querySelector('p');
                if (description) {
                    const descText = description.textContent.trim();
                    card.setAttribute('data-description', descText);
                    console.log(`卡片 ${index + 1} 添加描述:`, descText); // 调试信息
                } else {
                    console.log(`卡片 ${index + 1} 没有找到描述文本`); // 调试信息
                }
            } else {
                console.log(`卡片 ${index + 1} 已有描述:`, card.getAttribute('data-description')); // 调试信息
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
                
                // 显示第一个Tab对应的卡片
                const firstTabHref = tabs[0].getAttribute('href');
                if (firstTabHref && firstTabHref.startsWith('#')) {
                    const firstTabId = firstTabHref.substring(1);
                    showTabCards(section, firstTabId);
                }
            }
        });
        
        // 确保页面加载时在顶部，不产生锚点跳转
        if (window.location.hash === '') {
            window.scrollTo(0, 0);
        }
    }
    
    // 显示特定Tab对应的卡片
    function showTabCards(section, activeTabId) {
        const cardGroups = section.querySelectorAll('.card-group');
        cardGroups.forEach(group => {
            if (group.id === activeTabId) {
                group.style.display = 'block';
                group.style.opacity = '1';
                group.style.transform = 'scale(1)';
            } else {
                group.style.display = 'none';
            }
        });
    }
    
    // 2. 激活Tab根据href
    function activateTabByHref(href) {
        // 查找对应的Tab
        const targetTab = document.querySelector(`.sub-category-tab[href="${href}"]`);
        if (targetTab) {
            // 移除同section内所有tab的active类
            const sectionTabs = targetTab.closest('.sub-category-tabs').querySelectorAll('.sub-category-tab');
            sectionTabs.forEach(tab => tab.classList.remove('active'));
            
            // 添加active类到目标tab
            targetTab.classList.add('active');
            
            // 自动滚动Tab到可见区域
            scrollTabIntoView(targetTab);
            
            // 显示对应的卡片
            const section = targetTab.closest('.content-section');
            const tabId = href.substring(1);
            showTabCards(section, tabId);
        }
    }
    
    // 3. 过滤显示对应分类的卡片
    function filterCardsByCategory(categoryId) {
        // 找到对应的section
        const targetElement = document.getElementById(categoryId);
        if (targetElement) {
            const section = targetElement.closest('.content-section');
            if (section) {
                // 显示所有卡片
                const allCardGroups = section.querySelectorAll('.card-group');
                allCardGroups.forEach(group => {
                    group.style.display = 'block';
                });
                
                // 高亮显示对应的卡片组
                allCardGroups.forEach(group => {
                    if (group.id === categoryId) {
                        group.style.opacity = '1';
                        group.style.transform = 'scale(1)';
                    } else {
                        group.style.opacity = '0.3';
                        group.style.transform = 'scale(0.95)';
                    }
                });
                
                // 3秒后恢复所有卡片
                setTimeout(() => {
                    allCardGroups.forEach(group => {
                        group.style.opacity = '1';
                        group.style.transform = 'scale(1)';
                    });
                }, 3000);
            }
        }
    }
    
    // 4. Tab自动滚动到可见区域
    function scrollTabIntoView(tab) {
        const tabContainer = tab.closest('.sub-category-tabs');
        if (tabContainer) {
            // 计算Tab的位置
            const tabLeft = tab.offsetLeft;
            const tabWidth = tab.offsetWidth;
            const containerWidth = tabContainer.clientWidth;
            const containerScrollLeft = tabContainer.scrollLeft;
            
            // 检查Tab是否在可见区域
            if (tabLeft < containerScrollLeft || tabLeft + tabWidth > containerScrollLeft + containerWidth) {
                // 滚动到Tab位置
                tabContainer.scrollTo({
                    left: tabLeft - 20, // 留一些边距
                    behavior: 'smooth'
                });
            }
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
            
            // 获取目标ID并滚动到对应位置
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                    
                    // 显示对应的卡片
                    const section = this.closest('.content-section');
                    showTabCards(section, targetId);
                }
            }
        });
    });
    
    // 6. 监听滚动，自动激活对应tab
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(function() {
            const cardGroups = document.querySelectorAll('.card-group');
            const scrollPosition = window.scrollY + window.innerHeight / 2;
            
            let closestGroup = null;
            let closestDistance = Infinity;
            
            cardGroups.forEach(group => {
                if (group.style.display !== 'none') {
                    const groupTop = group.offsetTop;
                    const distance = Math.abs(scrollPosition - groupTop);
                    
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestGroup = group;
                    }
                }
            });
            
            if (closestGroup) {
                const groupId = closestGroup.id;
                const section = closestGroup.closest('.content-section');
                
                if (section) {
                    const sectionTabs = section.querySelectorAll('.sub-category-tab');
                    sectionTabs.forEach(tab => {
                        const tabHref = tab.getAttribute('href');
                        if (tabHref === `#${groupId}`) {
                            // 移除其他tab的active类
                            sectionTabs.forEach(t => t.classList.remove('active'));
                            // 激活当前tab
                            tab.classList.add('active');
                        }
                    });
                }
            }
        }, 100);
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
