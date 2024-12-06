import { firebaseAuth } from "@/config/firebaseConfig";
import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  linkWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
  getAdditionalUserInfo,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { newUser, getUser } from "@/services/DbConnector";
import { createStore } from "vuex";
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
  async signUpEmail(
    context: ActionContext<RootState, RootState>,
    {
      email,
      password,
      name,
      role,
    }: { email: string; password: string; name: string; role: number }
  ): Promise<string | void> {
    try {
      const response = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      await updateProfile(response.user, {
        displayName: name,
      });
      await response.user.reload();
      const updatedUser = firebaseAuth.currentUser;
      if (updatedUser) {
        const userId = await newUser(
          updatedUser.displayName || "",
          role,
          "1970-01-01",
          updatedUser.uid,
          updatedUser.email || ""
        );
        // PROBLEM: Verwaltung von Usern und Beibehaltung der Session ------------------------------------------------
        context.commit("SET_USER", {
          email: updatedUser.email,
          displayName: updatedUser.displayName,
          emailVerified: updatedUser.emailVerified,
          photoURL:
            "https://api.dicebear.com/6.x/notionists/svg?seed=" +
            updatedUser.email!.split(".")[0],
          uid: updatedUser.uid,
          accessToken: await updatedUser.getIdToken(),
          provider: updatedUser.providerData[0].providerId,
          middlewareUserId: userId,
          middlewareUserRoleId: role,
        });
        //--------------------------------------------------------------------------------------------------------------
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
  async logIn(
    context: ActionContext<RootState, RootState>,
    { email, password }: { email: string; password: string }
  ): Promise<string | void> {
    try {
      const response = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      if (response) {
        const user = await getUser(undefined, response.user.uid);
        context.commit("SET_USER", {
          email: response.user.email,
          displayName: response.user.displayName,
          emailVerified: response.user.emailVerified,
          photoURL:
            "https://api.dicebear.com/6.x/notionists/svg?seed=" +
            response.user.email!.split(".")[0],
          uid: response.user.uid,
          accessToken: await response.user.getIdToken(),
          provider: response.user.providerData[0].providerId,
          middlewareUserId: user[0].id,
          middlewareUserRoleId: user[0].role,
        });

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
      const result = await signInWithPopup(firebaseAuth, provider);
      const additionalUserInfo = getAdditionalUserInfo(result);
      let userId = 0;
  
      if (additionalUserInfo?.isNewUser) {
        const user = result.user;
        // Call your function to create a new user in your database
        userId = await newUser(
          user.displayName || "Google User",
          1,
          "1970-01-01",
          user.uid,
          user.email || ""
        );
      } else {
        // User exists; fetch from your database
        const existingUser = await getUser(undefined, result.user.uid);
        userId = existingUser[0].id;
      }
  
      context.commit("SET_USER", {
        email: result.user.email,
        displayName: result.user.displayName,
        emailVerified: result.user.emailVerified,
        photoURL:
          "https://api.dicebear.com/6.x/notionists/svg?seed=" +
          result.user.email!.split(".")[0],
        uid: result.user.uid,
        accessToken: await result.user.getIdToken(),
        provider: result.user.providerData[0].providerId,
        middlewareUserId: userId,
        middlewareUserRoleId: 1,
      });
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
        const userMiddleware = await getUser(undefined, user.uid);
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
          middlewareUserId: userMiddleware[0].id,
          middlewareUserRoleId: userMiddleware[0].role,
        });
        context.commit("SET_LOGGED_IN", true);
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