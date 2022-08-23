import { createSSRApp } from "vue";

// import router from "./router/index.js";
// маршрутизатор для сервера использует другой режим history
import { createMemoryHistory } from 'vue-router'
import createRouter from './router.js'
import App from "./App.vue";

export default function () {
	const app = createSSRApp(App);
    const router = createRouter(createMemoryHistory());
    
    app.use(router);

	return {
		app,
		router,
	};
}
