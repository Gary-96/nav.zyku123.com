// 我的收藏 / 常用推荐 — 纯静态 localStorage 实现
// 逻辑：全局卡片注入星标 → 点击持久化 → 首屏渲染『常用推荐』网格
(function () {
    'use strict';

    const STORAGE_KEY = 'zyku_favorite_cards';
    const FAV_ICON_FALLBACK = 'assets/images/favicon.webp';

    const favoritesGrid = document.querySelector('#favorites-grid');
    if (!favoritesGrid) return; // 无『常用推荐』网格的页面直接跳过

    // 缓存默认推荐内容，无自定义收藏时回退
    const defaultCardsHTML = favoritesGrid.innerHTML;
    const sectionTitle = favoritesGrid.closest('.content-section') ? favoritesGrid.closest('.content-section').querySelector('.section-title h2') : null;
    const defaultTitleHTML = sectionTitle ? sectionTitle.innerHTML : null;

    function getFavorites() {
        try {
            const list = JSON.parse(localStorage.getItem(STORAGE_KEY));
            return Array.isArray(list) ? list : [];
        } catch (e) {
            return []; // 缓存损坏时静默降级
        }
    }

    function saveFavorites(list) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        } catch (e) { /* 隐私模式忽略 */ }
        renderFavoritesSection();
        updateAllCardStarStates();
    }

    // 首屏渲染：有收藏 → 『我的收藏』；无收藏 → 默认『常用推荐』
    function renderFavoritesSection() {
        const list = getFavorites();

        if (list.length === 0) {
            favoritesGrid.innerHTML = defaultCardsHTML;
            if (sectionTitle) sectionTitle.innerHTML = defaultTitleHTML;
        } else {
            if (sectionTitle) {
                sectionTitle.innerHTML = '<i class="fas fa-star" style="color:#eab308;"></i> 我的收藏（' + list.length + '）';
            }
            favoritesGrid.innerHTML = list.map(item => `
                <a href="${item.url}" target="_blank" class="nav-card" data-site-id="${item.id}" title="${item.title}">
                    <span class="favorite-btn favorited" title="取消收藏" data-card-id="${item.id}"><i class="fas fa-star"></i></span>
                    <div class="nav-card-icon">
                        <img src="${item.icon || FAV_ICON_FALLBACK}" alt="${item.title}" onerror="this.src='${FAV_ICON_FALLBACK}'" style="width:32px;height:32px;border-radius:50%;object-fit:cover;">
                    </div>
                    <div class="card-info">
                        <h3>${item.title}</h3>
                        <p>${item.desc}</p>
                    </div>
                </a>
            `).join('');
            bindStarClickEvents(favoritesGrid);
        }
    }

    // 遍历全站卡片（收藏网格除外），注入星标并同步激活状态
    function setupGlobalCards() {
        const favs = getFavorites();
        const favIds = new Set(favs.map(f => f.id));

        document.querySelectorAll('.card-grid:not(#favorites-grid) .nav-card').forEach(card => {
            const url = card.getAttribute('href') || '';
            const title = (card.querySelector('h3') ? card.querySelector('h3').innerText : '').trim();
            const cardId = encodeURIComponent(title || url);
            card.setAttribute('data-site-id', cardId);

            // 避免重复注入
            if (!card.querySelector('.favorite-btn')) {
                const isFav = favIds.has(cardId);
                const starBtn = document.createElement('span');
                starBtn.className = 'favorite-btn' + (isFav ? ' favorited' : '');
                starBtn.title = isFav ? '取消收藏' : '加入常用收藏';
                starBtn.dataset.cardId = cardId;
                starBtn.innerHTML = isFav ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
                card.appendChild(starBtn);
            }
        });

        bindStarClickEvents(document.body);
    }

    // 统一星标点击处理（防止冒泡触发卡片跳转）
    function bindStarClickEvents(scope) {
        scope.querySelectorAll('.favorite-btn').forEach(btn => {
            if (btn.dataset.bound) return;
            btn.dataset.bound = '1';
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                const card = this.closest('.nav-card');
                if (!card) return;

                const cardId = this.dataset.cardId;
                const title = (card.querySelector('h3') ? card.querySelector('h3').innerText : '').trim();
                const desc = (card.querySelector('p') ? card.querySelector('p').innerText : '').trim();
                const url = card.getAttribute('href') || '#';
                const icon = card.querySelector('img') ? card.querySelector('img').getAttribute('src') : '';

                const list = getFavorites();
                const idx = list.findIndex(item => item.id === cardId);
                if (idx > -1) {
                    list.splice(idx, 1);
                } else {
                    list.unshift({ id: cardId, title, desc, url, icon });
                }
                saveFavorites(list);
            });
        });
    }

    // 收藏列表变化后，全站星标状态同步
    function updateAllCardStarStates() {
        const favIds = new Set(getFavorites().map(f => f.id));
        document.querySelectorAll('.favorite-btn').forEach(btn => {
            const isFav = favIds.has(btn.dataset.cardId);
            btn.classList.toggle('favorited', isFav);
            btn.title = isFav ? '取消收藏' : '加入常用收藏';
            btn.innerHTML = isFav ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        setupGlobalCards();
        renderFavoritesSection();
    });
})();
