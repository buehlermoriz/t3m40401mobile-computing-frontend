<template>
    <h2 class="text-base font-semibold text-gray-900">Ihre Kurse</h2>
  <p class="mt-1 text-sm/6 text-gray-600">
    In der folgenden Übersicht finden Sie alle Kurse, an denen Sie teilnehmen.
  </p>
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
              <CalendarIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
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
            <dd>{{ training.type.category.name }}</dd>
          </div>
        </dl>
      </div>
      <div class="flex gap-x-2 items-center">
        <button v-if="userRole>1" @click="editTraining(training.id)">
          <PencilSquareIcon class="h-5 text-primary"></PencilSquareIcon>
        </button>
        <button v-if="userRole>1" @click="deleteTraining(training.id)">
          <TrashIcon class="h-5 text-red-500"></TrashIcon>
        </button>
        <button v-if="userRole===1" @click="signOut(training.id)">
          <UserMinusIcon class="h-5 text-red-500"></UserMinusIcon>
        </button>
      </div>
      <EventOverlay
    v-if="dialogTraining"
    :open="dialogOpen"
    :training="dialogTraining"
    @close="closeTraining"
  />  </li>
  </ol>
  <div
    v-if="!trainingsLoaded"
    class="lg:col-span-7 xl:col-span-8 flex items-center justify-center"
  ></div>
  <div v-if="noEvents" class="flex flex-col items-center justify-center my-36">
    <p class="text-xl font-semibold mb-4">
      Keine Events für diese User vorhanden!
    </p>
    <video
      src="../assets/empty.mp4"
      autoplay
      muted
      loop
      class="mb-8 w-36 max-w-sm"
    ></video>
    <button
    v-if="userRole > 1"
      @click="router.push({ path: '/new-event' })"
      class="w-full flex justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
    >
      Event anlegen
    </button>
    <button
    v-if="userRole === 1"
      @click="router.push({ path: '/' })"
      class="w-full flex justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
    >
      Zur Startseite
    </button>
  </div>
</template>
<script setup>
import { CalendarIcon, TagIcon, TrashIcon, PencilSquareIcon } from "@heroicons/vue/20/solid";
import { ref, computed, onMounted } from "vue";
import store from "@/store";
import { getTrainings, deleteEvent, patchTraining } from "@/services/DbConnector";
import { useRouter } from "vue-router";
import  EventOverlay  from '@/components/EventOverlay.vue'
import { UserMinusIcon } from "@heroicons/vue/24/outline";

const router = useRouter();

const middlewareUserId = computed(
  () => store.getters.user.data?.middlewareUserId
);
const userRole = computed(() => store.getters.user.data?.middlewareUserRoleId ?? 1);

const trainings = ref([]);
const trainingsLoaded = ref(false);
const noEvents = ref(false);
const dialogTraining = ref(null);
const dialogOpen = ref(false);

const deleteTraining = async (id) => {
  await deleteEvent(id);
  trainings.value = trainings.value.filter((training) => training.id !== id);
};

const editTraining = (trainingId) => {
  router.push({ name: 'new Event', params: { trainingId } });
};

const openTraining = (training) => {
  dialogTraining.value = training;
  dialogOpen.value = true;
};
const closeTraining = () => {
  dialogTraining.value = null;
  dialogOpen.value = false;
};

onMounted(async () => {
  if (middlewareUserId.value) {
    trainings.value = await getTrainings(middlewareUserId.value);
    if (trainings.value.length === 0) {
      noEvents.value = true;
    }
  } else {
    noEvents.value = true;
  }
  trainingsLoaded.value = true;
});

const signOut = async (trainingId) => {
  const training = trainings.value.find((training) => training.id === trainingId);
  // Remove the user ID from participants
  const newParticipants = training.participants.filter(
    (id) => id !== middlewareUserId.value
  );
  await patchTraining(trainingId, { participants: newParticipants });
  //remove training from list
  trainings.value = trainings.value.filter((training) => training.id !== trainingId);
};
</script>
