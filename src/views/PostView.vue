<template>
    <div class="my-8 container mx-auto px-40">
        <!-- QuillEditor 富文本編輯器，綁定 text 變數作為內容，格式為 HTML -->
        <QuillEditor theme="snow" class="w-full" v-model:content="text" contentType="html" />

        <!-- 右對齊按鈕區塊 -->
        <div class="flex justify-end">
            <!-- 儲存按鈕，當 text 為空時禁用 -->
            <button class="btn btn-wide" @click="save" :disabled="text === ''">儲存</button>
        </div>
    </div>
</template>

<script>
import { ref, watch, onMounted, getCurrentInstance } from 'vue';
import { useRouter } from 'vue-router';
import { QuillEditor } from '@vueup/vue-quill';
import { Parse } from 'parse/dist/parse.min.js';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

export default {
    name: 'PostView',
    components: {
        QuillEditor, // 引入 QuillEditor 組件
    },
    setup() {
        // 用來儲存當前文章的 ID（若為編輯模式則有值）
        const id = ref('');
        // 用來綁定編輯器的內容
        const text = ref('');
        // Vue Router 物件
        const router = useRouter();

        // 監聽 text 變數，若內容清空則將 text 設為空字串，防止殘留 HTML 標籤
        watch(text, (newValue) => {
            // 移除 HTML 標籤
            let temp = newValue.replace(/<\/?[^>]+>/ig, "");
            if (temp == '') {
                text.value = '';
            }
        });

        // 儲存文章到 Parse 資料庫
        async function save() {
            // 若 ID 為空，表示是新增文章
            if (!id.value) {
                // 創建新的 Blog 物件
                const toDoList = new Parse.Object("Blog");
                // 設定內容
                toDoList.set("text", text.value);
                try {
                    // 儲存到資料庫
                    let result = await toDoList.save();
                    // 顯示成功訊息
                    alert('上傳成功 ' + result.id);
                    // 儲存成功後跳轉回首頁
                    router.push("/");
                } catch (error) {
                    // 顯示錯誤訊息
                    alert('上傳失敗 ' + error.message);
                }
            } else { // 若 ID 存在，則進行更新
                try {
                    const query = new Parse.Query("Blog");
                    // 查詢指定 ID 的文章
                    query.equalTo("objectId", id.value);
                    // 取得第一筆匹配的資料
                    const blog = await query.first();
                    // 更新內容
                    blog.set('text', text.value);
                    // 儲存變更
                    await blog.save();
                    // 更新成功後跳轉回首頁
                    router.push("/");
                } catch (error) {
                    // 顯示錯誤訊息
                    alert('更新失敗 ' + error.message);
                }
            }
        }

        // 讀取文章內容
        async function get() {
            const query = new Parse.Query("Blog");
            // 查詢指定 ID 的文章
            query.equalTo("objectId", id.value);
            // 取得第一筆匹配的資料
            const blog = await query.first();
            // 設定 text 變數
            text.value = blog.get("text");
        }

        // 當元件掛載時執行
        onMounted(() => {
            // 取得當前 Vue 實例
            const instance = getCurrentInstance();
            // 取得 URL 參數中的 id
            id.value = instance.proxy.$route.query.id;
            // 若有 id，則執行 get() 取得文章內容
            if (id.value) {
                get();
            }
        });

        return {
            text, // 綁定 text 變數到模板
            save, // 綁定 save 方法到模板
        };
    }
};
</script>