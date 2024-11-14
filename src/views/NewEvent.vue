<template>
  <div class="space-y-12">
    <div class="border-b border-gray-900/10 pb-12">
      <h2 class="text-base/7 font-semibold text-gray-900">
        Erstellen Sie ein neues Event
      </h2>
      <!-- Ausgabe -->
       <div class="relative">
      <Combobox
        class="flex-1 my-5 pb-5 border-b border-gray-900/10"
        as="div"
        v-model="selectedTrainingType"
        @update:modelValue="queryTrainingType = ''"
      >
        <ComboboxLabel class="">Vorlesungsart </ComboboxLabel>
        <div class="relative mt-2">
          <ComboboxInput
            class="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary dark:focus:ring-color-nk sm:text-sm sm:leading-6"
            @change="queryTrainingType = $event.target.value"
            @blur="queryTrainingType = ''"
            :display-value="(trainingType) => ((trainingType as TrainingType)?.name)"
          />
          <ComboboxButton
            class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none"
          >
            <ChevronUpDownIcon
              class="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </ComboboxButton>
          <ComboboxOptions
            v-if="filteredTrainingType.length > 0"
            class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            <ComboboxOption
              v-for="(trainingType, index) in filteredTrainingType"
              :key="index"
              :value="trainingType"
              as="template"
              v-slot="{ active, selected }"
            >
              <li
                :class="[
                  'relative cursor-default select-none py-2 pl-8 pr-4',
                  active ? 'bg-primary text-white' : 'text-gray-900',
                ]"
              >
                <span class="block truncate">
                  <span :class="{ 'font-semibold': selected }">{{
                    trainingType.name
                  }}</span>
                </span>

                <span
                  v-if="selected"
                  :class="[
                    'absolute inset-y-0 left-0 flex items-center pl-1.5',
                    active ? 'text-white' : 'text-gray-500',
                  ]"
                >
                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                </span>
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        </div>
        <ComboboxLabel class="mt-1 text-sm/6 text-gray-600"
          >Choose an exisiting Trainingtype or generate a new one bellow.
        </ComboboxLabel>
      </Combobox>
    </div>
      <!-- Trainingtype -->
       <h2 class="text-base/7 font-semibold text-gray-900">TrainingType</h2>
      <div id="trainingtypes" v-if="!selectedTrainingType">
        <!-- ttName -->
        <label for="text" class="block text-sm/6 font-medium text-gray-900"
          > Name</label
        >

        <div class="mb-2">
          <input
            v-model="ttName"
            type="text"
            name="ttName"
            id="ttName"
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
          />
        </div>
        <!-- ttdescription -->
        <label
          for="ttDescription"
          class="block text-sm/6 font-medium text-gray-900"
          > description</label
        >

        <div class="mb-2">
          <input
            v-model="ttDescription"
            type="text"
            name="ttDescription"
            id="ttDescription"
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
          />
        </div>
        <!-- ttRequirements -->
        <label
          for="ttRequirements"
          class="block text-sm/6 font-medium text-gray-900"
          > requirements</label
        >

        <div class="mb-2">
          <input
            v-model="ttRequirements"
            type="text"
            name="ttRequirements"
            id="ttRequirements"
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
          />
        </div>
        <!-- ttCategory -->
         <div class="relative">
        <Combobox
        class="flex-1 border-gray-900/10"
        as="div"
        v-model="selectedCategoryType"
        @update:modelValue="queryCategoryType = ''"
      >
        <ComboboxLabel class="block text-sm/6 font-medium text-gray-900">Category </ComboboxLabel>
        <div class="relative">
          <ComboboxInput
            class="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary dark:focus:ring-color-nk sm:text-sm sm:leading-6"
            @change="queryCategoryType = $event.target.value"
            @blur="queryCategoryType = ''"
            :display-value="(categoryType) => ((categoryType as Category)?.name)"
          />
          <ComboboxButton
            class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none"
          >
            <ChevronUpDownIcon
              class="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </ComboboxButton>
        </div>
          <ComboboxOptions
            v-if="filteredCategoryType.length > 0"
            class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            <ComboboxOption
              v-for="(categoryType, index) in filteredCategoryType"
              :key="index"
              :value="categoryType"
              as="template"
              v-slot="{ active, selected }"
            >
              <li
                :class="[
                  'relative cursor-default select-none py-2 pl-8 pr-4',
                  active ? 'bg-primary text-white' : 'text-gray-900',
                ]"
              >
                <span class="block truncate">
                  <span :class="{ 'font-semibold': selected }">{{
                    categoryType.name
                  }}</span>
                </span>

                <span
                  v-if="selected"
                  :class="[
                    'absolute inset-y-0 left-0 flex items-center pl-1.5',
                    active ? 'text-white' : 'text-gray-500',
                  ]"
                >
                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                </span>
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        <ComboboxLabel class="mt-1 text-sm/6 text-gray-600"
          >Your Category is missing? Ask your Admin to add new ones.
        </ComboboxLabel>
      </Combobox>
    </div>
        <!-- ttMaxParticipants -->
        <label
          for="ttMaxParticipants"
          class="block text-sm/6 font-medium text-gray-900"
          >
          maxParticipants</label
        >
        <div class="mb-2">
          <input
            v-model="ttMaxParticipants"
            type="number"
            name="ttMaxParticipants"
            id="ttMaxParticipants"
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
          />
        </div>
        <!-- ttMinParticipants -->
        <label
          for="ttMinParticipants"
          class="block text-sm/6 font-medium text-gray-900"
          >
          minParticipants</label
        >
        <div class="mb-2">
          <input
            v-model="ttMinParticipants"
            type="number"
            name="ttMinParticipants"
            id="ttMinParticipants"
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
          />
        </div>
      </div>
      <div
        v-if="selectedTrainingType"
        class="p-4 mt-3 ring-gray-300 ring-1 rounded-md"
      >
        <div class="flex items-center gap-x-2 text-gray-900">
          <span class="flex-1 font-semibold">Selected Trainingtype:</span>
          <span>{{ selectedTrainingType.name }}</span>
        </div>
        <div class="flex items-center gap-x-2 text-gray-900 mt-1">
          <span class="flex-1 font-semibold">description</span>
          <span>{{ selectedTrainingType.description }}</span>
        </div>
        <div class="flex items-center gap-x-2 text-gray-900 mt-1">
          <span class="flex-1 font-semibold">category</span>
          <span>{{ selectedTrainingType.category }}</span>
        </div>
        <div class="flex items-center gap-x-2 text-gray-900 mt-1">
          <span class="flex-1 font-semibold">maxParticipants</span>
          <span>{{ selectedTrainingType.maxParticipants }}</span>
        </div>
        <div class="flex items-center gap-x-2 text-gray-900 mt-1">
          <span class="flex-1 font-semibold">minParticipants</span>
          <span>{{ selectedTrainingType.minParticipants }}</span>
        </div>
        <div class="flex items-center gap-x-2 text-gray-900 mt-1">
          <span class="flex-1 font-semibold">requirements</span>
          <span>{{ selectedTrainingType.requirements }}</span>
        </div>
        <button @click="selectedTrainingType=null" class="mt-2 flex w-full justify-center rounded-md px-3 p-1.5 text-sm leading-6 text-primary ring-1 ring-primary">Remove Choice</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Imports ---------
