/* ═══════════════════════════════════════════════════════════════
   顺诚AI工作平台 · 布局层
   ───────────────────────────────────────────────────────────────
   顶部栏 + 左侧导航由本文件统一注入，全站只有这一份。
   改导航 = 改 data/categories.js；改导航样式 = 改 assets/theme.css。

   用法（页面 <body> 上标注当前页）：
     <body data-page="kitchen">
   本文件自动渲染：
     #sc-header   顶部栏（含移动端汉堡按钮）
     #sc-sidebar  左侧导航（按 data-page 高亮）
     #sc-backdrop 移动端遮罩
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var DATA = window.SC_DATA || {};
  var PAGE = document.body.getAttribute('data-page') || 'index';
  var esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };

  /* ── 轻提示 ── */
  var toastEl = null, toastTimer = null;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    /* 强制重排以重启动画 */
    void toastEl.offsetWidth;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2200);
  }
  window.scToast = toast;

  /* ── 顶部栏 ── */
  function renderHeader() {
    var host = document.getElementById('sc-header');
    if (!host) return;
    var m = DATA.meta || {};
    host.outerHTML =
      '<header class="header">' +
        '<button class="nav-toggle" id="scNavToggle" type="button" aria-label="打开导航">☰</button>' +
        '<div class="header-brand">' +
          '<div class="logo">' + esc(m.logo || '顺') + '</div>' +
          '<span>' + esc(m.name || '顺诚AI工作平台') + '</span>' +
        '</div>' +
        '<div class="header-search">' +
          '<span class="search-icon">🔍</span>' +
          '<input type="text" id="scSearch" placeholder="搜索品类、产品、店铺..." />' +
        '</div>' +
        '<div class="header-actions">' +
          '<button class="btn btn-secondary btn-sm" data-todo="导出报告">📤 导出报告</button>' +
          '<div class="header-user">' +
            '<div class="avatar">' + esc(m.user || '顺') + '</div>' +
            '<span>' + esc(m.user || '顺诚') + '</span>' +
          '</div>' +
        '</div>' +
      '</header>';
  }

  /* ── 左侧导航 ── */
  function isActive(node) {
    if (!node || !node.page) return false;
    var target = node.page.replace(/\.html$/, '');
    return target === PAGE;
  }

  function childHTML(c) {
    var cls = 'sidebar-item' + (isActive(c) ? ' active' : '');
    var icon = c.icon ? '<span class="icon">' + esc(c.icon) + '</span>' : '';
    if (c.page) {
      return '<a href="' + esc(c.page) + '" class="' + cls + '">' + icon + esc(c.name) + '</a>';
    }
    return '<div class="' + cls + '" data-todo="' + esc(c.name) + '">' + icon + esc(c.name) + '</div>';
  }

  function sidebarHTML() {
    var out = '';
    (DATA.nav || []).forEach(function (item) {
      if (item.divider) { out += '<div class="sidebar-divider"></div>'; return; }
      if (item.sectionTitle) { out += '<div class="sidebar-section-title">' + esc(item.sectionTitle) + '</div>'; return; }

      /* 独立智能体项（无下拉） */
      if (item.items) {
        out += '<div class="sidebar-section">';
        item.items.forEach(function (it) {
          out += '<div class="sidebar-item' + (it.todo ? ' is-todo' : '') + '"' +
                 (it.todo ? ' data-todo="' + esc(it.name) + '"' : '') + '>' +
                 '<span class="icon">' + esc(it.icon || '') + '</span>' + esc(it.name) + '</div>';
        });
        out += '</div>';
        return;
      }

      /* 带下拉的板块 */
      var hasActive = (item.children || []).some(isActive);
      var open = item.expanded || hasActive;
      out += '<div class="sidebar-section">' +
        '<div class="sidebar-item' + (open ? ' expanded active' : '') + '" data-toggle="1">' +
          '<span class="icon">' + esc(item.icon || '') + '</span>' + esc(item.name) +
          '<span class="arrow">▶</span>' +
        '</div>' +
        '<div class="sidebar-sub' + (open ? ' open' : '') + '">' +
          (item.children || []).map(childHTML).join('') +
        '</div>' +
      '</div>';
    });
    return out;
  }

  function renderSidebar() {
    var host = document.getElementById('sc-sidebar');
    if (!host) return;

    var backdrop = document.createElement('div');
    backdrop.className = 'backdrop';
    backdrop.id = 'sc-backdrop';
    document.body.appendChild(backdrop);

    host.outerHTML = '<aside class="sidebar" id="scSidebar">' + sidebarHTML() + '</aside>';

    /* 下拉展开/收起 */
    document.getElementById('scSidebar').addEventListener('click', function (e) {
      var t = e.target.closest('[data-toggle]');
      if (t) {
        var sub = t.nextElementSibling;
        if (sub && sub.classList.contains('sidebar-sub')) {
          sub.classList.toggle('open');
          t.classList.toggle('expanded');
        }
        return;
      }
      if (e.target.closest('[data-todo]')) {
        var name = e.target.closest('[data-todo]').getAttribute('data-todo');
        toast('「' + name + '」尚未开放，将在后续阶段接入');
        closeNav();
      }
    });

    /* 移动端抽屉 */
    var sidebar = document.getElementById('scSidebar');
    function openNav() {
      sidebar.classList.add('open');
      backdrop.classList.add('show');
    }
    function closeNav() {
      sidebar.classList.remove('open');
      backdrop.classList.remove('show');
    }
    window.scOpenNav = openNav;
    window.scCloseNav = closeNav;

    var tgl = document.getElementById('scNavToggle');
    if (tgl) tgl.addEventListener('click', openNav);
    backdrop.addEventListener('click', closeNav);

    /* 视口回到桌面宽度时复位 */
    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) closeNav();
    });
  }

  /* ── 全局按钮兜底 ──
     尚未实现的功能一律给出提示，不做"点了没反应"的死按钮 */
  function bindTodos() {
    document.addEventListener('click', function (e) {
      var el = e.target.closest('[data-todo]');
      if (!el) return;
      if (el.closest('#scSidebar') || el.closest('.sidebar')) return; /* 导航已单独处理 */
      e.preventDefault();
      toast('「' + el.getAttribute('data-todo') + '」尚未开放，将在后续阶段接入');
    });
    var search = document.getElementById('scSearch');
    if (search) {
      search.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') toast('全局搜索将在数据接入后启用');
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderHeader();
    renderSidebar();
    bindTodos();
  });
})();
