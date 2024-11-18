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
              class="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary  sm:text-sm sm:leading-6"
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
            >Wählen Sie aus den vorhandenen Vorlesungsarten oder erstellen Sie eine neue Vorlesungsart.
          </ComboboxLabel>
        </Combobox>
      </div>
      <!-- Trainingtype -->
      <h2 class="text-base/7 font-semibold text-gray-900">Vorlesungsart</h2>
      <div id="trainingtypes" v-if="!selectedTrainingType">
        <!-- ttName -->
        <label for="text" class="block text-sm/6 font-medium text-gray-900">
          Name</label
        >
        <div class="mb-2">
          <input
            v-model="ttName"
            type="text"
            name="ttName"
            id="ttName"
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm/6"
          />
        </div>
        <!-- ttdescription -->
        <label
          for="ttDescription"
          class="block text-sm/6 font-medium text-gray-900"
        >
          Beschreibung</label
        >

        <div class="mb-2">
          <input
            v-model="ttDescription"
            type="text"
            name="ttDescription"
            id="ttDescription"
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm/6"
          />
        </div>
        <!-- ttRequirements -->
        <label
          for="ttRequirements"
          class="block text-sm/6 font-medium text-gray-900"
        >
          Anforderungen</label
        >

        <div class="mb-2">
          <input
            v-model="ttRequirements"
            type="text"
            name="ttRequirements"
            id="ttRequirements"
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm/6"
          />
        </div>
        <!-- ttCategory -->
        <div class="relative">
          <Combobox
            class="flex-1 border-gray-900/10"
            as="div"
            v-model="selectedCategory"
            @update:modelValue="queryCategory = ''"
          >
            <ComboboxLabel class="block text-sm/6 font-medium text-gray-900"
              >Kategorie
            </ComboboxLabel>
            <div class="relative">
              <ComboboxInput
                class="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary  sm:text-sm sm:leading-6"
                @change="queryCategory = $event.target.value"
                @blur="queryCategory = ''"
                :display-value="(category) => ((category as Category)?.name)"
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
              v-if="filteredCategory.length > 0"
              class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            >
              <ComboboxOption
                v-for="(category, index) in filteredCategory"
                :key="index"
                :value="category"
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
                      category.name
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
              >Ihre Kategorie ist nicht dabei? Bitten Sie den Admin, eine neue Kategorie hinzuzufügen.
            </ComboboxLabel>
          </Combobox>
        </div>
        <!-- ttMaxParticipants -->
        <label
          for="ttMaxParticipants"
          class="block text-sm/6 font-medium text-gray-900"
        >
          max. Teilnehmer</label
        >
        <div class="mb-2">
          <input
            v-model="ttMaxParticipants"
            type="number"
            name="ttMaxParticipants"
            id="ttMaxParticipants"
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm/6"
          />
        </div>
        <!-- ttMinParticipants -->
        <label
          for="ttMinParticipants"
          class="block text-sm/6 font-medium text-gray-900"
        >
          min. Teilnehmer</label
        >
        <div class="mb-2">
          <input
            v-model="ttMinParticipants"
            type="number"
            name="ttMinParticipants"
            id="ttMinParticipants"
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm/6"
          />
        </div>
      </div>
      <div
        v-if="selectedTrainingType"
        class="p-4 mt-3 ring-gray-300 ring-1 rounded-md"
      >
        <div class="flex items-center gap-x-2 text-gray-900">
          <span class="flex-1 font-semibold">Gewählte Vorlesungsart:</span>
          <span>{{ selectedTrainingType.name }}</span>
        </div>
        <div class="flex items-center gap-x-2 text-gray-900 mt-1">
          <span class="flex-1 font-semibold">Beschreibung</span>
          <span>{{ selectedTrainingType.description }}</span>
        </div>
        <div class="flex items-center gap-x-2 text-gray-900 mt-1">
          <span class="flex-1 font-semibold">Kategorie</span>
          <span>{{ selectedTrainingType.category.name }}</span>
        </div>
        <div class="flex items-center gap-x-2 text-gray-900 mt-1">
          <span class="flex-1 font-semibold">max. Teilnehmer</span>
          <span>{{ selectedTrainingType.maxParticipants }}</span>
        </div>
        <div class="flex items-center gap-x-2 text-gray-900 mt-1">
          <span class="flex-1 font-semibold">min. Teilnehmer</span>
          <span>{{ selectedTrainingType.minParticipants }}</span>
        </div>
        <div class="flex items-center gap-x-2 text-gray-900 mt-1">
          <span class="flex-1 font-semibold">Anforderungen</span>
          <span>{{ selectedTrainingType.requirements }}</span>
        </div>
        <button
          @click="selectedTrainingType = null"
          class="mt-2 flex w-full justify-center rounded-md px-3 p-1.5 text-sm leading-6 text-primary ring-1 ring-primary"
        >
          Auswahl zurücksetzen
        </button>
      </div>
      <!-- Training -->
      <div id="training">
        <h2 class="text-base/7 font-semibold text-gray-900">Kurs</h2>
        <label for="text" class="block text-sm/6 font-medium text-gray-900">
          Notizen</label
        >
        <div class="mb-2">
          <input
            v-model="tNotes"
            type="text"
            name="tNotes"
            id="tNotes"
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm/6"
          />
        </div>
        <label for="tNotes" class="text-sm/6 text-gray-600"
          >Diese Beschreibung bezieht sich auf den einzelnen Kurs nicht die Kursart.</label
        >
                <!-- teacher -->
                <div class="relative">
          <Combobox
            class="flex-1 border-gray-900/10"
            as="div"
            v-model="selectedTeacher"
            @update:modelValue="queryTeacher = ''"
          >
            <ComboboxLabel class="block text-sm/6 font-medium text-gray-900"
              >Dozent
            </ComboboxLabel>
            <div class="relative">
              <ComboboxInput
                class="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary  sm:text-sm sm:leading-6"
                @change="queryTeacher = $event.target.value"
                @blur="queryTeacher = ''"
                :display-value="(teacher) => ((teacher as Teacher)?.name)"
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
              v-if="filteredTeacher.length > 0"
              class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            >
              <ComboboxOption
                v-for="(teacher, index) in filteredTeacher"
                :key="index"
                :value="teacher"
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
                      teacher.name
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
          </Combobox>
        </div>
      </div>
      <!-- Timeblocks -->
      <!-- Timeblocks -->
      <div class="timeblocks mt-6">
        <h2 class="text-base font-semibold text-gray-900">Zeitblöcke</h2>

        <!-- Start Date -->
        <label
          for="tbStart"
          class="block text-sm font-medium text-gray-900 mt-2"
          >Start</label
        >
        <div class="mb-2">
          <input
            v-model="tbStart"
            type="date"
            name="tbStart"
            id="tbStart"
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
          />
        </div>

        <!-- End Date -->
        <label for="tbEnd" class="block text-sm font-medium text-gray-900"
          >Ende</label
        >
        <div class="mb-2">
          <input
            v-model="tbEnd"
            type="date"
            name="tbEnd"
            id="tbEnd"
            class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm"
          />
        </div>

        <!-- Add Timeblock Button -->
        <button
          @click="addTimeblock"
          class="mt-2 w-full flex justify-center rounded-md px-3 py-1.5 text-sm  shadow-sm text-primary ring-inset ring-1 ring-primary"
        >
          Zeitblock hinzufügen
        </button>

        <!-- List of Timeblocks -->
        <div v-if="timeblocks.length" class="mt-4">
          <h3 class="text-sm font-medium text-gray-900">Geplante Zeitblöcke</h3>
          <ul>
            <li
              v-for="(timeblock, index) in timeblocks"
              :key="index"
              class="flex items-center justify-between py-2 border-b border-gray-200"
            >
              <span class="text-sm text-gray-700">
                {{ formatDate(timeblock.start) }} -
                {{ formatDate(timeblock.end) }}
              </span>
              <button
                @click="removeTimeblock(index)"
                class="text-sm text-red-500 hover:underline"
              >
                <TrashIcon class="h-5 w-5 mr-1" aria-hidden="true" />
              </button>
            </li>
          </ul>
        </div>
        <!-- send it -->
        <button
          @click="createEvent"
          class="mt-2 w-full flex justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
        >
          Kurs erstellen
        </button>
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
import {
  getTrainingTypes,
  getTrainingCategory,
  getUser,
  newTrainingType,
  newTrainingTimeBlock,
  newTraining,
} from "@/services/DbConnector";
import { useRouter } from 'vue-router';

