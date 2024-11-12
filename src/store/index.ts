import { firebaseAuth, firebaseFirestore } from "@/config/firebaseConfig";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  linkWithPopup,
} from "firebase/auth";
import type { User } from "firebase/auth";
import {
  collection,
  query,
  where,
} from "firebase/firestore";
import {
  createStore,
} from "vuex";
import type {
  ActionContext,
  ActionTree,
  GetterTree,
  MutationTree,
  StoreOptions,
} from "vuex";
import { errorTranslateMap } from "@/config/ErrorMap";

interface UserState {
  loggedIn: boolean;
  data: any | null;
}

interface RootState {
  user: UserState;
}

const state: RootState = {
  user: {
    loggedIn: false,
    data: null,
  },
};

const getters: GetterTree<RootState, RootState> = {
  user(state: RootState): UserState {
    return state.user;
  },
};

const mutations: MutationTree<RootState> = {
  SET_USER(state: RootState, payload: any): void {
    state.user.data = payload;
  },
  SET_LOGGED_IN(state: RootState, value: boolean): void {
    state.user.loggedIn = value;
  },
};

const actions: ActionTree<RootState, RootState> = {
  async logIn(
    context: ActionContext<RootState, RootState>,
    { email, password }: { email: string; password: string }
  ): Promise<string | void> {
    try {
      const response = await signInWithEmailAndPassword(firebaseAuth, email, password);
      if (response) {
        context.commit("SET_USER", response.user);
        context.commit("SET_LOGGED_IN", true);
      } else {
        throw new Error("login failed");
      }
    } catch (error: any) {
      let msg =
        errorTranslateMap.get(error.code) ||
        "Es ist ein unbekannter Fehler aufgetreten. Bitte versuche es später erneut.";
      return msg;
    }
  },
  async googleLogin(
    context: ActionContext<RootState, RootState>
  ): Promise<string | void> {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(firebaseAuth, provider);
      context.commit("SET_USER", firebaseAuth.currentUser);
      context.commit("SET_LOGGED_IN", true);
    } catch (error: any) {
      let msg =
        errorTranslateMap.get(error.code) ||
        "Es ist ein unbekannter Fehler aufgetreten. Bitte versuche es später erneut: " +
          error.code;
      return msg;
    }
  },
  async linkAccount(
    context: ActionContext<RootState, RootState>,
    user: User
  ): Promise<string | void> {
    const provider = new GoogleAuthProvider();
    try {
      await linkWithPopup(user, provider);
      context.commit("SET_USER", firebaseAuth.currentUser);
    } catch (error: any) {
      let msg =
        errorTranslateMap.get(error.code) ||
        "Es ist ein unbekannter Fehler aufgetreten. Bitte versuche es später erneut.";
      return msg;
    }
  },
  async logout(context: ActionContext<RootState, RootState>): Promise<void> {
    await firebaseAuth.signOut();
    context.commit("SET_LOGGED_IN", false);
    context.commit("SET_USER", null);
  },
  async resetPassword(
    context: ActionContext<RootState, RootState>,
    { email }: { email: string }
  ): Promise<void> {
    await sendPasswordResetEmail(firebaseAuth, email);
  },
  async fetchUser(
    context: ActionContext<RootState, RootState>,
    user: User | null
  ): Promise<void> {
    context.commit("SET_LOGGED_IN", user !== null);
    if (user) {
      const accounts = query(
        collection(firebaseFirestore, "accounts"),
        where("users", "array-contains", user.uid)
      );
      context.commit("SET_USER", {
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
        photoURL:
          "https://api.dicebear.com/6.x/notionists/svg?seed=" +
          user.email!.split(".")[0],
        uid: user.uid,
        accessToken: await user.getIdToken(),
        provider: user.providerData[0].providerId,
      });
    } else {
      context.commit("SET_USER", null);
    }
  },
};

const storeOptions: StoreOptions<RootState> = {
  state,
  getters,
  mutations,
  actions,
};

const store = createStore<RootState>(storeOptions);

export default store;