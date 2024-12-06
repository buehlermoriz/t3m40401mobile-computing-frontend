<template>
      <header class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
      <h1 class="text-base font-semibold text-gray-900">
        <time datetime="selectedYear">{{selectedYear}}</time>
      </h1>
      <div class="flex items-center">
        <div v-if="view == 'Jahres'" class="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
          <button @click="selectedYear-=1" type="button" class="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50">
            <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
          </button>
          <span class="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
          <button @click="selectedYear+=1" type="button" class="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50">
            <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div class="hidden md:ml-4 md:flex md:items-center">
          <Menu as="div" class="relative">
            <MenuButton type="button" class="flex items-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              {{view}}ansicht
              <ChevronDownIcon class="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
            </MenuButton>

            <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
              <MenuItems class="absolute right-0 z-10 mt-3 w-36 origin-top-right overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div class="py-1">
                  <MenuItem v-slot="{ active }">
                    <div @click="view='Monats'" :class="[active ? 'bg-gray-100 text-gray-900 outline-none' : 'text-gray-700', 'block px-4 py-2 text-sm']">Monatsansicht</div>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <div @click="view='Jahres'" :class="[active ? 'bg-gray-100 text-gray-900 outline-none' : 'text-gray-700', 'block px-4 py-2 text-sm']">Jahresansicht</div>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>
          <div class="ml-6 h-6 w-px bg-gray-300" />
          <RouterLink v-if="userRole > 1" to="/new-event" type="button" class="ml-6 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Kurs erstellen</RouterLink>
          <RouterLink v-if="userRole === 1" to="/user-events" type="button" class="ml-6 rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">Meine Kurse</RouterLink>
        </div>
        <Menu as="div" class="relative ml-6 md:hidden">
          <MenuButton class="-mx-2 flex items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500">
            <EllipsisHorizontalIcon class="h-5 w-5" aria-hidden="true" />
          </MenuButton>

          <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
            <MenuItems class="absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div class="py-1">
                <MenuItem v-if="userRole > 1" v-slot="{ active }">
                  <RouterLink  to="/new-event" :class="[active ? 'bg-gray-100 text-gray-900 outline-none' : 'text-gray-700', 'block px-4 py-2 text-sm']">Kurs erstellen</RouterLink>
                </MenuItem>
                <MenuItem v-if="userRole === 1" v-slot="{ active }">
                <RouterLink  to="/user-events" :class="[active ? 'bg-gray-100 text-gray-900 outline-none' : 'text-gray-700', 'block px-4 py-2 text-sm']">Kurs erstellen</RouterLink>
              </MenuItem>
              </div>
              <div class="py-1">
                <MenuItem v-slot="{ active }">
                    <div @click="view='Monats'" :class="[active ? 'bg-gray-100 text-gray-900 outline-none' : 'text-gray-700', 'block px-4 py-2 text-sm']">Monatsansicht</div>
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <div @click="view='Jahres'" :class="[active ? 'bg-gray-100 text-gray-900 outline-none' : 'text-gray-700', 'block px-4 py-2 text-sm']">Jahresansicht</div>
                  </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>
      </div>
    </header>
    <!-- PROBLEM: Verwaltung von Variablen zwischen den Komponenten -->
  <YearCallendar v-if="view == 'Jahres'" :selectedYear="selectedYear" @dateSelected="handleDateSelected"/>
  <MonthCallendar v-if="view == 'Monats'" :selectedYear="selectedYear" :selectedMonth="selectedMonth" :selectedDay="selectedDay"/>
  <!-- Da die Monats- und Jahresansichten ausgelagert wurden gibt es eine Verwaltung der Variablen in beide Richtungen -->
</template>

<script setup>
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, EllipsisHorizontalIcon } from '@heroicons/vue/20/solid'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import  YearCallendar  from '@/components/YearCallendar.vue'
import MonthCallendar from '@/components/MonthCallendar.vue'
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import store from "@/store";

const selectedYear = ref(new Date().getFullYear())
const selectedMonth = ref(new Date().getMonth())
const selectedDay = ref(new Date().getDate())
const view = ref('Jahres')
const userRole = computed(() => store.getters.user.data?.middlewareUserRoleId ?? 1);


const handleDateSelected = ({ dayOfDate, monthIndex }) => {
  selectedMonth.value = monthIndex
  selectedDay.value = dayOfDate

  view.value = 'Monats'
}

</script>