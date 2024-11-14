
<template>
      <div class="space-y-12">
        <div class="border-b border-gray-900/10 pb-12">
          <h2 class="text-base/7 font-semibold text-gray-900">Erstellen Sie ein neues Event</h2>
          <p class="mt-1 text-sm/6 text-gray-600">This information will be displayed publicly so be careful what you share.</p>
                      <!-- Ausgabe -->
                      <Combobox class="flex-1 mt-10" as="div" v-model="selectedIssue"
                      @update:modelValue="queryIssue = ''">
                      <ComboboxLabel class="">Vorlesungsart
                      </ComboboxLabel>
                      <div class="relative mt-2">
                        <ComboboxInput
                          class="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary dark:focus:ring-color-nk sm:text-sm sm:leading-6"
                          @change="queryIssue = $event.target.value" @blur="queryIssue = ''"
                          :display-value="(trainingType) => ((trainingType as TrainingType)?.name)" />
                        <ComboboxButton
                          class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                          <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </ComboboxButton>

                        <ComboboxOptions v-if="filteredTrainingType.length > 0"
                          class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          <ComboboxOption v-for="(trainingType, index) in filteredTrainingType" :key="index" :value="trainingType"
                            as="template" v-slot="{ active, selected }">
                            <li
                              :class="['relative cursor-default select-none py-2 pl-8 pr-4', active ? 'bg-primary text-white' : 'text-gray-900']">
                              <span class="block truncate">
                                <span :class="{ 'font-semibold': selected }">{{ trainingType.name }}</span>
                              </span>

                              <span v-if="selected"
                                :class="['absolute inset-y-0 left-0 flex items-center pl-1.5', active ? 'text-white' : 'text-gray-500']">
                                <CheckIcon class="h-5 w-5" aria-hidden="true" />
                              </span>
                            </li>
                          </ComboboxOption>
                        </ComboboxOptions>
                      </div>
                      <p class="mt-1 text-sm leading-6 text-red-500" v-if="displayIssueError">Bitte füllen Sie dieses
                        Feld zuerst aus.</p>
                    </Combobox>
        </div>
      </div>
  
  </template>
  
  <script setup lang="ts">

  // Imports ---------
import { computed, onMounted, ref, watch } from 'vue'
import { CheckIcon, ChevronUpDownIcon, TrashIcon } from '@heroicons/vue/20/solid'
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxLabel,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/vue'
import { getTrainingTypes } from "@/services/DbConnector";

//Interfaces ---------
interface TrainingType {
  id: string,
  name: string,
  description: string,
  category: number,
  maxParticipants: number,
  minParticipants: number,
  requirements: string,
}
const issues = ref<TrainingType[]>([]);
const displayIssueError = ref<boolean>(false);

  //logic ausgabe /TrainingType ---------
const queryIssue = ref('')
const selectedIssue = ref<TrainingType | null>(null)
const filteredTrainingType = computed<TrainingType[]>(() => {
  let filteredTrainingType = issues.value; // Start with all issues

  // filter by queryIssue
  if (queryIssue.value !== '') {
    filteredTrainingType = filteredTrainingType.filter((trainingType) =>
      trainingType.name.toLowerCase().includes(queryIssue.value.toLowerCase()) ||
      trainingType.name.toLowerCase().includes(queryIssue.value.toLowerCase())
    );
  }

  return filteredTrainingType; // Return the filtered array
});

onMounted(async () => {
  issues.value = await getTrainingTypes();
})

  </script>