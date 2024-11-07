<script setup lang="ts">
import { RouterView } from "vue-router";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import store from "@/store";
import {ref} from "vue"


</script>

<style lang="scss">
@import "./assets/main.css";

</style>

<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />
  <div class="px-4 md:px-8  2xl:px-40">
      <RouterView/>
    </div>
  <Footer class="mt-auto"/>
</div>
</template>
<style>
#bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -10;
}
</style>
