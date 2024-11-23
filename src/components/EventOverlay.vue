<template>
  <TransitionRoot as="template" :show="props.open">
    <Dialog class="relative z-10">
      <TransitionChild
        as="template"
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
              <div class="py-5 flex">
                <XMarkIcon
                  class="ml-auto h-6 w-6 text-gray-400"
                  aria-hidden="true"
                  @click="emits('close')"
                />
              </div>
              <!-- Main -->
              <div>
                <div class="pb-1 sm:pb-6">
                  <div>
                    <div class="relative h-40 sm:h-56">
                      <img
                        class="absolute size-full object-cover rounded-md"
                        src="https://picsum.photos/800/600"
                        alt=""
                      />
                    </div>
                    <div class="mt-6 px-4 sm:mt-8 sm:flex sm:items-end sm:px-6">
                      <div class="sm:flex-1">
                        <div>
                          <h3
                            class="text-xl font-bold text-gray-900 sm:text-2xl"
                          >
                            Kurs {{ training.type.name }}
                          </h3>
                          <p class="text-sm text-gray-500">
                            {{ training.type.category.name }}
                          </p>
                        </div>
                        <div v-if="userRole === 1">
                          <div
                            v-if="!signedUp"
                            class="mt-5 flex justify-between items-center"
                          >
                            <div>
                              <p :key="participants" :class="trainingFull ? 'text-red-500' : ''">
                                Teilnehmer: {{ participants }} /
                                {{ training.type.maxParticipants }}
                              </p>
                            </div>
                            <button
                              type="button"
                                @click="signUp"
                              :disabled="trainingFull"
                              :class="[
                                'items-center justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm',
                                trainingFull
                                  ? 'bg-gray-400 text-white cursor-not-allowed'
                                  : 'bg-primary text-white',
                              ]"
                            >
                              Anmelden
                            </button>
                          </div>
                          <div
                            v-if="signedUp"
                            class="mt-5 flex justify-between items-center"
                          >
                            <div :class="trainingFull ? 'text-red-500' : ''">
                              <p>
                                Teilnehmer: {{ participants }} /
                                {{ training.type.maxParticipants }}
                              </p>
                              <p class="text-gray-400">
                                Du bist angemeldet
                                <span
                                  class="animate-pulse ml-2.5 inline-block size-2 shrink-0 rounded-full bg-green-400"
                                >
                                </span>
                              </p>
                            </div>

                            <button
                              type="button"
                                @click="signOut"
                              class="items-center justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm bg-primary text-white"
                            >
                              Abmelden
                            </button>
                          </div>
                        </div>
                        <div v-if="userRole === 2">
                          <div
                            v-if="!signedUp"
                            class="mt-5 flex justify-between items-center"
                          >
                            <div>
                              <p :class="trainingFull ? 'text-red-500' : ''">
                                Teilnehmer: {{ participants }} /
                                {{ training.type.maxParticipants }}
                              </p>
                            </div>
                            <button @click="deleteTraining(training.id)">
                              <TrashIcon class="h-5 text-red-500"></TrashIcon>
                            </button>
                          </div>
                          <div
                            v-if="signedUp"
                            class="mt-5 flex justify-between items-center"
                          >
                            <div :class="trainingFull ? 'text-red-500' : ''">
                              <p>
                                Teilnehmer: {{ participants }} /
                                {{ training.type.maxParticipants }}
                              </p>
                              <p class="text-gray-400">
                                Sie dozieren diesen Kurs
                                <span
                                  class="animate-pulse ml-2.5 inline-block size-2 shrink-0 rounded-full bg-green-400"
                                >
                                </span>
                              </p>
                            </div>
                            <button @click="deleteTraining(training.id)">
                              <TrashIcon class="h-5 text-red-500"></TrashIcon>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="px-4 pb-5 pt-5 sm:px-0 sm:pt-0">
                  <dl class="space-y-8 px-4 sm:space-y-6 sm:px-6">
                    <div>
                      <dt
                        class="text-sm font-medium text-gray-500 sm:w-40 sm:shrink-0"
                      >
                        Kursbeschreibung
                      </dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2">
                        <p>{{ training.type.description }}</p>
                      </dd>
                    </div>
                    <div>
                      <dt
                        class="text-sm font-medium text-gray-500 sm:w-40 sm:shrink-0"
                      >
                        Details
                      </dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2">
                        {{ training.notes }}
                      </dd>
                    </div>
                    <div>
                      <dt
                        class="text-sm font-medium text-gray-500 sm:w-40 sm:shrink-0"
                      >
                        Vorraussetzungen
                      </dt>
                      <dd class="mt-1 text-sm text-gray-900 sm:col-span-2">
                        {{ training.type.requirements }}
                      </dd>
                    </div>
                  </dl>
                </div>
                <section class="mt-12">
                  <h2 class="text-base font-semibold text-gray-900">
                    Verasntailtungstage
                  </h2>
                  <ol
                    class="mt-2 divide-y divide-gray-200 text-sm/6 text-gray-500"
                  >
                    <li
                      v-for="(timeblock, index) in training.blocks"
                      class="py-4 flex gap-x-5"
                    >
                      <p>Block {{ index + 1 }}</p>
                      <div class="flex gap-x-1">
                        <time>{{
                          new Date(timeblock.start).toLocaleString("de-DE", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        }}</time>
                        <p> bis </p> 
                        <time>{{
                          new Date(timeblock.end).toLocaleString("de-DE", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        }}</time>
                      </div>
                    </li>
                  </ol>
                </section>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { defineProps, defineEmits, computed } from "vue";
import { TransitionRoot, TransitionChild } from "@headlessui/vue";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/vue";
import { XMarkIcon, TrashIcon } from "@heroicons/vue/20/solid";
import {deleteEvent, patchTraining} from "@/services/DbConnector";
import store from "@/store";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  training: {
    type: Object,
    required: true,
  },
  open: {
    type: Boolean,
    required: true,
  },
});
const emits = defineEmits(["close"]);

const signedUp = ref(false);

const participants = ref(props.training.participants.length);

const trainingFull = computed(() => {
  return participants.value >= props.training.type.maxParticipants;
});

const middlewareUserId = computed(
  () => store.getters.user.data?.middlewareUserId
);
const userRole = computed(() => store.getters.user.data?.middlewareUserRoleId);

onMounted(() => {
  signedUp.value = props.training.participants.includes(middlewareUserId.value);
});

const deleteTraining = async (id) => {
  await deleteEvent(id);
  router.push({ path: "/" });
};

const signUp = async () => {
  const newParticipants = [...props.training.participants, middlewareUserId.value];
  await patchTraining(props.training.id, { participants: newParticipants });
  participants.value++;
  signedUp.value = true;
};

const signOut = async () => {
  const newParticipants = props.training.participants.filter((id) => id !== middlewareUserId.value);
  await patchTraining(props.training.id, { participants: newParticipants });
  participants.value--;
  signedUp.value = false;
};
</script>
