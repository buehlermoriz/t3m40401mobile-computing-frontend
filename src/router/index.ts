import {createRouter, createWebHistory} from "vue-router"
import HomeView from "@/views/Home.vue"
import store from "@/store";
import { firebaseAuth } from "@/config/firebaseConfig";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView,
            meta: {
                title: "Home",
                // requiresAuth: true
            },
        },
        {
            path: "/login",
            name: "login",
            component: () => import("@/views/Login.vue"),
            meta: {
                title: "Login",
                requiresAuth: false
            },
        },
        {
            path: "/sign-up",
            name: "sign-up",
            component: () => import("@/views/SignUp.vue"),
            meta: {
                title: "Registrieren",
                requiresAuth: false
            },
        },
        {
            path: "/logout",
            name: "logout",
            component: () => import("@/views/Login.vue"),
            meta: {
                title: "logout",
                requiresAuth: false
            },
            beforeEnter: () => {
                store.dispatch("logout")
                    .then(() => {
                        router.push("/")
                    })
            }
        },
        {
            path: '/user',
            name: 'userAccount',
            component: () => import('@/views/UserAccount.vue'),
            meta: {
                title: 'Benutzer Konto',
                requiresAuth: true
            }
        }
    ]
})

router.beforeEach((to, from, next) => {
    document.title = to.meta?.title ? "Media Sales - " + to.meta.title : "Media Sales"
    
    //update region
    const regionParam = to.query.region;

    if (regionParam && typeof regionParam === 'string' && ['nk', 'sz'].includes(regionParam)) {
        const currentRegion = store.getters.user.region;
        if (currentRegion !== regionParam) {
            store.dispatch("setRegion", regionParam);
            location.reload()
        }
    }
    
    //check login
    firebaseAuth.onAuthStateChanged((user) => {
        store.dispatch("fetchUser", user)
         .then(() => {
            const loggedIn = store.getters.user.loggedIn
            const requiresAuth = to.meta.requiresAuth

            // if (requiresAuth && loggedIn === false) {
            //     next({name: "login"});
            // } else {
            //     next();
            // }
                 next();

        })
    })
});

export default router
