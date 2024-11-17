<template>
  <h2 class="text-base font-semibold text-gray-900">Categories</h2>
  <p class="mt-1 text-sm/6 text-gray-600">
    As Admin you are able to create and remove categories for all users. Please
    note, that removing a category will delete all trainings correlating to the
    category.
  </p>
  <div class="flex mt-5">
    <button
      @click="modalOpenAdd = true"
      class="ml-auto rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      Add Category
    </button>
  </div>
  <ol
    class="mt-4 divide-y divide-gray-100 text-sm/6 lg:col-span-7 xl:col-span-8"
  >
    <li v-for="category in categories" :key="category.name" class="py-6">
      <div class="flex">
        <h3 class="text-gray-900 grow">
          {{ category.name }}
        </h3>
        <button @click="openDeleteModal(category.id)">
          <TrashIcon class="h-5 text-red-500"></TrashIcon>
        </button>
      </div>
    </li>
  </ol>
  <div
    v-if="!categorysLoaded"
    class="lg:col-span-7 xl:col-span-8 flex items-center justify-center"
  >
    <DynamicLoader />
  </div>

  <!-- ALERT -->

  <TransitionRoot as="template" :show="modalOpenDelete">
    <Dialog class="relative z-10" @close="modalOpenDelete = false">
      <TransitionChild
        as="template"
        :show="modalOpenDelete"
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
            :show="modalOpenDelete"
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
                <div
                  class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10"
                >
                  <ExclamationTriangleIcon
                    class="size-6 text-red-600"
                    aria-hidden="true"
                  />
                </div>
                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle
                    as="h3"
                    class="text-base font-semibold text-gray-900"
                    >Delete Category</DialogTitle
                  >
                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Are you sure you want to delete the category
                      {{
                        categories.find(
                          (category) => category.id === categoryToDelete.value
                        )?.name
                      }}? All trainings correlating to the category will be
                      deleted.
                    </p>
                  </div>
                </div>
              </div>
              <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                  @click="deleteCategory()"
                >
                  Delete
                </button>
                <button
                  type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  @click="cancelDelete()"
                  ref="cancelButtonRef"
                >
                  Cancel
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

  <TransitionRoot as="template" :show="modalOpenAdd">
    <Dialog class="relative z-10" @close="modalOpenAdd = false">
      <TransitionChild
        as="template"
        :show="modalOpenAdd"
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
            :show="modalOpenAdd"
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
                    >Add Category</DialogTitle
                  >
                </div>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Create a new Category, wich will be available for all users.
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
                  class="inline-flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto"
                  @click="addCategory()"
                >
                  Create
                </button>
                <button
                  type="button"
                  class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                  @click="modalOpenAdd = false"
                  ref="cancelButtonRef"
                >
                  Cancel
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
import {
  TrashIcon,
  ExclamationTriangleIcon,
  PlusCircleIcon,
} from "@heroicons/vue/20/solid";
import { ref, onMounted } from "vue";
import {
  getTrainingCategory,
  deleteTrainingCategory,
  newTrainingCategory,
} from "@/services/DbConnector";
import DynamicLoader from "@/components/DynamicLoader.vue";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";

const categories = ref([]);
const categorysLoaded = ref(false);
const modalOpenDelete = ref(false);
const modalOpenAdd = ref(false);
const categoryToDelete = ref(null);
const categoryName = ref("");

onMounted(async () => {
  categories.value = await getTrainingCategory();
  categorysLoaded.value = true;
});

const openDeleteModal = (id) => {
  modalOpenDelete.value = true;
  categoryToDelete.value = id;
};

const cancelDelete = () => {
  modalOpenDelete.value = false;
  categoryToDelete.value = null;
};

const deleteCategory = async () => {
  await deleteTrainingCategory(categoryToDelete.value);
  // Remove the category from the list
  categories.value = categories.value.filter(
    (category) => category.id !== categoryToDelete.value
  );
  categoryToDelete.value = null;
  modalOpenDelete.value = false;
};

const addCategory = async () => {
  await newTrainingCategory(categoryName.value);
  categories.value = await getTrainingCategory();
    categoryName.value = "";
    modalOpenAdd.value = false;
};
</script>
