import {createRouter, createWebHistory} from "vue-router"
import store from "@/store";
import { firebaseAuth } from "@/config/firebaseConfig";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "home",
            component: () => import("@/views/Home.vue"),
            meta: {
                title: "Home",
                requiresAuth: true
            },
        },
        {
            path: "/month",
            name: "month",
            component: () => import("@/components/MonthCallendar.vue"),
            meta: {
                title: "Monat",
                requiresAuth: true
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
            path: "/new-event",
            name: "new Event",
            component: () => import("@/views/NewEvent.vue"),
            meta: {
                title: "new Event",
                requiresAuth: true
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
        },
        {
            path: '/success',
            name: 'success',
            component: () => import('@/views/Success.vue'),
            meta: {
                title: 'Success',
                requiresAuth: true
            }
        },
        {
            path: '/categories',
            name: 'categories',
            component: () => import('@/views/CategoryView.vue'),
            meta: {
                title: 'categories',
                requiresAuth: true
            }
        }
    ]
})

router.beforeEach((to, from, next) => {
    document.title = to.meta?.title ? "Kalenderio - " + to.meta.title : "Kalenderio"
    
    //check login
    firebaseAuth.onAuthStateChanged((user) => {
        store.dispatch("fetchUser", user)
         .then(() => {
            const loggedIn = store.getters.user.loggedIn
            const requiresAuth = to.meta.requiresAuth

            if (requiresAuth && loggedIn === false) {
                next({name: "login"});
            } else {
                next();
            }

        })
    })
});

export default router
