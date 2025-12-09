import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./router/script";

const app = createApp(App);

const pinia = createPinia();
app.use(pinia);   // сначала Pinia
app.use(router);  // потом router

app.mount("#app");
