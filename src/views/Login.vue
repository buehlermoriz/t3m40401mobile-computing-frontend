<script setup lang="ts">
import store from "@/store";
import { ref, onMounted } from "vue";
import router from "@/router";
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/outline'
import { XMarkIcon } from '@heroicons/vue/20/solid'
import { useForm } from "vee-validate";
import schema from "../services/ValidationService";


// validation
const { errors, meta, handleSubmit, defineField } = useForm({
  validationSchema: schema.pick(["email", "password"]),
});

const [email, emailAttrs] = defineField("email");
const [password, passwordAttrs] = defineField("password");
const errorMsg = ref<string | undefined>();
const msg = ref<string | undefined>();
const skeleton = ref<boolean>(true);
const focusPassword = ref<boolean>(false);

const logIn = handleSubmit(async (values) => {
  const { email, password } = values;
  const response = await store.dispatch("logIn", { email, password });
  if (response) {
    errorMsg.value = response;
  }
  else {
    await router.push({ name: "home" });
  }
});

const loginSso = async () => {
  const response = await store.dispatch("googleLogin");
  if (response) {
    errorMsg.value = response;
  }
  else {
  await router.push({ name: "home" });
  }
};

async function passwortReset() {
  try {
    await store.dispatch("resetPassword", { email: email.value });
    msg.value = "Ein Link zum Zurücksetzen des Passworts wurde an deine E-Mail-Adresse gesendet";
  } catch (error: any) {
    if (error.code === "auth/user-not-found") {
      errorMsg.value = "Die angegebene Mailadresse ist uns nicht bekannt.";
    } else {
      errorMsg.value = "Das hat leider nicht geklappt. Bitte versuche es später erneut oder wende dich an unseren Support.";
    }
  }
}
onMounted(() => {
  setTimeout(() => {
    skeleton.value = false;
  }, 1000);
});
</script>
<template>
  <!-- login -->
  <div class="mt-10 md:mx-auto md:w-full md:max-w-[480px]">
    <div class=" bg-ms-white  px-6 py-12 shadow md:rounded-lg md:px-12">
      <!--Form -------->
      <form class="space-y-6" @submit.prevent="logIn">
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900 ">Email</label>
          <div class="mt-2">
            <input id="email" v-model="email" name="email" type="email" autocomplete="email" required
              class="block w-full  rounded-md border-gray-500  text-gray-900  placeholder:text-gray-400 focus:ring-2 focus:ring-primary  " />
          </div>
        </div>
        <p v-if="errors.email" class="mt-1 text-sm text-ms-danger" id="email-error">{{ errors.email }}</p>

        <div>
          <label for="password"
            class="block text-sm font-medium leading-6 text-gray-900 ">Passwort</label>
          <div class="mt-2">
            <input id="password" v-model="password" name="password" type="password" autocomplete="current-password"
              required @focus="focusPassword = true" @blur="focusPassword = false"
              class="block w-full  rounded-md border-gray-500  text-gray-900  placeholder:text-gray-400 focus:ring-2 focus:ring-primary  " />
          </div>
        </div>
        <p v-if="errors.password" class="mt-1 text-sm text-ms-danger" id="email-error">{{ errors.password }}</p>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <a @click="passwortReset" :disabled="!email || errors.email" :class="[
        'font-semibold',
        (!email || errors.email) ? 'text-gray-300  cursor-not-allowed' : 'cursor-pointer',
        'text-primary '
      ]">
              Passwort vergessen?
            </a>
          </div>
        </div>
        <div>
          <button type="submit" :disabled="!meta.valid"
            :class="meta.valid ? 'bg-primary' : 'bg-primary opacity-50 cursor-not-allowed'"
            class="flex w-full justify-center rounded-md px-3 p-1.5 text-sm font-semibold leading-6 text-ms-white">
            Anmelden
          </button>
        </div>
      </form>
      <button
      @click="loginSso()"
            class="mt-4 ring-2 ring-primary flex justify-center gap-x-2 items-center w-full  rounded-md px-3 font-semibold p-1.5 text-sm leading-6 text-primary "
           >
            Google SSO
          </button>
    </div>

    <p class="mt-10 text-center text-sm text-gray-500 ">
      Noch kein Account?
      <a href="/sign-up" class="font-semibold leading-6 text-primary ">Jetzt
        registrieren</a>
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
            <!-- error -->
            <transition enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 md:translate-y-0 md:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 md:translate-x-0" leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="msg"
          class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg  bg-ms-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <CheckCircleIcon class="h-6 w-6 text-green-400"  />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-gray-900 ">Erfolg!</p>
                <p class="mt-1 text-sm text-gray-500 ">{{ msg }}</p>
              </div>
              <div class="ml-4 flex flex-shrink-0">
                <button type="button" @click="msg = undefined"
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
