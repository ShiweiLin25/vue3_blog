<template>
    <!-- 外層容器，設定上下邊距、寬度及內邊距 -->
    <div class="my-8 container mx-auto">
        <!-- 使用 grid 排版，當螢幕尺寸較大時改為三欄顯示 -->
        <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 ">
            <!-- v-for 迴圈遍歷 items 陣列，並且為每個項目創建一個 div 元素 -->
            <div class="mx-auto" v-for="(item, index) in items" :key="index">
                <!-- 卡片樣式，加入陰影效果 -->
                <div class="card bg-base-100 shadow-xl h-30 w-40">
                    <div class="card-body flex flex-col justify-between">
                        <!-- 顯示處理過的文本內容，getText 用來去除 HTML 標籤並縮短文字 -->
                        <p class="flex-grow truncate">{{ getText(item.get('text')) }}</p>
                        <div class="card-actions justify-center">
                            <!-- 修改按鈕，點擊後會導向到 /post 頁面，並帶上 item.id 作為查詢參數 -->
                            <button class="btn btn-outline btn-sm">
                                <router-link :to="{ path: '/post', query: { id: item.id } }">
                                    修改
                                </router-link>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// 從 Vue 引入 ref 和 onMounted
import { ref, onMounted } from 'vue';
// 引入 Parse 庫，讓我們能從 Parse 伺服器獲取資料
import { Parse } from 'parse/dist/parse.min.js';

export default {
    // 組件名稱設定為 HomeView
    name: 'HomeView',
    setup() {
        // 宣告 items 變數，用來儲存從伺服器取得的資料
        const items = ref('');

        // 定義一個異步函式來從 Parse 資料庫中取得 Blog 資料
        async function getData() {
            try {
                // 建立對 "Blog" 資料表的查詢
                const query = new Parse.Query("Blog");
                // 執行查詢並將結果儲存在 items 變數中
                items.value = await query.find();
            }
            catch (error) {
                // 捕捉錯誤並輸出到控制台
                console.log(error);
            }
        }

        // 用來處理從資料庫中取出的 text 資料，將 HTML 標籤去除並限制字數
        function getText(text) {
            // 去除 HTML 標籤
            let temp = text.replace(/<\/?[^>]+>/ig, "");
            // 限制顯示 10 個字元，並加上省略符號
            var trimmedString = temp.substring(0, 10) + " ...";
            // 返回處理過的字串
            return trimmedString;
        }

        // 使用 onMounted 生命週期函數，當組件掛載後會自動執行 getData 來獲取資料
        onMounted(() => {
            getData();
        });

        // 返回 items 和 getText，讓模板可以使用
        return {
            items,
            getText
        }
    }
}
</script>
