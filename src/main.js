import { createApp } from 'vue';
import './style.scss';
import App from './App.vue';
import { firebaseApp } from './services/firebase';
import { VueFire, VueFireAuth } from 'vuefire';
import { vuetify } from './plugins/vuetify';
import store from './store';
import { router } from './router';

createApp(App)
    .use(vuetify)
    .use(store)
    .use(router)
    .use(VueFire, {
        firebaseApp,
        modules: [
            VueFireAuth(),
        ]
    })
    .mount('#app')
