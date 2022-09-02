import { createApp } from 'vue';
import '@/assets/styles/index.scss';
import App from './App.vue';
import LottieAnimation from 'lottie-web-vue';

createApp(App).use(LottieAnimation).mount('#app');
