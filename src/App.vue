<template>
  <!-- 導覽列 (Navbar) -->
  <div class="navbar bg-neutral text-neutral-content">
    <div class="flex-1">
      <!-- 左側標題，點擊後返回首頁 -->
      <a class="btn btn-ghost text-xl" href="/">MY BLOG</a>
    </div>
    <div class="flex-none">
      <!-- 右側按鈕，點擊後跳轉到 "/post" 頁面 -->
      <a class="btn">
        <router-link to="/post">新增文章</router-link>
      </a>
    </div>
  </div>

  <!-- 路由視圖，會根據當前的路由動態顯示對應的頁面組件 -->
  <router-view />
</template>
