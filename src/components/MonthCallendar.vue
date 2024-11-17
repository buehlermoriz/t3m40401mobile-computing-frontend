<template>
  <div v-if="month">
    <h2 class="text-base font-semibold text-gray-900">
      Upcoming Trainings
    </h2>
    <div class="lg:grid lg:grid-cols-12 lg:gap-x-16">
      <div
        class="mt-10 text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:mt-9 xl:col-start-9"
      >
        <div class="flex items-center text-gray-900">
          <button
            type="button"
            @click="prevMonth"
            class="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
          >
            <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
          </button>
          <div class="flex-auto text-sm font-semibold">{{ month.name }}</div>
          <button
            type="button"
            @click="nextMonth"
            class="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
          >
            <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div class="mt-6 grid grid-cols-7 text-xs/6 text-gray-500">
          <div>M</div>
          <div>T</div>
          <div>W</div>
          <div>T</div>
          <div>F</div>
          <div>S</div>
          <div>S</div>
        </div>
        <div
          class="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200"
        >
          <button
            v-for="(day, dayIdx) in month.days"
            :key="day.date"
            type="button"
            :class="[
              'py-1.5 hover:bg-gray-100 focus:z-10',
              day.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
              (day.isSelected || day.isToday) && 'font-semibold',
              day.isSelected && 'text-white',
              !day.isSelected &&
                day.isCurrentMonth &&
                !day.isToday &&
                'text-gray-900',
              !day.isSelected &&
                !day.isCurrentMonth &&
                !day.isToday &&
                'text-gray-400',
              day.isToday && !day.isSelected && 'text-primary',
              dayIdx === 0 && 'rounded-tl-lg',
              dayIdx === 6 && 'rounded-tr-lg',
              dayIdx === month.days.length - 7 && 'rounded-bl-lg',
              dayIdx === month.days.length - 1 && 'rounded-br-lg',
            ]"
          >
            <time
              :datetime="day.date"
              :class="[
                'mx-auto flex h-7 w-7 items-center justify-center rounded-full',
                day.isToday && 'bg-primary font-semibold text-white',
                day.isSelected && !day.isToday && 'bg-gray-900 text-white',
                day.hasEvent && 'text-primary',
              ]"
            >
              {{ day.date.split("-").pop().replace(/^0/, "") }}
            </time>
          </button>
        </div>
      </div>
      <ol
        class="mt-4 divide-y divide-gray-100 text-sm/6 lg:col-span-7 xl:col-span-8"
      >
        <li
          v-for="training in trainings"
          :key="training.name"
          class="relative flex space-x-6 py-6 xl:static"
        >
          <div class="flex-auto">
            <h3 class="pr-10 font-semibold text-gray-900 xl:pr-0">
              {{ training.name }}
            </h3>
            <dl class="mt-2 flex flex-col text-gray-500 xl:flex-row">
              <div class="flex items-start space-x-3">
                <dt class="mt-0.5">
                  <CalendarIcon
                    class="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </dt>
                <dd>
                  <time :datetime="training.datetime"
                    >Start:
                    {{
                      new Date(training.start).toLocaleDateString("de-DE")
                    }}</time
                  >
                </dd>
              </div>
              <div
                class="mt-2 flex items-start space-x-3 xl:ml-3.5 xl:mt-0 xl:border-l xl:border-gray-400 xl:border-opacity-50 xl:pl-3.5"
              >
                <dt class="mt-0.5">
                  <TagIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                </dt>
                <dd>{{ training.category }}</dd>
              </div>
            </dl>
          </div>
          <Menu
            as="div"
            class="absolute right-0 top-6 xl:relative xl:right-auto xl:top-auto xl:self-center"
          >
            <div>
              <MenuButton
                class="-m-2 flex items-center rounded-full p-2 text-gray-500 hover:text-gray-600"
              >
                <EllipsisHorizontalIcon class="h-5 w-5" aria-hidden="true" />
              </MenuButton>
            </div>

            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems
                class="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <div class="py-1">
                  <MenuItem v-slot="{ active }">
                    <a
                      href="#"
                      :class="[
                        active
                          ? 'bg-gray-100 text-gray-900 outline-none'
                          : 'text-gray-700',
                        'block px-4 py-2 text-sm',
                      ]"
                      >Edit</a
                    >
                  </MenuItem>
                  <MenuItem v-slot="{ active }">
                    <a
                      href="#"
                      :class="[
                        active
                          ? 'bg-gray-100 text-gray-900 outline-none'
                          : 'text-gray-700',
                        'block px-4 py-2 text-sm',
                      ]"
                      >Cancel</a
                    >
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>
        </li>
      </ol>
      <div
        v-if="!trainingsLoaded"
        class="lg:col-span-7 xl:col-span-8 flex items-center justify-center"
      >
        <DynamicLoader />
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
  TagIcon,
} from "@heroicons/vue/20/solid";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ref, onMounted } from "vue";
import { getMonth } from "@/services/CallendarService";
import {
  getTrainingBlocks,
  getTrainings,
  getTrainingTypes,
  getTrainingCategory,
} from "@/services/DbConnector";
import DynamicLoader from "@/components/DynamicLoader.vue";

