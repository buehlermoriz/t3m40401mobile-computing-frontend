import store from "@/store";
import { firebaseAuth } from "@/config/firebaseConfig";
import { updateProfile, updateEmail } from "firebase/auth";

const _currentUser = firebaseAuth.currentUser;

/**
 * Update user display name
 * @param newDisplayName
 * @param newEmail
 * @return Promise
 */
export async function updateUser(newDisplayName?: string, newEmail?: string): Promise<any> {
  if (_currentUser !== null) {
    try {
      if (newDisplayName) {
        await updateProfile(_currentUser, {
          displayName: newDisplayName,
        });
      }
      if (newEmail) {
        await updateEmail(_currentUser, newEmail);
      }
      await store.dispatch("fetchUser", _currentUser);
    } catch (error) {}
  } else {
  }
}
