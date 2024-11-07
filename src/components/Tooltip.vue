<template>
  <div class="relative flex items-center" @mouseenter="show = true" @mouseleave="show = false">
    <slot></slot>
    <div
      v-if="show"
      class="absolute z-10 p-2 font-normal text-sm text-white bg-gray-700 rounded shadow-lg max-w-96 text-wrap transition-opacity duration-200 opacity-0"
      :class="[tooltipClasses, { 'opacity-100': show, 'opacity-0': !show }]"
      role="tooltip"
    >
      {{ text }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue';

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    default: 'top',
  },
});

const show = ref(false);
const tooltipClasses = computed(() => {
  switch (props.position) {
    case 'top':
      return 'bottom-full mb-2';
    case 'bottom':
      return 'top-full mt-2';
    case 'left':
      return 'right-full mr-2';
    case 'right':
      return 'left-full ml-2';
    default:
      return 'bottom-full mb-2';
  }
});
</script>
