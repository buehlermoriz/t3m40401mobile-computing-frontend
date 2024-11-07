<script setup lang="ts">
import { ref } from "vue";
import { errorTranslateMap } from "@/config/ErrorMap";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { firebaseAuth, firebaseFirestore } from "@/config/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import router from "@/router";
import { useForm } from "vee-validate";
import schema from "../services/ValidationService";
import { XCircleIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import DynamicLogo from "@/components/DynamicLogo.vue";

// validation
const { errors, meta, handleSubmit, defineField } = useForm({
  validationSchema: schema.pick(["email", "password", "passwordConfirm"]),
});

const isPasswordDisplayed = ref(false)
const [email, emailAttrs] = defineField("email");
const [password, passwordAttrs] = defineField("password");
const [passwordConfirm, passwordConfirmAttrs] = defineField("passwordConfirm");
const errorMsg = ref<string | undefined>();
const focusPassword = ref<boolean>(false);

async function signUp() {

  try {
    const domain = email.value.split("@")[1]
    const accounts = query(collection(firebaseFirestore, "accounts"), where("domains", "array-contains", domain), limit(1));
    const querySnapshot = await getDocs(accounts);

    if (querySnapshot.empty) {
      errorMsg.value = errorTranslateMap.get("Domain isn't available") ?? "Domain ist nicht verfügbar"
      return
    }

    await createUserWithEmailAndPassword(firebaseAuth, email.value, password.value)
    let user = firebaseAuth.currentUser
    if (user == null) {
      errorMsg.value = errorTranslateMap.get("User is null") ?? "Benutzer ist nicht verfügbar"
      return
    }
    router.push({ name: "home" })
  } catch (error: any) {
    let msg: string | undefined
    msg = errorTranslateMap.get(error.code)
    if (msg == undefined) {
      msg = "Es ist ein unbekannter Fehler aufgetreten. Bitte versuche es später erneut."
    }
    errorMsg.value = msg
  }
}

</script>
<template>
  <div class="md:mx-auto md:w-full md:max-w-md">
    <DynamicLogo />
    <h2 class="mt-6 text-center text-2xl font-bold leading-9  text-gray-900 ">Bei Media Sales registrieren
    </h2>
  </div>

  <div class="mt-10 md:mx-auto md:w-full md:max-w-[480px]">
    <div class=" bg-ms-white  px-6 py-12 shadow md:rounded-lg md:px-12">
      <!--Form -------->
      <form class="space-y-6" @submit.prevent="signUp">
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900 ">Email</label>
          <div class="mt-2">
            <input id="email" v-model="email" name="email" type="email" autocomplete="email" required
              class="block w-full  rounded-md border-gray-500  text-gray-900  placeholder:text-gray-400 focus:ring-2 focus:ring-color-sz dark:ring-color-nk " />
          </div>
        </div>
        <p v-if="errors.email" class="mt-1 text-sm text-ms-danger" id="email-error">{{ errors.email }}</p>

        <div>
          <label for="password"
            class="block text-sm font-medium leading-6 text-gray-900 ">Passwort</label>
          <div class="mt-2">
            <input id="password" v-model="password" name="password" type="password" autocomplete="current-password"
              required @focus="focusPassword = true" @blur="focusPassword = false"
              class="block w-full  rounded-md border-gray-500  text-gray-900  placeholder:text-gray-400 focus:ring-2 focus:ring-color-sz dark:ring-color-nk " />
          </div>
        </div>
        <p v-if="errors.password" class="mt-1 text-sm text-ms-danger" id="email-error">{{ errors.password }}</p>

        <div>
          <label for="passwordConfirm"
            class="block text-sm font-medium leading-6 text-gray-900 ">Passwort bestätigen</label>
          <div class="mt-2">
            <input id="passwordConfirm" v-model="passwordConfirm" name="passwordConfirm" type="password"
              autocomplete="current-password" required @focus="focusPassword = true" @blur="focusPassword = false"
              class="block w-full  rounded-md border-gray-500  text-gray-900  placeholder:text-gray-400 focus:ring-2 focus:ring-color-sz dark:ring-color-nk " />
          </div>
        </div>
        <p v-if="errors.passwordConfirm" class="mt-1 text-sm text-ms-danger" id="email-error">{{ errors.passwordConfirm }}</p>

        <div>
          <button type="submit" :disabled="!meta.valid"
            :class="meta.valid ? 'bg-color-sz dark:bg-color-nk' : 'bg-color-sz dark:bg-color-nk opacity-50 cursor-not-allowed'"
            class="flex w-full justify-center rounded-md px-3 p-1.5 text-sm font-semibold leading-6 text-ms-white">
            Registrieren
          </button>
        </div>
      </form>
    </div>

    <p class="mt-10 text-center text-sm text-gray-500 ">
      Sie haben bereits ein Account?
      <a href="/login" class="font-semibold leading-6 text-color-sz dark:text-color-nk">Jetzt
        anmelden</a>
    </p>
  </div>
  <div class="absolute inset-x-0 -bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl" >
  </div>
  <!-- Global notification live region, render this permanently at the end of the document -->
  <div aria-live="assertive" class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 md:items-start md:p-6">
    <div class="flex w-full flex-col items-center space-y-4 md:items-end">
      <!-- Notification panel, dynamically insert this into the live region when it needs to be displayed -->
      <!-- error -->
      <transition enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 md:translate-y-0 md:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 md:translate-x-0" leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="errorMsg"
          class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg  bg-ms-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <XCircleIcon class="h-6 w-6 text-ms-danger"  />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-gray-900 ">Fehler!</p>
                <p class="mt-1 text-sm text-gray-500 ">{{ errorMsg }}</p>
              </div>
              <div class="ml-4 flex flex-shrink-0">
                <button type="button" @click="errorMsg = undefined"
                  class="inline-flex rounded-md  bg-ms-white text-gray-400  hover:text-gray-500 focus:outline-none">
                  <XMarkIcon class="h-5 w-5"  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>