const router = useRouter();

//Interfaces ---------
interface TrainingType {
  id: number;
  name: string;
  description: string;
  category: Category;
  maxParticipants: number;
  minParticipants: number;
  requirements: string;
}

interface Category {
  id: number;
  name: string;
}

interface Teacher {
  id: number;
  name: string;
  uid: string;
  email: string;
  role: number;
  birthDate: string;
}

interface Timeblock {
  start: string;
  end: string;
}
const trainingTypes = ref<TrainingType[]>([]);
// Params trainingType
const ttName = ref<string>();
const ttDescription = ref<string>();
const ttMaxParticipants = ref<number>();
const ttMinParticipants = ref<number>();
const ttRequirements = ref<string>();
// Params training
const tNotes = ref<string>();
// Params timeblocks
const timeblocks = ref<Timeblock[]>([]);
const tbStart = ref<string>("");
const tbEnd = ref<string>("");
// Params create Event
const trainingTypeId = ref<number>();
const timeBlockIds = ref<number[]>([]);

function addTimeblock() {
  if (tbStart.value && tbEnd.value) {
    const newTimeblock: Timeblock = {
      start: `${tbStart.value}T00:00:00+01:00`,
      end: `${tbEnd.value}T00:00:00+01:00`,
    };
    timeblocks.value.push(newTimeblock);
    tbStart.value = "";
    tbEnd.value = "";
  } else {
    alert("Please select both start and end dates.");
  }
}

