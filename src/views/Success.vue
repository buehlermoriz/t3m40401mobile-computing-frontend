<template>
  <div class="flex flex-col items-center justify-center my-36">
    <p class="text-xl font-semibold mb-4">Training was created successfully!</p>
    <video
      src="../assets/success.webm"
      autoplay
      muted
      class="mb-8 w-36 max-w-sm"
    ></video>
    <button
      @click="router.push({ path: '/' })"
      class="w-full flex justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
    >
      Back Home
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
</script>