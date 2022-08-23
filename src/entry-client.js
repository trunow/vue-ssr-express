import { createSSRApp } from "vue";

// import router from "./router/index.js";
import { createWebHistory } from "vue-router";
import createRouter from "./router.js";
const router = createRouter(createWebHistory());

import App from "./App.vue";

const app = createSSRApp(App);
app.use(router);

// это предполагает, что в шаблоне App.vue будет корневой элемент с `id="app"`
// app.mount("#app");

router.isReady().then(() => {
	app.mount("#app");
});