import { computed, onMounted, ref, watch } from "vue";
import {
  CheckIcon,
  ChevronUpDownIcon,
  TrashIcon,
} from "@heroicons/vue/20/solid";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxLabel,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/vue";
import { getTrainingTypes, getCategories } from "@/services/DbConnector";

//Interfaces ---------
interface TrainingType {
  id: number;
  name: string;
  description: string;
  category: number;
  maxParticipants: number;
  minParticipants: number;
  requirements: string;
}

interface Category {
  id: number;
  name: string;
}
const trainingTypes = ref<TrainingType[]>([]);

// Params trainingType
const ttName = ref<string>();
const ttDescription = ref<string>();
const ttCategory = ref<number>();
const ttMaxParticipants = ref<number>();
const ttMinParticipants = ref<number>();
const ttRequirements = ref<string>();

//logic  TrainingType ---------
const queryTrainingType = ref("");
const selectedTrainingType = ref<TrainingType | null>(null);
const filteredTrainingType = computed<TrainingType[]>(() => {
  let filteredTrainingType = trainingTypes.value; // Start with all trainingTypes

  // filter by queryTrainingType
  if (queryTrainingType.value !== "") {
    filteredTrainingType = filteredTrainingType.filter(
      (trainingType) =>
        trainingType.name
          .toLowerCase()
          .includes(queryTrainingType.value.toLowerCase())
    );
  }

  return filteredTrainingType; // Return the filtered array
});

const categoryTypes = ref<Category[]>([]);


//logic  CategoryType ---------
const queryCategoryType = ref("");
const selectedCategoryType = ref<Category | null>(null);
const filteredCategoryType = computed<Category[]>(() => {
  let filteredCategoryType = categoryTypes.value; // Start with all categoryTypes

  // filter by queryCategoryType
  if (queryCategoryType.value !== "") {
    filteredCategoryType = filteredCategoryType.filter(
      (categoryType) =>
        categoryType.name
          .toLowerCase()
          .includes(queryCategoryType.value.toLowerCase())
    );
  }

  return filteredCategoryType; // Return the filtered array
});



onMounted(async () => {
  trainingTypes.value = await getTrainingTypes();
  categoryTypes.value = await getCategories();
});
</script>
