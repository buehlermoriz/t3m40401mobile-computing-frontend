<!-- YearCallendar.vue -->
<template>
  <div>
    <div class="bg-white">
      <div
        class="mx-auto grid max-w-3xl grid-cols-1 gap-x-8 gap-y-16 px-4 py-16 sm:grid-cols-2 sm:px-6 xl:max-w-none xl:grid-cols-3 xl:px-8 2xl:grid-cols-4"
      >
        <section v-for="(month, monthIndex) in months" :key="month.name" class="text-center">
          <h2 class="text-sm font-semibold text-gray-900">{{ month.name }}</h2>
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
              @click="emitDate(day.date, monthIndex)"
              type="button"
              :class="[
                day.isCurrentMonth
                  ? 'bg-white text-gray-900'
                  : 'bg-gray-50 text-gray-400',
                dayIdx === 0 && 'rounded-tl-lg',
                dayIdx === 6 && 'rounded-tr-lg',
                dayIdx === month.days.length - 7 && 'rounded-bl-lg',
                dayIdx === month.days.length - 1 && 'rounded-br-lg',
                'py-1.5 hover:bg-gray-100 focus:z-10',
              ]"
            >
              <time
                :datetime="day.date"
                :class="[
                  day.isToday && 'bg-primary font-semibold text-white',
                  day.hasEvent && 'text-primary',
                  'mx-auto flex h-7 w-7 items-center justify-center rounded-full',
                ]"
              >
                {{ day.date.split("-").pop().replace(/^0/, "") }}
              </time>
            </button>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<!-- YearCallendar.vue -->
<script setup>
import { getYear } from "@/services/CallendarService";
import { onMounted, ref, watch, defineEmits } from "vue";
import { getTrainingBlocks } from "@/services/DbConnector";

const props = defineProps({
  selectedYear: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["dateSelected"]);

const months = ref([]);

const emitDate = (day, monthIndex) => {
  const dayOfDate = day.split("-").pop().replace(/^0/, "");
  emit("dateSelected", { dayOfDate, monthIndex });
}

const loadYear = async () => {
  // Fetch training blocks
  const trainingBlocks = await getTrainingBlocks();

  // Create a Set of event dates
  const eventDatesSet = new Set();

  trainingBlocks.forEach((block) => {
    const start = new Date(block.start);
    const end = new Date(block.end);

    // Normalize time to midnight for date comparison
    const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dateString = date.toISOString().split('T')[0]; // 'YYYY-MM-DD' format
      eventDatesSet.add(dateString);
    }
  });

  months.value = getYear(props.selectedYear, eventDatesSet);
};

onMounted(() => {
  loadYear();
});

watch(
  () => props.selectedYear,
  () => {
    loadYear();
  }
);
</script>
