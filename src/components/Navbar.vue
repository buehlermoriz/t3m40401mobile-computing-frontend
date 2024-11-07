<template>
  <header>
    <nav class="w-full flex items-center justify-between p-6 px-4 md:px-8 2xl:px-40" aria-label="Global">
      <div class="flex lg:flex-1">
        <RouterLink to="/" class="-m-1.5 p-1.5 flex items-center gap-x-5">
          <DynamicLogo /> <span class="text-xl font-bold  text-gray-900  md:text-2xl">PreisKompass</span>
        </RouterLink>
      </div>
      <div v-if="isLoggedIn" class="flex lg:hidden">
        <button type="button"
          class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700 "
          @click="mobileMenuOpen = true">
          <Bars3Icon class="h-6 w-6" />
        </button>
      </div>
      <!-- desktop navbar -->
      <!-- desktop user -->
      <div class="hidden lg:flex lg:flex-1 lg:justify-end">
        <RouterLink v-if="isLoggedIn" to="/user" class="-m-1.5 p-1.5">
          <img class="mx-auto h-10 w-10 rounded-full" :src="avatar" alt="Avatar" />
        </RouterLink>
      </div>
    </nav>
    <!-- mobile navbar -->
    <Dialog as="div" class="lg:hidden" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
      <div class="fixed inset-0 z-10" />
      <DialogPanel 
        class="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-ms-white  px-6 py-6 md:max-w-sm md:ring-1 md:ring-gray-900/10">
        <div class="flex items-center justify-between">
          <RouterLink to="/" class="-m-1.5 p-1.5">
            <DynamicLogo />
          </RouterLink>
          <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700 "
            @click="mobileMenuOpen = false">
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>
        <div class="mt-6 flow-root">
          <div class="-my-6 divide-y divide-gray-500/10">
            <div class="py-6">
              <RouterLink to="/user" @click="mobileMenuOpen = false" class="-m-1.5 p-1.5">
                <img  class="mx-auto h-10 w-10 rounded-full" :src="avatar" alt="Avatar" />
              </RouterLink>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  </header>
</template>

<script setup>
import { ref } from "vue";
import {
  Dialog,
  DialogPanel,
} from "@headlessui/vue";
import {
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import { computed } from "vue";
import store from "@/store";
import DynamicLogo from "@/components/DynamicLogo.vue";

const isLoggedIn = computed(() => store.getters.user.loggedIn);
const avatar = computed(() => store.getters.user.data?.photoURL);
const mobileMenuOpen = ref(false);
</script>