function formatDate(datetimeStr: string): string {
  const date = new Date(datetimeStr);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

function removeTimeblock(index: number) {
  timeblocks.value.splice(index, 1);
}

//logic  TrainingType ---------
const queryTrainingType = ref("");
const selectedTrainingType = ref<TrainingType | null>(null);
const filteredTrainingType = computed<TrainingType[]>(() => {
let filteredTrainingType = trainingTypes.value; // Start with all trainingTypes

  // filter by queryTrainingType
  if (queryTrainingType.value !== "") {
    filteredTrainingType = filteredTrainingType.filter((trainingType) =>
      trainingType.name
        .toLowerCase()
        .includes(queryTrainingType.value.toLowerCase())
    );
  }

  return filteredTrainingType; // Return the filtered array
});

const categorys = ref<Category[]>([]);

//logic  Category ---------
const queryCategory = ref("");
const selectedCategory = ref<Category | null>(null);
const filteredCategory = computed<Category[]>(() => {
  let filteredCategory = categorys.value; // Start with all categorys

  // filter by queryCategory
  if (queryCategory.value !== "") {
    filteredCategory = filteredCategory.filter((category) =>
      category.name
        .toLowerCase()
        .includes(queryCategory.value.toLowerCase())
    );
  }

  return filteredCategory; // Return the filtered array
});

const teachers = ref<Teacher[]>([]);

//logic  Teacher ---------
const queryTeacher = ref("");
const selectedTeacher = ref<Teacher | null>(null);
const filteredTeacher = computed<Teacher[]>(() => {
  let filteredTeacher = teachers.value; // Start with all teachers

  // filter by queryTeacher
  if (queryTeacher.value !== "") {
    filteredTeacher = filteredTeacher.filter((teacher) =>
      teacher.name
        .toLowerCase()
        .includes(queryTeacher.value.toLowerCase())
    );
  }

  return filteredTeacher; // Return the filtered array
});



const createEvent = async () => {
  // STEP 1: Create or select training type
  if (!selectedTrainingType.value) {
    if (
      ttName.value &&
      ttDescription.value &&
      selectedCategory &&
      ttMaxParticipants &&
      ttMinParticipants &&
      ttRequirements.value
    ) {
      trainingTypeId.value = await newTrainingType(
        ttName.value,
        ttDescription.value,
        selectedCategory.value!.id,
        ttMaxParticipants.value!,
        ttMinParticipants.value!,
        ttRequirements.value
      );
    } else {
      alert("Please fill out all training type fields.");
      return;
    }
  } else {
    trainingTypeId.value = selectedTrainingType.value.id;
  }
  // STEP 2: Create timeblocks
  if (timeblocks.value.length !== 0) {
    for (const timeblock of timeblocks.value) {
      // Create timeblock
      const newTimeblockId = await newTrainingTimeBlock(timeblock.start, timeblock.end);
      timeBlockIds.value.push(newTimeblockId);
    }
  }
  else{
    alert("Please add at least one timeblock.");
    return;
  }
  // STEP 3: Create training
  const response = await newTraining(trainingTypeId.value, timeBlockIds.value, tNotes.value!, selectedTeacher.value!.id);
  if (typeof response === "number") {
    router.push({ path: 'success' })
  } else {
    alert("Fehler beim Erstellen des Trainings");
  }

};

onMounted(async () => {
  trainingTypes.value = await getTrainingTypes();
  categorys.value = await getTrainingCategory();
  teachers.value = await getUser(2);
});
</script>
