<template>
  <div class="flex flex-col items-center justify-center my-36">
    <p class="text-xl font-semibold mb-4">Der Kurs wurde erfolgreich angelegt!</p>
    <!-- PROBLEM: Darstellung auf unterschiedlichen Systemen -->
    <video
      src="../assets/success.mp4"
      autoplay
      muted
      playsinline
      class="mb-8 w-36 max-w-sm"
    ></video>
    <!-- webm funktioniert auf IOS Mobile nicht - MOV hatten wir Probleme bei Android. Videos wurden fullscreen geöffnet usw. -->
    <button
      @click="router.push({ path: '/' })"
      class="w-full flex justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
    >
      zur Startseite
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
</script>