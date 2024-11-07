<template>
  <footer>
    <div class="mx-auto max-w-7xl pb-6 pt-6 md:pt-none">
      <div class="md:flex md:items-center md:justify-between mb-5">
        <div class="flex justify-center space-x-6 md:order-2">
          <a v-for="item in navigation" :key="item.name" v-bind="{ href: item.href }" target="_blank"
            rel="noopener noreferrer" class="text-gray-400 hover:text-gray-500">
            <span class="sr-only">{{ item.name }}</span>
            <component :is="item.icon" class="h-6 w-6" />
          </a>
        </div>
        <div class="mt-8 md:order-1 md:mt-0">
          <p class="text-center text-xs leading-5 text-gray-500">&copy; 2024 SV Gruppe. All rights
            reserved.</p>
        </div>
      </div>
      <div v-if="region === 'nk'">
        <p class=" text-xs leading-5 text-gray-500">
          Alle Preise jeweils zzgl. MwSt. Es gelten die allgemeinen Geschäftsbedingungen sowie die aktuelle Preisliste
          der Nordkurier Mediengruppe GmbH & Co. KG.
          1.)Grundpreise für Werbeagenturen und Unternehmen, die außerhalb des Verbreitungsgebiets Nordkurier ansässig
          sind.
          2.) Ortspreise für Unternehmen, die im Verbreitungsgebiet des Nordkurier ansässig sind.
          Gerne gestalten oder bearbeiten wir Ihre Anzeige für nur 39,- € zzgl. MwSt. (Gilt nicht für private
          Kleinanzeigen, Traueranzeigen und Danksagungen,
          sowie Wiederholer ohne Änderungen oder Vollvorlagen.)
          Nähere Informationen finden Sie in der aktuell gültigen
          <a class=" text-xs leading-5 text-gray-800"
          href="https://www.nordkurier-mediengruppe.de/geschaeftsfelder/medien/">Preisliste</a>
        </p>
      </div>
      <div v-else>
        <p class=" text-xs leading-5 text-gray-500">
          Alle Preise jeweils zzgl. MwSt. Es gelten die allgemeinen Geschäftsbedingungen sowie die aktuelle Preisliste
          der
          Schwäbischer Verlag GmbH & Co. KG Drexler, Gessler.
          1.) Grundpreise für Werbeagenturen und Unternehmen, die außerhalb des Verbreitungsgebiets Schwäbische Zeitung
          ansässig sind
          2.) Direktpreise für Unternehmen, die im Verbreitungsgebiet Schwäbische Zeitung ansässig sind
          Gerne gestalten oder bearbeiten wir Ihre Anzeige für nur 39,- € zzgl. MwSt. (Gilt nicht für private
          Kleinanzeigen,
          Traueranzeigen und Danksagungen,
          sowie Wiederholer ohne Änderungen oder Vollvorlagen.)
          Nähere Informationen finden Sie in der aktuell gültigen
          <a class=" text-xs leading-5 text-gray-500"
          href="https://www.schwaebisch-media.de/geschaeftsfelder/medien/">Preisliste</a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { defineComponent, h, ref } from 'vue'
import store from "@/store";

const region = ref(store.getters.user.region);


const navigation = [
  {
    name: 'Schwäbische',
    href: 'https://www.schwaebische.de/',
    icon: defineComponent({
      render: () =>
        h('svg', { fill: 'currentColor', viewBox: '0 0 108 108' }, [
          h('path', { d: 'M75.4918 18L96.6554 30L75.4918 42L54.3281 30L75.4918 18Z', fill: '#bbbbbb' }),
          h('path', { d: 'M75.4918 42L96.6554 54L75.4918 66L54.3281 54L75.4918 42Z', fill: '#777777' }),
          h('path', { d: 'M75.4918 66L96.6554 78L75.4918 90L54.3281 78L75.4918 66Z', fill: '#bbbbbb' }),
          h('path', { d: 'M33.1636 18L54.3273 30L33.1636 42L12 30L33.1636 18Z', fill: '#bbbbbb' }),
          h('path', { d: 'M54.3277 6L75.4913 18L54.3277 30L33.1641 18L54.3277 6Z', fill: '#C0C0C0' }),
          h('path', { d: 'M33.1636 42L54.3273 54L33.1636 66L12 54L33.1636 42Z', fill: '#777777' }),
          h('path', { d: 'M54.3277 54L33.1641 42L54.3277 30V54Z', fill: '#777777' }),
          h('path', { d: 'M96.6558 78L75.4922 66L96.6558 54V78Z', fill: '#C0C0C0' }),
          h('path', { d: 'M96.6558 54L75.4922 42L96.6558 30V54Z', fill: '#777777' }),
          h('path', { d: 'M96.6558 30L75.4922 18L96.6558 6V30Z', fill: '#bbbbbb' }),
          h('path', { d: 'M12 78L33.1636 66L12 54V78Z', fill: '#777777' }),
          h('path', { d: 'M12 54L33.1636 42L12 30V54Z', fill: '#777777' }),
          h('path', { d: 'M12 30L33.1636 18L12 6V30Z', fill: '#C0C0C0' }),
          h('path', { d: 'M54.3281 54L75.4918 42L54.3281 30V54Z', fill: '#777777' }),
          h('path', { d: 'M54.3277 78L33.1641 66L54.3277 54V78Z', fill: '#777777' }),
          h('path', { d: 'M54.3281 78L75.4918 66L54.3281 54V78Z', fill: '#777777' }),
          h('path', { d: 'M33.1636 66L54.3273 78L33.1636 90L12 78L33.1636 66Z', fill: '#bbbbbb' }),
          h('path', { d: 'M54.3277 78L75.4913 90L54.3277 102L33.1641 90L54.3277 78Z', fill: '#C0C0C0' }),
        ]),
    }),
  },
  {
    name: 'Nordkurier',
    href: 'https://www.nordkurier.de/',
    icon: defineComponent({
      render: () =>
        h('svg', { fill: 'currentColor', viewBox: '0 0 108 108' }, [
          h('path', {
            d: 'M0 26.915H107.965V35.6815H4.9749C3.95989 34.2591 3.38292 33.4478 2.50333 31.9241C1.42121 30.0283 0.811295 28.9462 0 26.915ZM8.69813 41.9081C9.98513 43.9723 10.8647 45.0556 12.4214 46.9172C14.2147 49.0155 15.3322 50.1317 17.3975 51.9262H108V41.9081H8.69813ZM23.5899 58.1882C25.8224 60.3536 27.2449 61.4027 29.7835 63.1972C32.9981 65.4651 34.928 66.5142 38.4817 68.2063H107.966V58.1894L23.5899 58.1882ZM52.1548 74.4329C58.6534 77.5133 62.5121 79.0016 69.517 80.6949C76.6244 82.4211 80.8221 83.0981 88.132 83.1994H108V74.4659H52.1548V74.4329Z',
          }),
        ]),
    }),
  }
]
</script>