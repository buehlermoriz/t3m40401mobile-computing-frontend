<template>
  <div v-if="month">
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
          <div>D</div>
          <div>M</div>
          <div>D</div>
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
              day.isToday && !day.isSelected && 'font-semibold text-secondary',
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
                day.hasEvent && 'font-semibold text-secondary',
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
          <div class="flex-auto" @click.prevent="openTraining(training)">
            <h3 class="pr-10 font-semibold text-gray-900 xl:pr-0">
              {{ training.type.name }}
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
                      new Date(training.blocks[0].start).toLocaleDateString("de-DE")
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
                <dd>{{ training.type.category.name}}</dd>
              </div>
            </dl>
          </div>
          <EventOverlay
    v-if="dialogTraining"
    :open="dialogOpen"
    :training="dialogTraining"
    @close="closeTraining"
  /> 
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
  TagIcon,
} from "@heroicons/vue/20/solid";
import { ref, onMounted } from "vue";
import { getMonth } from "@/services/CallendarService";
import {
  getTrainingBlocks,
  getTrainings,
} from "@/services/DbConnector";
import DynamicLoader from "@/components/DynamicLoader.vue";
import  EventOverlay  from '@/components/EventOverlay.vue'

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
const dialogTraining = ref(null);
const dialogOpen = ref(false);

const openTraining = (training) => {
  dialogTraining.value = training;
  dialogOpen.value = true;
};
const closeTraining = () => {
  dialogTraining.value = null;
  dialogOpen.value = false;
};
const loadMonth = async () => {
  eventDates.value.clear();

  const allTrainings = await getTrainings();

  const trainingsInCurrentMonth = [];

  const currentYear = selectedYear.value;
  const currentMonth = selectedMonth.value; // 0-based index

  allTrainings.forEach((training) => {
    let hasBlockInCurrentMonth = false;

    training.blocks.forEach((block) => {
      const startDate = new Date(block.start);
      const endDate = new Date(block.end);

      // Check if the block is in the current month
      if (
        (startDate.getFullYear() === currentYear && startDate.getMonth() === currentMonth) ||
        (endDate.getFullYear() === currentYear && endDate.getMonth() === currentMonth) ||
        (startDate < new Date(currentYear, currentMonth + 1, 0) && endDate > new Date(currentYear, currentMonth, 1))
      ) {
        hasBlockInCurrentMonth = true;

        // Generate all dates within the block
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          if (
            currentDate.getFullYear() === currentYear &&
            currentDate.getMonth() === currentMonth
          ) {
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            const dateString = `${year}-${month}-${day}`;
            eventDates.value.add(dateString);
          }
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    });

    if (hasBlockInCurrentMonth) {
      trainingsInCurrentMonth.push(training);
    }
  });

  // Sort trainings by the start date of their first block
  trainingsInCurrentMonth.sort((a, b) => {
    const dateA = new Date(a.blocks[0].start);
    const dateB = new Date(b.blocks[0].start);
    return dateA - dateB;
  });

  // Assign the sorted trainings to trainings.value
  trainings.value = trainingsInCurrentMonth;

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