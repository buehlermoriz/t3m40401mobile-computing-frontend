import { firebaseAuth, firebaseFirestore } from "@/config/firebaseConfig";
import { sendPasswordResetEmail, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, linkWithPopup } from "firebase/auth";
import { collection, getDocs, query, where, limit, updateDoc, arrayUnion, doc } from "firebase/firestore";
import { createStore } from "vuex";
import { errorTranslateMap } from "@/config/ErrorMap";

interface UserState {
  loggedIn: boolean;
  data: any | null;
}

interface RootState {
  user: UserState;
}

const store = createStore<RootState>({
  state: {
    user: {
      loggedIn: false,
      data: null,
    },
  },

  getters: {
    user(state) {
      return state.user;
    }
  },

  mutations: {
    SET_USER(state, payload) {
      state.user.data = payload;
    },
    SET_LOGGED_IN(state, value) {
      state.user.loggedIn = value;
    }
  },

  actions: {
    async logIn(context, { email, password }) {
      try {
        const response = await signInWithEmailAndPassword(firebaseAuth, email, password);
        if (response) {
          context.commit("SET_USER", response.user);
          context.commit("SET_LOGGED_IN", true);
        } else {
          throw new Error("login failed");
        }
      } catch (error: any) {
        let msg = errorTranslateMap.get(error.code) || "Es ist ein unbekannter Fehler aufgetreten. Bitte versuche es später erneut.";
        return msg;
      }
    },
    async googleLogin(context) {
      const provider = new GoogleAuthProvider();
      try {
        await signInWithPopup(firebaseAuth, provider);
        context.commit("SET_USER", firebaseAuth.currentUser);
        context.commit("SET_LOGGED_IN", true);
      } catch (error: any) {
        let msg = errorTranslateMap.get(error.code) || "Es ist ein unbekannter Fehler aufgetreten. Bitte versuche es später erneut: " + error.code;
        return msg;
      }
    },
    async linkAccount(context, user) {
      const provider = new GoogleAuthProvider();
      try {
        await linkWithPopup(user, provider);
        context.commit("SET_USER", firebaseAuth.currentUser);
      } catch (error: any) {
        let msg = errorTranslateMap.get(error.code) || "Es ist ein unbekannter Fehler aufgetreten. Bitte versuche es später erneut.";
        return msg;
      }
    },
    async logout(context) {
      await firebaseAuth.signOut();
      context.commit("SET_LOGGED_IN", false);
      context.commit("SET_USER", null);
    },
    async resetPassword(context, { email }) {
      await sendPasswordResetEmail(firebaseAuth, email);
    },
    async fetchUser(context, user) {
      context.commit("SET_LOGGED_IN", user !== null);
      if (user) {
        const accounts = query(collection(firebaseFirestore, "accounts"), where("users", "array-contains", user.uid));
        context.commit("SET_USER", {
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified,
          photoURL: "https://api.dicebear.com/6.x/notionists/svg?seed=" + user.email.split(".")[0],
          uid: user.uid,
          accessToken: user.accessToken,
          provider: user.providerData[0].providerId
        });
      } else {
        context.commit("SET_USER", null);
      }
    }
  },
});

export default store;