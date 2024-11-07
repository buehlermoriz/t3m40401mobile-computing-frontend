import { firebaseAuth, firebaseFirestore } from "@/config/firebaseConfig";
import { sendPasswordResetEmail, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, linkWithPopup } from "firebase/auth";
import { collection, getDocs, query, where, limit, updateDoc, arrayUnion, doc } from "firebase/firestore";
import { createStore } from "vuex";
import { errorTranslateMap } from "@/config/ErrorMap";

interface UserState {
  loggedIn: boolean;
  data: any | null;
  region: string;
}

interface RootState {
  user: UserState;
}

const store = createStore<RootState>({
  state: {
    user: {
      loggedIn: false,
      data: null,
      region: localStorage.getItem('region') || 'sz',
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
    },
    SET_REGION(state, value) {
      state.user.region = value;
      localStorage.setItem('region', value);
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
        let querySnapshot = await getDocs(accounts);
        querySnapshot = await checkDomain(user, querySnapshot);
        context.commit("SET_USER", {
          email: user.email,
          displayName: user.displayName,
          emailVerified: user.emailVerified,
          photoURL: "https://api.dicebear.com/6.x/notionists/svg?seed=" + user.email.split(".")[0],
          tenant: querySnapshot.docs[0].data().account_name,
          uid: user.uid,
          accessToken: user.accessToken,
          provider: user.providerData[0].providerId
        });
      } else {
        context.commit("SET_USER", null);
      }
    },
    async setRegion(context, region) {
      context.commit("SET_REGION", region);
    }
  },
});

const checkDomain = async (user: any, querySnapshot: any) => {
  if (querySnapshot.empty) {
    const userDomain = user.email.split("@")[1];
    const availableDomains = query(collection(firebaseFirestore, "accounts"), where("domains", "array-contains", userDomain), limit(1));
    const domains = await getDocs(availableDomains);
    if (domains.empty) {
      return querySnapshot;
    }
    const item = domains.docs[0];
    await updateDoc(doc(firebaseFirestore, "accounts", item.id), {
      users: arrayUnion(user.uid)
    });
    const accounts = query(collection(firebaseFirestore, "accounts"), where("users", "array-contains", user.uid));
    querySnapshot = await getDocs(accounts);
    return querySnapshot;
  } else {
    return querySnapshot;
  }
};

export default store;