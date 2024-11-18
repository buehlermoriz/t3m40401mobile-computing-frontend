<script setup lang="ts">
import { ref } from "vue";
import { errorTranslateMap } from "@/config/ErrorMap";
import router from "@/router";
import { useForm } from "vee-validate";
import schema from "../services/ValidationService";
import { XCircleIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import store from "@/store";

// validation
const { errors, meta, handleSubmit, defineField } = useForm({
  validationSchema: schema.pick(["email", "password", "passwordConfirm", "name"]),
});

const [email, emailAttrs] = defineField("email");
const [password, passwordAttrs] = defineField("password");
const [name, nameAttrs] = defineField("name");
const [passwordConfirm, passwordConfirmAttrs] = defineField("passwordConfirm");
const errorMsg = ref<string | undefined>();
const focusPassword = ref<boolean>(false);

async function signUp() {
  try {
    const response = await store.dispatch("signUpEmail", { email: email.value, password: password.value, name: name.value, role: selectedAccountType.value });
      if (response) {
    errorMsg.value = response;
  }
    router.push({ name: "home" });
  } catch (error: any) {
    let msg: string | undefined;
    msg = errorTranslateMap.get(error.code);
    if (msg == undefined) {
      msg =
        "Es ist ein unbekannter Fehler aufgetreten. Bitte versuche es später erneut.";
    }
    errorMsg.value = msg;
  }
}
const accountTypes = [
  { id: 1, title: "Student" },
  { id: 2, title: "Dozent" },
  { id: 3, title: "Admin" },
];
const selectedAccountType = ref(1);
</script>
<template>
  <div class="mt-10 md:mx-auto md:w-full md:max-w-[480px]">
    <div class="bg-ms-white px-6 py-12 shadow md:rounded-lg md:px-12">
      <!--Form -------->
      <form class="space-y-6" @submit.prevent="signUp">
        <div>
          <label
            for="name"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Name</label
          >
          <div class="mt-2">
            <input
              id="name"
              v-model="name"
              name="name"
              type="text"
              autocomplete="name"
              required
              class="block w-full rounded-md border-gray-500 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label
            for="email"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Email</label
          >
          <div class="mt-2">
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="block w-full rounded-md border-gray-500 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <p
          v-if="errors.email"
          class="mt-1 text-sm text-ms-danger"
          id="email-error"
        >
          {{ errors.email }}
        </p>

        <div>
          <label
            for="password"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Passwort</label
          >
          <div class="mt-2">
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              @focus="focusPassword = true"
              @blur="focusPassword = false"
              class="block w-full rounded-md border-gray-500 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <p
          v-if="errors.password"
          class="mt-1 text-sm text-ms-danger"
          id="email-error"
        >
          {{ errors.password }}
        </p>

        <div>
          <label
            for="passwordConfirm"
            class="block text-sm font-medium leading-6 text-gray-900"
            >Passwort bestätigen</label
          >
          <div class="mt-2">
            <input
              id="passwordConfirm"
              v-model="passwordConfirm"
              name="passwordConfirm"
              type="password"
              autocomplete="current-password"
              required
              @focus="focusPassword = true"
              @blur="focusPassword = false"
              class="block w-full rounded-md border-gray-500 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <p
          v-if="errors.passwordConfirm"
          class="mt-1 text-sm text-ms-danger"
          id="email-error"
        >
          {{ errors.passwordConfirm }}
        </p>
        <div>
          <!-- user Type -->
          <fieldset>
            <legend class="text-sm/6 font-semibold text-gray-900">
              Nutzerart
            </legend>
            <p class="mt-1 text-sm/6 text-gray-600">
              Als welche Art von Nutzer soll der Account angelegt werden?
            </p>
            <div
              class="mt-6 space-y-6 sm:flex sm:items-center sm:space-x-10 sm:space-y-0"
            >
              <div
                v-for="accountType in accountTypes"
                :key="accountType.id"
                class="flex items-center"
              >
                <input
                  :id="`accountType-${accountType.id}`"
                  name="accountType"
                  type="radio"
                  :value="accountType.id"
                  v-model="selectedAccountType"
                  class="size-4 border-gray-300 text-primary focus:ring-primary"
                />
                <label
                  :for="`accountType-${accountType.id}`"
                  class="ml-3 block text-sm font-medium text-gray-900"
                >
                  {{ accountType.title }}
                </label>
              </div>
            </div>
          </fieldset>
        </div>
        <div>
          <button
            type="submit"
            :disabled="!meta.valid"
            :class="
              meta.valid
                ? 'bg-primary '
                : 'bg-primary  opacity-50 cursor-not-allowed'
            "
            class="flex w-full justify-center rounded-md px-3 p-1.5 text-sm font-semibold leading-6 text-ms-white"
          >
            Registrieren
          </button>
        </div>
      </form>
    </div>

    <p class="mt-10 text-center text-sm text-gray-500">
      Sie haben bereits ein Account?
      <a href="/login" class="font-semibold leading-6 text-primary"
        >Jetzt anmelden</a
      >
    </p>
  </div>
  <div
    class="absolute inset-x-0 -bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl"
  ></div>
  <!-- Global notification live region, render this permanently at the end of the document -->
  <div
    aria-live="assertive"
    class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 md:items-start md:p-6"
  >
    <div class="flex w-full flex-col items-center space-y-4 md:items-end">
      <!-- Notification panel, dynamically insert this into the live region when it needs to be displayed -->
      <!-- error -->
      <transition
        enter-active-class="transform ease-out duration-300 transition"
        enter-from-class="translate-y-2 opacity-0 md:translate-y-0 md:translate-x-2"
        enter-to-class="translate-y-0 opacity-100 md:translate-x-0"
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="errorMsg"
          class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-ms-white shadow-lg ring-1 ring-black ring-opacity-5"
        >
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <XCircleIcon class="h-6 w-6 text-ms-danger" />
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-medium text-gray-900">Fehler!</p>
                <p class="mt-1 text-sm text-gray-500">{{ errorMsg }}</p>
              </div>
              <div class="ml-4 flex flex-shrink-0">
                <button
                  type="button"
                  @click="errorMsg = undefined"
                  class="inline-flex rounded-md bg-ms-white text-gray-400 hover:text-gray-500 focus:outline-none"
                >
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
