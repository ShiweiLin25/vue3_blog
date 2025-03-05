<template>
    <!-- 外層容器，設定上下邊距、寬度及內邊距 -->
    <div class="my-8 container mx-auto">
        <!-- 使用 grid 排版，當螢幕尺寸較大時改為三欄顯示 -->
        <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 ">
            <!-- v-for 迴圈遍歷 items 陣列，並且為每個項目創建一個 div 元素 -->
            <div class="mx-auto" v-for="(item, index) in items" :key="index">
                <!-- 卡片樣式，加入陰影效果 -->
                <div class="card bg-base-100 shadow-xl h-30 w-40  cursor-pointer hover:scale-105 transition-transform duration-200"
                    @click="openPreview(item)">
                    <div class="card-body px-5 flex flex-col justify-between">
                        <!-- 顯示時間 -->
                        <p class="text-sm text-gray-400">{{ formatDate(item.updatedAt || item.createdAt) }}</p>
                        <!-- 顯示處理過的文本內容，getText 用來去除 HTML 標籤並縮短文字 -->
                        <p class="flex-grow truncate">{{ getText(item.text) }}</p>
                        <div class="card-actions justify-center">
                            <!-- 修改按鈕 -->
                            <button class="btn btn-success btn-outline btn-sm" @click.stop="goToEditPage(item.id)">
                                修改
                            </button>
                            <!-- 刪除按鈕 -->
                            <button class="btn btn-error btn-outline btn-sm" @click.stop="deletePost(item.id)">刪除
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 預覽視窗 -->
        <div v-if="previewVisible" class="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
            <div class="bg-white p-5 w-3/4 md:w-1/2 rounded-lg">
                <h2 class="text-xl font-bold">文章預覽</h2>
                <div v-html="previewContent" class="max-h-96 overflow-y-auto"></div>
                <div class="mt-4 flex justify-end">
                    <button @click="closePreview" class="btn btn-sm btn-outline">關閉</button>
                </div>
            </div>
        </div>
        <!-- 返回頂部按鈕 -->
        <button v-show="showBackToTop" @click="scrollToTop"
            class="fixed bottom-4 right-4 bg-gray-400 text-white px-2 py-2 rounded-full hover:bg-gray-500 transition">
            ↑
        </button>
    </div>
</template>

<script>
// 從 Vue 引入 ref 和 onMounted
import { ref, onMounted } from 'vue';
// 引入 Parse 庫，讓我們能從 Parse 伺服器獲取資料
import { Parse } from 'parse/dist/parse.min.js';
// 引入 useRouter
import { useRouter } from 'vue-router';
import dayjs from "dayjs";
export default {
    // 組件名稱設定為 HomeView
    name: 'HomeView',
    setup() {
        // 使用 router
        const router = useRouter();
        // 宣告 items 變數，用來儲存從伺服器取得的資料
        const items = ref([]);
        // 控制模態視窗顯示
        const previewVisible = ref(false);
        // 存儲預覽內容
        const previewContent = ref('');
        // 控制是否顯示返回頂部按鈕
        const showBackToTop = ref(false);

        // 定義一個異步函式來從 Parse 資料庫中取得 Blog 資料
        async function getData() {
            try {
                // 建立對 "Blog" 資料表的查詢
                const query = new Parse.Query("Blog");
                // 按照時間排序（最新的在前）
                query.descending("createdAt");
                const results = await query.find();
                // 轉換成物件，包含 text 和 createdAt
                items.value = results.map(item => ({
                    id: item.id,
                    text: item.get("text"),
                    // 顯示創建時間
                    createdAt: item.createdAt,
                    // 顯示更新時間
                    updatedAt: item.updatedAt,
                }));
            }
            catch (error) {
                // 捕捉錯誤並輸出到控制台
                console.log(error);
            }
        }

        // 轉換成本地時間格式
        function formatDate(date) {
            return dayjs(date).format("YYYY/MM/DD HH:mm");
        }

        // 用來處理從資料庫中取出的 text 資料，將 HTML 標籤去除並限制字數
        function getText(text) {
            // 去除 HTML 標籤
            let temp = text.replace(/<\/?[^>]+>/ig, "");
            // 如果長度大於 10 才加省略符號
            var trimmedString = temp.length > 10 ? temp.substring(0, 10) + " ..." : temp;
            return trimmedString;
        }

        // 刪除文章
        async function deletePost(id) {
            // 確認是否刪除
            if (!confirm("確定要刪除這篇文章嗎？")) return;

            try {
                const query = new Parse.Query("Blog");
                const blog = await query.get(id);
                await blog.destroy();
                alert("刪除成功！");

                // 重新取得文章列表，確保畫面更新
                await getData();
            } catch (error) {
                console.error("刪除失敗:", error);
                alert("刪除失敗：" + error.message);
            }
        }

        // 點擊卡片時，打開預覽視窗
        function openPreview(item) {
            // 設定預覽內容
            previewContent.value = item.text;
            // 顯示預覽視窗
            previewVisible.value = true;
        }

        // 關閉預覽視窗
        function closePreview() {
            // 隱藏預覽視窗
            previewVisible.value = false;
        }

        // 滾動到頂部
        function scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // 滾動事件監聽，當滾動超過一定距離時顯示返回頂部按鈕
        function handleScroll() {
            showBackToTop.value = window.scrollY > 50; // 滾動超過 50px 顯示按鈕
        }
        // 導向編輯頁面
        function goToEditPage(id) {
            router.push({ path: '/post', query: { id: id } }); // 使用 router 進行頁面跳轉
        }
        // 使用 onMounted 生命週期函數，當組件掛載後會自動執行 getData 來獲取資料
        onMounted(() => {
            getData();
            // 監聽滾動事件
            window.addEventListener('scroll', handleScroll);
        });

        // 返回 items 和 getText，讓模板可以使用
        return {
            items,
            previewVisible,
            previewContent,
            showBackToTop,
            formatDate,
            getText,
            deletePost,
            openPreview,
            closePreview,
            scrollToTop,
            goToEditPage
        }
    }
}
</script>
