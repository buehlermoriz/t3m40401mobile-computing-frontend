<template>
  <header class="bg-white">
    <nav
      class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      aria-label="Global"
    >
      <div class="flex lg:flex-1">
        <a href="/" class="flex items-center gap-x-5">
          <DynamicLogo />
          <span class="text-xl font-bold text-gray-900 md:text-2xl"
            >Kalenderio</span
          >
        </a>
      </div>
      <div class="flex lg:hidden">
        <button
          type="button"
          class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          @click="mobileMenuOpen = true"
        >
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <div class="hidden lg:flex lg:gap-x-12">
        <a
          v-for="item in filteredNavigation"
          :key="item.name"
          :href="item.href"
          class="text-sm/6 font-semibold text-gray-900"
          >{{ item.name }}</a
        >
      </div>
      <div class="hidden lg:flex lg:flex-1 lg:justify-end">
        <RouterLink v-if="isLoggedIn" to="/user" class="-m-1.5 p-1.5">
          <img
            class="mx-auto h-10 w-10 rounded-full"
            :src="avatar"
            alt="Avatar"
          />
        </RouterLink>
      </div>
    </nav>
    <Dialog
      class="lg:hidden"
      @close="mobileMenuOpen = false"
      :open="mobileMenuOpen"
    >
      <div class="fixed inset-0 z-10" />
      <DialogPanel
        class="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10"
      >
        <div class="flex items-center justify-between">
          <a href="/" class="flex items-center gap-x-5">
            <DynamicLogo />
            <span class="text-xl font-bold text-gray-900 md:text-2xl"
              >Kalenderio</span
            >
          </a>
          <button
            type="button"
            class="-m-2.5 rounded-md p-2.5 text-gray-700"
            @click="mobileMenuOpen = false"
          >
            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div class="mt-6 flow-root">
          <div class="-my-6 divide-y divide-gray-500/10">
            <div class="space-y-2 py-6">
              <a
                v-for="item in filteredNavigation"
                :key="item.name"
                :href="item.href"
                class="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                >{{ item.name }}</a
              >
            </div>
            <div class="py-6">
              <RouterLink
                v-if="isLoggedIn"
                to="/user"
                class="-m-1.5 p-1.5"
                @click="mobileMenuOpen = false"
              >
                <img
                  class="mx-auto h-10 w-10 rounded-full"
                  :src="avatar"
                  alt="Avatar"
                />
              </RouterLink>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  </header>
</template>

<script setup>
import { ref, computed } from "vue";
import { Dialog, DialogPanel } from "@headlessui/vue";
import { Bars3Icon, XMarkIcon } from "@heroicons/vue/24/outline";
import DynamicLogo from "@/components/DynamicLogo.vue";
import store from "@/store";
import { RouterLink } from "vue-router";

const isLoggedIn = computed(() => store.getters.user.loggedIn);
const avatar = computed(() => store.getters.user.data?.photoURL);
const userRole = computed(
  () => store.getters.user.data?.middlewareUserRoleId ?? 1
);

const navigation = [
  { name: "Home", href: "/", minRole: 1 },
  { name: "Meine Kurse", href: "/user-events", minRole: 1 },
  { name: "Neuer Kurs", href: "/new-event", minRole: 2 },
  { name: "Kategorien", href: "/categories", minRole: 3 },
  { name: "Profil", href: "/user", minRole: 1 },
];

const filteredNavigation = computed(() => {
  return navigation.filter((item) => userRole.value >= item.minRole);
});
const mobileMenuOpen = ref(false);
</script>
