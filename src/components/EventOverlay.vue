<template>
    <TransitionRoot as="template" :show="open">
  <Dialog class="relative z-10" @close="open = false">
    <TransitionChild
      as="template"
      :show="open"
      enter="ease-out duration-300"
      enter-from="opacity-0"
      enter-to="opacity-100"
      leave="ease-in duration-200"
      leave-from="opacity-100"
      leave-to="opacity-0"
    >
      <div class="fixed inset-0 bg-gray-500/75 transition-opacity" />
    </TransitionChild>

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div
        class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
      >
        <TransitionChild
          as="template"
          :show="open"
          enter="ease-out duration-300"
          enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to="opacity-100 translate-y-0 sm:scale-100"
          leave="ease-in duration-200"
          leave-from="opacity-100 translate-y-0 sm:scale-100"
          leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <DialogPanel
            class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
          >
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <DialogTitle
                  as="h3"
                  class="text-base font-semibold text-gray-900"
                  >Kategorie hinzufügen</DialogTitle
                >
              </div>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  Erstellen Sie eine neue Kategorie. Diese wird für alle Benutzer sichtbar sein.
                </p>
              </div>
              <div class="my-4">
                <label
                  for="ttDescription"
                  class="block text-sm/6 font-medium text-gray-900"
                >
                  Name</label
                >
                <input
                  v-model="categoryName"
                  type="text"
                  id="ttDescription"
                  class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm/6"
                />
              </div>
            </div>
            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                @click="open = false"
                ref="cancelButtonRef"
              >
                Abbrechen
              </button>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </div>
  </Dialog>
</TransitionRoot>
</template>
<script setup>
import { ref } from "vue";

const open = ref(false);

const props = defineProps({
  eventId: {
    type: Number,
    required: true,
  },
});
</script>