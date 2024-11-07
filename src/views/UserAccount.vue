<script setup lang="ts">
import store from "@/store";
import { ref, watch } from "vue";
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'
import { XMarkIcon } from '@heroicons/vue/20/solid'

import { useForm } from "vee-validate";
import schema from "../services/ValidationService";

import { firebaseAuth } from "@/config/firebaseConfig";
import { updateProfile, updateEmail } from "firebase/auth";
import router from "@/router";


// validation
const { errors, meta, handleSubmit, defineField } = useForm({
  validationSchema: schema.pick(["emailUpdate", "nameUpdate"]),
});

const [email, emailAttrs] = defineField("email");
email.value = store.getters.user.data.email;
const [name, nameAttrs] = defineField("name");
name.value = store.getters.user.data.displayName;
const errorMsg = ref<string | undefined>();
const msg = ref<string | undefined>();
const provider = ref<string | undefined>(store.getters.user.data.provider);


const updateUser = handleSubmit(async (values) => {
  const currentUser = firebaseAuth.currentUser;

  const { email, name } = values;
  if (!currentUser) {
    errorMsg.value = "Benutzer nicht gefunden";
    return;
  }
  try {
    if (name) {
      await updateProfile(currentUser, {
        displayName: name,
      });
    }
    if (email) {
      await updateEmail(currentUser, email);
    }
    await store.dispatch("fetchUser", currentUser);
    msg.value = "Nutzer erfolgreich aktualisiert";
  } catch (error) {
    errorMsg.value = "Das hat leider nicht geklappt.";
  }
}
);

