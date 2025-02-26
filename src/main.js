import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'

import { Parse } from 'parse/dist/parse.min.js';
Parse.initialize('rWU30eqbiL51o6jsFQzZ7QyHqRlmEGk2Qi6sYonG', 'MixPvnsn97GAKb4QlxqEzXu8xhoaMS7MW6lLld7D');
Parse.serverURL = 'https://parseapi.back4app.com';

createApp(App).use(router).mount('#app')