// If you still need to receive initial values from props
const props = defineProps({
  selectedYear: {
    type: Number,
    required: false,
    default: new Date().getFullYear(),
  },
  selectedMonth: {
    type: Number,
    required: false,
    default: new Date().getMonth(),
  },
});

// Initialize local reactive variables
const selectedYear = ref(props.selectedYear);
const selectedMonth = ref(props.selectedMonth);

const month = ref();
const eventDates = ref(new Set());
const trainings = ref([]);
const trainingsLoaded = ref(false);

const loadMonth = async () => {
  eventDates.value.clear();
  trainings.value = [];

  const trainingBlockIdsInCurrentMonth = new Set();
  const collectedTrainingIds = new Set();
  const collectedTrainings = [];
  const loadedTrainingTypes = new Map();
  const loadedCategories = new Map();

  const trainingBlocks = await getTrainingBlocks();

  // Collect trainingBlock IDs in the current month
  trainingBlocks.forEach((block) => {
    const startDate = new Date(block.start);
    const endDate = new Date(block.end);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    let blockHasDateInCurrentMonth = false;

    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      if (
        date.getFullYear() === selectedYear.value &&
        date.getMonth() === selectedMonth.value
      ) {
        eventDates.value.add(date.toISOString().split("T")[0]);
        blockHasDateInCurrentMonth = true;
      }
    }

    if (blockHasDateInCurrentMonth) {
      trainingBlockIdsInCurrentMonth.add(block.id);
    }
  });

  // Fetch trainings associated with the training blocks
  for (const blockId of trainingBlockIdsInCurrentMonth) {
    const trainingList = await getTrainings(blockId);

    trainingList.forEach((training) => {
      if (!collectedTrainingIds.has(training.id)) {
        collectedTrainingIds.add(training.id);
        collectedTrainings.push(training);
      }
    });
  }

  // Build trainings array
  for (const training of collectedTrainings) {
    // Fetch trainingType
    let trainingType;
    if (loadedTrainingTypes.has(training.type)) {
      trainingType = loadedTrainingTypes.get(training.type);
    } else {
      const trainingTypeList = await getTrainingTypes(training.type);
      trainingType = trainingTypeList[0];
      loadedTrainingTypes.set(training.type, trainingType);
    }

    // Fetch category
    let category;
    if (loadedCategories.has(trainingType.category)) {
      category = loadedCategories.get(trainingType.category);
    } else {
      const categoryList = await getTrainingCategory(trainingType.category);
      category = categoryList[0];
      loadedCategories.set(trainingType.category, category);
    }

    // Find earliest time block start
    let earliestBlockStart = null;
    training.blocks.forEach((blockId) => {
      const block = trainingBlocks.find((b) => b.id === blockId);
      if (block) {
        const blockStart = new Date(block.start);
        if (!earliestBlockStart || blockStart < earliestBlockStart) {
          earliestBlockStart = blockStart;
        }
      }
    });

    trainings.value.push({
      id: training.id,
      start: earliestBlockStart ? earliestBlockStart.toISOString() : "",
      name: trainingType.name,
      category: category.name,
    });
  }

  month.value = getMonth(selectedYear.value, selectedMonth.value, eventDates.value);
  trainingsLoaded.value = true;
};

const prevMonth = () => {
  if (selectedMonth.value === 0) {
    selectedMonth.value = 11;
    selectedYear.value -= 1;
  } else {
    selectedMonth.value -= 1;
  }
  trainingsLoaded.value = false;
  loadMonth();
};

const nextMonth = () => {
  if (selectedMonth.value === 11) {
    selectedMonth.value = 0;
    selectedYear.value += 1;
  } else {
    selectedMonth.value += 1;
  }
  trainingsLoaded.value = false;
  loadMonth();
};

onMounted(() => {
  loadMonth();
});
</script>