async function passwortReset() {
  try {
    await store.dispatch("resetPassword", { email: store.getters.user.data.email });
    msg.value = "Ein Link zum Zurücksetzen des Passworts wurde an deine E-Mail-Adresse gesendet";
  } catch (error: any) {
    if (error.code === "auth/user-not-found") {
      errorMsg.value = "Die angegebene Mailadresse ist uns nicht bekannt.";
    } else {
      errorMsg.value = "Das hat leider nicht geklappt. Bitte versuche es später erneut oder wende dich an unseren Support.";
    }
  }
}
async function linkToSso() {
  try {
    const currentUser = firebaseAuth.currentUser;
    await store.dispatch("linkAccount", currentUser);
    //refresh page
    router.go(0)
  } catch (error: any) {
    errorMsg.value = "Das hat leider nicht geklappt.";
  }

}
</script>
<template>
  <!-- login -->
  <div class="md:mx-auto md:w-full md:max-w-md">
    <h2 class="mt-6 text-center text-2xl font-bold leading-9  text-gray-900 ">Nutzer anpassen
    </h2>
  </div>

  <!-- Disclaimer -->
  <div v-if="provider == 'microsoft.com'" class="mb-5">
    <div class="mt-10 md:mx-auto md:w-full md:max-w-[800px]">
      <div
        class="mx-auto  max-w-none  bg-gray-700/5 px-6 py-16 ring-1  ring-gray-500/10 rounded-3xl sm:p-8 lg:mx-0 lg:py-16 xl:px-20">
        <h2 class="text-lg font-bold tracking-tight  sm:text-2xl">SSO Login erkannt!</h2>
        <p class="mt-6 leading-8 ">Vielen Dank für Ihre Nutzung von Media Sales. Unser System hat erkannt,
          dass Sie sich über ein Single Sign-On (SSO) angemeldet haben. Wenn Sie Ihre Emailadresse, ihren Benutzernamen
          oder ihr Passwort ändern möchten können Sie dies direkt bei <a
            class="text-primary dark:text-color-nk"
            href="https://myaccount.microsoft.com/">Microsoft</a> anpassen!</p>
      </div>
    </div>
  </div>
  <!-- link SSO -->
  <div v-else class="mb-5">
    <div class="mt-10 md:mx-auto md:w-full md:max-w-[800px]">
      <div
        class="mx-auto  max-w-none  bg-gray-700/5 px-6 py-16 ring-1  ring-gray-500/10 rounded-3xl sm:p-8 lg:mx-0 lg:py-16 xl:px-20">
        <h2 class="text-lg font-bold tracking-tight  sm:text-2xl">SSO einrichten!</h2>
        <p class="mt-6 leading-8 ">Ihr Account besitzt noch keine Verbindung zu unserem SSO System.
          Klicken Sie auf jetzt verbinden und nutzen Sie zukünftig direkt den SV Gruppe SSO Login ganz ohne Eingabe von
          Emailadresse und Passwort!</p>
        <button @click="linkToSso"
          class="flex w-full justify-center rounded-md px-3 p-1.5 text-sm font-semibold leading-6 text-ms-white bg-primary dark:bg-color-nk mt-3">
          SSO jetzt verbinden
        </button>
      </div>
    </div>
  </div>
  <!-- Account Settings -->
  <div class="mt-10 md:mx-auto md:w-full md:max-w-[800px]">
    <div
      class="flex gap-x-8  bg-ms-white  px-6 py-12 shadow md:rounded-lg md:px-12">
      <!--Form -------->
      <div class="flex-1">
        <p class="mb-2 font-semibold text-xl text-gray-900 ">Nutzerdaten</p>
        <p class="mb-2 text-gray-900 ">Passen Sie ihre Emailadresse sowie Ihren Benutzernamen an.</p>
        <form class="space-y-6" @submit.prevent="updateUser">
          <div>
            <label for="email" class="block text-sm font-medium leading-6 text-gray-900 ">Email</label>
            <div class="mt-2">
              <input :disabled="provider == 'microsoft.com'" id="email" v-model="email" name="email" type="email"
                autocomplete="email"
                class="block w-full  rounded-md border-0 text-gray-900  placeholder:text-gray-400 focus:ring-2 focus:ring-primary dark:ring-color-nk "
                :class="provider == 'microsoft.com' ? 'opacity-30' : ''" />
            </div>
          </div>
          <p v-if="errors.emailUpdate" class="mt-1 text-sm text-ms-danger" id="email-error">{{ errors.emailUpdate
            }}</p>
          <div>
            <label for="name"
              class="block text-sm font-medium leading-6 text-gray-900 ">Benutzername</label>
            <div class="mt-2">
              <input id="name" :disabled="provider == 'microsoft.com'" v-model="name" name="name" autocomplete="name"
                class="block w-full  rounded-md border-0 text-gray-900  placeholder:text-gray-400 focus:ring-2 focus:ring-primary dark:ring-color-nk "
                :class="provider == 'microsoft.com' ? 'opacity-30' : ''" />
            </div>
          </div>
          <p v-if="errors.nameUpdate" class="mt-1 text-sm text-ms-danger" id="email-error">{{ errors.nameUpdate }}
          </p>

          <div>
            <button type="submit" :disabled="!meta.valid || provider == 'microsoft.com'"
              :class="(!meta.valid || provider == 'microsoft.com') ? 'opacity-30' : ''"
              class="flex w-full justify-center rounded-md px-3 p-1.5 text-sm font-semibold leading-6 text-ms-white bg-primary dark:bg-color-nk">
              Nutzer anpassen
            </button>
          </div>
        </form>
      </div>
      <div class="relative">
        <div class="absolute inset-0 flex items-center" aria-hidden="true">
          <div class="h-full border-s border-gray-300" />
        </div>
      </div>
      <div class="flex-1 flex flex-col">
        <!-- reset pw -->
        <p class=" font-semibold text-xl text-gray-900 ">Passwort</p>
        <p class="text-sm text-gray-900 ">Erhalten Sie eine Email zum Zurücksetzen Ihres Passwortes.
        </p>
        <button @click="passwortReset" :disabled="provider == 'microsoft.com'"
          class="flex w-full justify-center rounded-md px-3 p-1.5 text-sm leading-6 border-2 border-primary dark:border-color-nk text-primary dark:text-color-nk  "
          :class="provider == 'microsoft.com' ? 'opacity-30' : ''">
          Passwort zurücksetzen </button>
        <!-- logout -->
        <p class="mt-auto font-semibold text-xl text-gray-900 ">logout</p>
        <p class="text-sm text-gray-900 ">Melden Sie sich von Media Sales ab.</p>
        <a href="/logout"
          class="flex w-full justify-center rounded-md px-3 p-1.5 text-sm leading-6 border-2 border-primary dark:border-color-nk text-primary dark:text-color-nk  ">
          Abmelden </a>
      </div>

    </div>

  </div>
  <!-- Global notification live region, render this permanently at the end of the document -->
  <div aria-live="assertive" class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 md:items-start md:p-6">
    <div class="flex w-full flex-col items-center space-y-4 md:items-end">
      <!-- Notification panel, dynamically insert this into the live region when it needs to be displayed -->
      <!-- success -->
      <transition enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 md:translate-y-0 md:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 md:translate-x-0" leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="msg"
          class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg  bg-ms-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <CheckCircleIcon class="h-6 w-6 text-green-400" />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-gray-900 ">Erfolg!</p>
                <p class="mt-1 text-sm text-gray-500 ">{{ msg }}</p>
              </div>
              <div class="ml-4 flex flex-shrink-0">
                <button type="button" @click="msg = undefined"
                  class="inline-flex rounded-md  bg-ms-white text-gray-400  hover:text-gray-500 focus:outline-none">
                  <XMarkIcon class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
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
                <XCircleIcon class="h-6 w-6 text-ms-danger" />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-gray-900 ">Fehler!</p>
                <p class="mt-1 text-sm text-gray-500 ">{{ errorMsg }}</p>
              </div>
              <div class="ml-4 flex flex-shrink-0">
                <button type="button" @click="errorMsg = undefined"
                  class="inline-flex rounded-md  bg-ms-white text-gray-400  hover:text-gray-500 focus:outline-none">
                  <XMarkIcon class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
