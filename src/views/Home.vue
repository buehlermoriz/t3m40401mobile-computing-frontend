<script setup lang="ts">
// Imports ---------
import { computed, onMounted, ref, watch } from 'vue'
import { CheckIcon, ChevronUpDownIcon, TrashIcon } from '@heroicons/vue/20/solid'
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxLabel,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/vue'
import { getReach, getPrintModules, getDigitalModules } from "@/services/DbConnector";
import store from "@/store";
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import { MinusIcon, PlusIcon } from '@heroicons/vue/24/solid'
import Tooltip from '@/components/Tooltip.vue';


//Interfaces ---------
interface Issue {
  issue: string,
  name: string,
  copies: number,
  region: string
}

interface Order {
  issue: string;
  pModule: string;
  pPrice: number;
  pTkp: number;
  pReach: number;
  dModule: string;
  dPrice: number;
  dTkp: number;
  dReach: number;
  totalReach: number;
  totalPrice: number;
}

interface PModule {
  issue: string;
  module: string;
  local_price_mm: number,
  base_price_mm: number,
  cols: number,
  mm: number,
  local_price_total: number,
  base_price_total: number,
  min_d_module: string,
  region: string
}

interface DModule {
  digital_module: string;
  tkp: number;
}

const priceclass = ref<string>('base-price');
const orders = ref<Order[]>([]);
const issues = ref<Issue[]>([]);
const pModule = ref<PModule[]>([]);
const dModule = ref<DModule[]>([]);
const finalPrice = ref<number>(0);
const combiDiscount = ref<number>(0);
const displayIssueError = ref<boolean>(false);
const displayPModuleError = ref<boolean>(false);
const region = ref<string | undefined>(store.getters.user.region);
const isLoading = ref<boolean>(true);

//logic  ---------
//Validation logic
const focusPModule = () => {
  if (!selectedIssue.value) {
    displayIssueError.value = true;
  }
}
const focusDModule = () => {
  if (!selectedPModul.value) {
    displayPModuleError.value = true;
  }
  if (!selectedIssue.value) {
    displayIssueError.value = true;
  }
}
const blurPModule = () => {
  displayIssueError.value = false;
  queryPModul.value = ''
}
const blurDModule = () => {
  displayPModuleError.value = false;
  displayIssueError.value = false;
  queryDModul.value = ''
}

//logic ausgabe /Issue ---------
const queryIssue = ref('')
const selectedIssue = ref<Issue | null>(null)
const filteredIssues = computed<Issue[]>(() => {
  let filteredIssues = issues.value; // Start with all issues

  // Filter by region
  filteredIssues = filteredIssues.filter((issue) =>
    issue.region.toLowerCase() === region.value?.toLowerCase()
  );

  // Then filter by queryIssue
  if (queryIssue.value !== '') {
    filteredIssues = filteredIssues.filter((issue) =>
      issue.issue.toLowerCase().includes(queryIssue.value.toLowerCase()) ||
      issue.name.toLowerCase().includes(queryIssue.value.toLowerCase())
    );
  }

  return filteredIssues; // Return the filtered array
});

//logic pModule ---------
const queryPModul = ref('')
const selectedPModul = ref<PModule | null>(null)
const filteredPModules = computed<PModule[]>(() => {
  let modules = pModule.value;

  // Filter by selectedIssue if it's not null
  if (selectedIssue.value !== null) {
    modules = modules.filter((pModule) => {
      return pModule.issue === selectedIssue.value?.issue;
    });
  }

  // Then filter by queryPModul
  if (queryPModul.value !== '') {
    modules = modules.filter((pModule) => {
      return pModule.module.toLowerCase().includes(queryPModul.value.toLowerCase());
    });
  }

  return modules;
});

//logic dModule ---------
const queryDModul = ref('')
const selectedDModul = ref<DModule | null>(null)
const filteredDModules = computed<DModule[]>(() => {
  let modules = dModule.value;

  // Filter by selectedPModul's min_d_module's tkp
  if (selectedPModul.value !== null) {
    const minTkp = dModule.value.find(
      (d) => d.digital_module === selectedPModul.value?.min_d_module
    )?.tkp;

    if (minTkp !== undefined) {
      modules = modules.filter((dModule) => dModule.tkp >= minTkp);
    }
  }

  // Then filter by queryDModul
  if (queryDModul.value !== '') {
    modules = modules.filter((dModule) => {
      return dModule.digital_module.toLowerCase().includes(queryDModul.value.toLowerCase());
    });
  }

  return modules;
});
//select d Module according to min d Module on select p Module
watch(selectedPModul, () => {
  if (selectedPModul.value !== null) {
    selectedDModul.value = dModule.value.find((dModule) => dModule.digital_module === selectedPModul.value?.min_d_module) || null;
  }
})

//logic orders ---------
const addOrder = () => {
  let pPrice = 0
  let pTkp = 0
  const dPrice = selectedDModul.value?.tkp! * (selectedIssue.value?.copies! / 1000)

  if (priceclass.value === 'base-price') {
    //multipy * 0.8 for digital cupon
    pPrice = selectedPModul.value?.base_price_total! * 0.8
    pTkp = selectedPModul.value?.base_price_mm!
  }
  else {
    //multipy * 0.8 for digital cupon
    pPrice = selectedPModul.value?.local_price_total! * 0.8
    pTkp = selectedPModul.value?.local_price_mm!
  }

  const newOrder: Order = {
    issue: selectedIssue.value?.issue!,
    pModule: selectedPModul.value?.module!,
    pPrice: Math.round(pPrice * 100) / 100,
    pTkp: pTkp,
    pReach: selectedIssue.value?.copies!,
    dModule: selectedDModul.value?.digital_module!,
    dPrice: Math.round(dPrice * 100) / 100,
    dTkp: selectedDModul.value?.tkp!,
    dReach: selectedIssue.value?.copies!,
    totalReach: selectedIssue.value?.copies! * 2,
    totalPrice: Math.round((pPrice + dPrice) * 100) / 100
  };
  orders.value.push(newOrder);
  //new total Price
  calculateNewPrice()
}

const removeOrder = (index: number) => {
  orders.value.splice(index, 1);
  calculateNewPrice()
  //new total Price

}

const calculateNewPrice = () => {
  //new total Price
  let totalPrice = 0;
  orders.value.forEach((order) => {
    totalPrice += order.totalPrice;
  });
  finalPrice.value = totalPrice;

  //new combiDiscount
  if (orders.value.length > 1) {
    // Start with 10% discount
    combiDiscount.value = 0.1;
    // Add 5% for each additional order (starting from the 2nd)
    combiDiscount.value += Math.min((orders.value.length - 2) * 0.05, 0.4);
  }
}

//mount ---------
onMounted(async () => {
  issues.value = await getReach();
  pModule.value = await getPrintModules();
  dModule.value = await getDigitalModules();
  isLoading.value = false;
})

</script>
<template>
  <div v-if="isLoading" class="mb-5 flex items-center justify-center">
    <div v-if="region != 'nk'" class="loader"></div>
    <div v-else class="loader-nk"></div>
  </div>
  <div v-if="!isLoading" class="mb-5">
    <!-- Headline -->
    <div class="px-4 sm:px-6 lg:px-8 my-10">
      <h2 class="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">Preiskompass: Ihr Wegweiser zur
        perfekten Kombireichweite</h2>
      <div class="max-w-full divide-y divide-gray-900/10">
        <p class="mt-2 text-base/7 text-gray-600">
          Willkommen beim Preiskompass, unserem neuen Tool für die Erstellung und Berechnung optimaler Kombipakete aus
          Print- und Digital-Anzeigen.
          Ziel: Die Reichweite der gedruckten Produkte wird verknüpft mit der digitalen Reichweite der Portale!
          Der Preiskompass verknüpft unsere Reichweite der gedruckten Produkte mit der digitalen Reichweite unserer
          Online-Plattformen. Die Print- und Digitalreichweite (Daten aus der IVW) ergeben zusammen die
          Gesamtreichweite, welche dem Kunden angeboten wird. Zu jedem Printmodul gibt es passende digitale Module,
          welche dem Angebot hinzugefügt werden.
          Der Print TKP ist für jedes Modul in jeder Ausgabe fest definiert und ergibt sich aus dem mm-Preis der
          jeweiligen Ausgabe. </p>
        <dl class="mt-10 space-y-6 divide-y divide-gray-900/10">
          <!-- Funktionen -->
          <Disclosure as="div" class="pt-6" v-slot="{ open }">
            <dt>
              <DisclosureButton class="flex w-full items-start justify-between text-left text-gray-900">
                <span class="text-base/7 font-semibold">Funktionen des Preiskompass</span>
                <span class="ml-6 flex h-7 items-center">
                  <PlusIcon v-if="!open" class="h-6 w-6" aria-hidden="true" />
                  <MinusIcon v-else class="h-6 w-6" aria-hidden="true" />
                </span>
              </DisclosureButton>
            </dt>
            <DisclosurePanel as="dd" class="mt-2 pr-12">
              <div class="text-base/7 text-gray-600">
                <ol>
                  <li> <span class="font-semibold">1. Auswahl der gewünschten Ausgabe:</span>
                    Beginnen Sie, indem Sie die gewünschte Ausgabe für den Kunden auswählen.</li>
                  <li> <span class="font-semibold">2. Auswahl des Print-Moduls:</span>
                    Wählen Sie ein geeignetes Print-Modul aus. </li>
                  <li> <span class="font-semibold">3. Ergänzung durch das passende Digital-Modul:</span>
                    Nach Wahl des Print-Moduls schlägt Ihnen der Preiskompass automatisch passende digitale Module vor,
                    die sich optimal mit Ihrem Print-Modul kombinieren lassen. Diese Kombination sichert die maximale
                    Reichweite und Wirkung Ihrer Werbekampagne.
                  </li>

                  <li> <span class="font-semibold">4. Dynamische Preisberechnung:</span>
                    Sobald Sie die gewünschten Print- und Digital-Module ausgewählt haben, berechnet der Preiskompass
                    automatisch den Gesamtpreis. Die Berechnung erfolgt in Echtzeit und berücksichtigt Faktoren wie
                    Ausgabe, Belegung und Reichweite.</li>

                  <li> <span class="font-semibold">5. Hinzufügen:</span>
                    Nachdem die perfekte Kombination und der Preis ausgewählt wurden, können Sie das Kombipaket
                    hinzufügen. Der Preiskompass ermöglicht es Ihnen, mehrere Kombipakete zu erstellen und hinzuzufügen.
                    Hier findet der Kombirabatt nach Preisliste entsprechend Anwendung.</li>


                  <li> <span class="font-semibold">6. Benutzerfreundlichkeit und Effizienz:</span>
                    Unser Preiskompass ist benutzerfreundlich gestaltet und sorgt für einen schnellen und reibungslosen
                    Workflow. Die klar strukturierte Oberfläche leitet Sie durch den Auswahlprozess und stellt sicher,
                    dass Sie mit minimalem Aufwand die besten Angebote für Ihre Kunden zusammenstellen..</li>

                </ol>
                <p class="mt-3">

                  Nutzen Sie den Preiskompass, um Ihren Geschäftskunden maßgeschneiderte und effektive Anzeigenpakete
                  anzubieten. Erleben Sie, wie einfach und effizient die Erstellung und Verwaltung von
                  Kombireichweitenkampagnen sein kann und maximieren Sie den Erfolg Ihrer Verkaufsaktivitäten.
                </p>
              </div>
            </DisclosurePanel>
          </Disclosure>
          <!-- Warum Kombi-Reichweite? -->
          <Disclosure as="div" class="pt-6" v-slot="{ open }">
            <dt>
              <DisclosureButton class="flex w-full items-start justify-between text-left text-gray-900">
                <span class="text-base/7 font-semibold">Warum Kombi-Reichweite?</span>
                <span class="ml-6 flex h-7 items-center">
                  <PlusIcon v-if="!open" class="h-6 w-6" aria-hidden="true" />
                  <MinusIcon v-else class="h-6 w-6" aria-hidden="true" />
                </span>
              </DisclosureButton>
            </dt>
            <DisclosurePanel as="dd" class="mt-2 pr-12">
              <div class="text-base/7 text-gray-600">
                <p>In der heutigen Medienlandschaft ist es entscheidend, eine breite und vielfältige Zielgruppe zu
                  erreichen. Durch die Kombination der traditionellen Print-Reichweite mit der dynamischen und
                  zielgerichteten digitalen Reichweite bieten Sie Ihren Kunden ein unschlagbares Werbepaket. Hier sind
                  die Schlüsselvorteile:</p>
                <ol class="mt-3">
                  <li> <span class="font-semibold">1. Maximierte Reichweite:</span>
                    <ul>
                      <li><span class="font-semibold">Print:</span> Nutzen Sie die bestehende Leserschaft der Zeitung
                        und erreichen Sie eine treue und engagierte Leserschaft.</li>
                      <li><span class="font-semibold">Digital:</span> Erweitern Sie die Reichweite durch zielgerichtete
                        Anzeigen auf unseren Online-Plattformen und erreichen Sie eine noch breitere Audience.</li>
                    </ul>
                  </li>
                  <li> <span class="font-semibold">2. Erhöhte Aufmerksamkeit:</span>
                    <ul>
                      <li>Kombinierte Anzeigenstrategien steigern die Sichtbarkeit und Aufmerksamkeit Ihrer
                        Werbebotschaften.</li>
                    </ul>
                  </li>
                  <li> <span class="font-semibold">3. Kosten-Effizienz
                    </span>
                    <ul>
                      <li>Durch die Bündelung von Print- und Digital-Kampagnen bieten Sie Ihren Kunden kosteneffiziente
                        Werbelösungen.</li>
                      <li>Profitieren Sie von 20% Vorteilsrabatt auf den Printpreis durch die Kombi mit Digital.</li>
                    </ul>
                  </li>
                  <li> <span class="font-semibold">4. Maßgeschneiderte Werbung
                    </span>
                    <ul>
                      <li>Individuelle Zielgruppenansprache durch präzises Targeting im digitalen Bereich.</li>
                      <li>Nutzen Sie die spezifischen Stärken von Print und Digital für maßgeschneiderte und
                        wirkungsvolle Kampagnen.</li>
                    </ul>
                  </li>
                  <li class="mt-3"> <span class="font-semibold">Einfachheit der Nutzung
                    </span>
                    <p>Unsere benutzerfreundliche Weboberfläche ermöglicht es Ihnen, nahtlos zwischen Print und Digital
                      zu navigieren, Werbepakete zu erstellen und überzeugende Verkaufsargumente zu präsentieren. Hier
                      sind einige Features, die Ihnen den Alltag erleichtern:</p>
                    <ul class="mt-3">
                      <li> <span class="font-semibold">Einfache Kampagnenerstellung:</span> Intuitive Gestaltung und
                        sofortige Vorschau Ihrer Kombikampagnen.</li>
                      <li> <span class="font-semibold">Kundenspezifische Präsentationen:</span> Erstellen Sie
                        ansprechende Angebote und Präsentationen, die die Vorteile der Kombireichweite klar hervorheben.
                      </li>
                      <li> <span class="font-semibold">Echtzeit-Analysen und Berichte:</span> Verfolgen Sie die Leistung
                        Ihrer Kampagnen und passen Sie diese bei Bedarf an.</li>
                    </ul>
                  </li>
                </ol>
              </div>
            </DisclosurePanel>
          </Disclosure>
        </dl>
      </div>
    </div>
    <div class="mx-auto w-full my-5">

      <div class="px-4 sm:px-6 lg:px-8">

        <div class="mt-6 flex w-full gap-5">
          <!-- Form -->
          <div class="flex-1 ring-1 ring-gray-200 rounded-2xl sm:p-8 lg:mx-0 lg:py-8 xl:px-10">
            <form>
              <div class="space-y-12">
                <div class="border-b border-gray-900/10 pb-12">
                  <div class="flex gap-x-8">
                    <!-- Ausgabe -->
                    <Combobox class="flex-1 mt-10" as="div" v-model="selectedIssue"
                      @update:modelValue="queryIssue = ''">
                      <ComboboxLabel class="">Ausgabe
                      </ComboboxLabel>
                      <div class="relative mt-2">
                        <ComboboxInput
                          class="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary dark:focus:ring-color-nk sm:text-sm sm:leading-6"
                          @change="queryIssue = $event.target.value" @blur="queryIssue = ''"
                          :display-value="(issue) => ((issue as Issue)?.issue ? (issue as Issue)?.issue + ' - ' : '') + ((issue as Issue)?.name || '')" />
                        <ComboboxButton
                          class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                          <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </ComboboxButton>

                        <ComboboxOptions v-if="filteredIssues.length > 0"
                          class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                          <ComboboxOption v-for="(issue, index) in filteredIssues" :key="index" :value="issue"
                            as="template" v-slot="{ active, selected }">
                            <li
                              :class="['relative cursor-default select-none py-2 pl-8 pr-4', active ? 'bg-primary dark:bg-color-nk text-white' : 'text-gray-900']">
                              <span class="block truncate">
                                <span :class="{ 'font-semibold': selected }">{{ issue.issue }}</span>
                                <span :class="[active ? 'text-white' : 'text-gray-400']">{{ ' ' + issue.name }}</span>
                              </span>

                              <span v-if="selected"
                                :class="['absolute inset-y-0 left-0 flex items-center pl-1.5', active ? 'text-white' : 'text-primary dark:text-color-nk']">
                                <CheckIcon class="h-5 w-5" aria-hidden="true" />
                              </span>
                            </li>
                          </ComboboxOption>
                        </ComboboxOptions>
                      </div>
                      <p class="mt-1 text-sm leading-6 text-red-500" v-if="displayIssueError">Bitte füllen Sie dieses
                        Feld zuerst aus.</p>
                    </Combobox>
                    <!-- Preisklasse -->
                    <div class="mt-10 flex-1">
                      <span>Preisklasse</span>
                      <fieldset>
                        <div class="space-y-3">
                          <div class="flex items-center gap-x-3">
                            <input id="base-price" name="push-notifications" type="radio" v-model="priceclass"
                              value="base-price"
                              class="h-4 w-4 border-gray-300 text-primary dark:text-color-nk focus:ring-primary dark:focus:ring-color-nk" />
                            <Tooltip text="Für Preisregelung siehe unten" position="right">
                              <label for="base-price" class="block text-sm leading-6">
                                <span class="font-semibold text-gray-900">GP</span>
                                <span class="text-gray-400 font-normal">(Grundpreis)</span>
                              </label>
                            </Tooltip>
                          </div>
                          <div class="flex items-center gap-x-3">
                            <input id="local-price" name="push-notifications" type="radio" v-model="priceclass"
                              value="local-price"
                              class="h-4 w-4 border-gray-300 text-primary dark:text-color-nk focus:ring-primary dark:focus:ring-color-nk" />
                            <Tooltip text="Für Preisregelung siehe unten" position="right">
                              <label for="local-price" class="block text-sm leading-6">
                                <span class="font-semibold text-gray-900">OT</span>
                                <span class="text-gray-400 font-normal">(Ortspreis)</span>
                              </label>
                            </Tooltip>
                          </div>
                        </div>
                      </fieldset>
                    </div>
                  </div>
                </div>


                <div class="border-b border-gray-900/10 pb-12">
                  <h2 class="text-base font-semibold leading-7 text-gray-900">Module</h2>
                  <p class="mt-1 text-sm leading-6 text-gray-600">Welche Module sollen verwendet werden?
                  </p>
                  <!-- Printmodul -->
                  <Combobox class="flex-1 mt-10" as="div" v-model="selectedPModul"
                    @update:modelValue="queryPModul = ''">
                    <ComboboxLabel>
                      <Tooltip text="Definierte Festformate für die jeweilige Ausgabe." position="top">
                        <span class="text-gray-400 font-normal">print</span> <span
                          class="font-semibold text-gray-900">Modul</span>
                      </Tooltip>
                      <p class="mt-1 text-sm leading-6 text-gray-600">Je nach Ausgabe stehen unterschiedliche Module zur
                        Verfügung.</p>
                    </ComboboxLabel>
                    <div class="relative mt-2">
                      <ComboboxInput
                        class="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary dark:focus:ring-color-nk sm:text-sm sm:leading-6"
                        @change="queryPModul = $event.target.value"
                        :display-value="(pModule) => (pModule as PModule)?.module || ''" @blur="blurPModule"
                        @focus="focusPModule" :readonly="!selectedIssue" />
                      <ComboboxButton
                        class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                        <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </ComboboxButton>

                      <ComboboxOptions v-if="filteredPModules.length > 0 && selectedIssue"
                        class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        <ComboboxOption v-for="(pModule, index) in filteredPModules" :key="index" :value="pModule"
                          as="template" v-slot="{ active, selected }">
                          <li
                            :class="['relative cursor-default select-none py-2 pl-8 pr-4', active ? 'bg-primary dark:bg-color-nk text-white' : 'text-gray-900']">
                            <span :class="['block truncate', selected && 'font-semibold']">
                              {{ pModule.module }}
                            </span>

                            <span v-if="selected"
                              :class="['absolute inset-y-0 left-0 flex items-center pl-1.5', active ? 'text-white' : 'text-primary dark:text-color-nk']">
                              <CheckIcon class="h-5 w-5" aria-hidden="true" />
                            </span>
                          </li>
                        </ComboboxOption>
                      </ComboboxOptions>
                    </div>
                    <p class="mt-1 text-sm leading-6 text-red-500" v-if="displayPModuleError">Bitte füllen Sie dieses
                      Feld zuerst aus.</p>
                  </Combobox>

                  <!-- Digitalmodul -->
                  <Combobox class="flex-1 mt-10" as="div" v-model="selectedDModul"
                    @update:modelValue="queryDModul = ''">
                    <ComboboxLabel>
                      <Tooltip text="Definierte digitale Module." position="top">
                        <span class="text-gray-400 font-normal">digital</span> <span
                          class="font-semibold text-gray-900">Modul</span>
                      </Tooltip>
                      <p class="mt-1 text-sm leading-6 text-gray-600">Jedes Printmodul besitzt ein minimales
                        Digitalmodul. Upgrades können jederzeit durchgeführt werden.</p>
                    </ComboboxLabel>
                    <div class="relative mt-2">
                      <ComboboxInput
                        class="w-full rounded-md border-0 bg-white py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary dark:focus:ring-color-nk sm:text-sm sm:leading-6"
                        @change="queryDModul = $event.target.value"
                        :display-value="(pModule) => (pModule as DModule)?.digital_module || ''" @focus="focusDModule"
                        @blur="blurDModule" :readonly="!selectedPModul" />
                      <ComboboxButton
                        class="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
                        <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </ComboboxButton>

                      <ComboboxOptions v-if="filteredDModules.length > 0 && selectedPModul"
                        class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        <ComboboxOption v-for="(dModule, index) in filteredDModules" :key="index" :value="dModule"
                          as="template" v-slot="{ active, selected }">
                          <li
                            :class="['relative cursor-default select-none py-2 pl-8 pr-4', active ? 'bg-primary dark:bg-color-nk text-white' : 'text-gray-900']">
                            <span :class="['block truncate', selected && 'font-semibold']">
                              {{ dModule.digital_module }}
                            </span>

                            <span v-if="selected"
                              :class="['absolute inset-y-0 left-0 flex items-center pl-1.5', active ? 'text-white' : 'text-primary dark:text-color-nk']">
                              <CheckIcon class="h-5 w-5" aria-hidden="true" />
                            </span>
                          </li>
                        </ComboboxOption>
                      </ComboboxOptions>
                    </div>
                  </Combobox>

                </div>
              </div>



              <div class="mt-6 flex items-center justify-end gap-x-6">
                <button type="button" class="text-sm font-semibold leading-6 text-gray-900">Abbrechen</button>
                <button @click="addOrder" type="button" :disabled="!selectedIssue || !selectedPModul || !selectedDModul"
                  :class="[
                    'rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
                    {
                      'bg-primary dark:bg-color-nk text-white': selectedIssue && selectedPModul && selectedDModul, // Active styles
                      'bg-gray-400 text-gray-600 cursor-not-allowed': !selectedIssue || !selectedPModul || !selectedDModul // Disabled styles
                    }
                  ]">Hinzufügen</button>
              </div>
            </form>
          </div>
          <!-- Info -->
          <div class="flex-1">
            <div class="mx-auto max-w-none px-6 py-8 ring-1 ring-gray-200 rounded-2xl sm:p-8 lg:mx-0 lg:py-8 xl:px-10">
              <h2 class="text-lg font-bold tracking-tight sm:text-2xl mb-4">Kampagne </h2>
              <div class="flex">
                <p class="flex-1"> <span class="text-gray-900">Kombirabatt</span> <span class="text-gray-400">({{
                  Math.round(combiDiscount * 100) }}%)</span></p>
                <p class="flex-1">{{ Math.round(combiDiscount * finalPrice * 100) / 100 }} €</p>
              </div>
              <div class="flex mt-5">
                <p class="flex-1 font-semibold">Endsumme</p>
                <p class="flex-1 font-semibold text-4xl">{{ new
                  Intl.NumberFormat().format(Math.round((finalPrice - finalPrice * combiDiscount) * 100) / 100) }} €</p>
              </div>
            </div>
          </div>
        </div>
        <!-- Table -->
        <div v-if="orders.length > 0" class="sm:flex-auto mt-5">
          <h1 class="text-lg font-bold tracking-tight  sm:text-2xl">Medialeistungen</h1>
          <p class="mt-2 text-sm text-gray-700">Das Angebot beinhaltet die folgenden Leistungen:</p>
        </div>
        <div v-if="orders.length > 0" class="mt-8 flow-root">
          <div class="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table class="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                      Ausgabe</th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      <Tooltip text="Definierte Festformate für die jeweilige Ausgabe." position="top">
                        <span class="text-gray-400 font-normal">print</span> <span
                          class="font-semibold text-gray-900">Modul</span>
                      </Tooltip>
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm">
                      <Tooltip text="Fester Wert, der sich anhand der Ausgabe und Modulgröße automatisch zieht."
                        position="top">
                        <span class="text-gray-400 font-normal">print</span> <span
                          class="font-semibold text-gray-900">Preis</span>
                      </Tooltip>
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"><span
                        class="text-gray-400 font-normal">print</span> <span class="font-semibold text-gray-900">€ /
                        mm</span></th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm"><span
                        class="text-gray-400 font-normal">print</span> <span
                        class="font-semibold text-gray-900">Reichw.</span></th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"><span
                        class="text-gray-400 font-normal">digital</span> <span
                        class="font-semibold text-gray-900">Modul</span></th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"><span
                        class="text-gray-400 font-normal">digital</span> <span
                        class="font-semibold text-gray-900">Preis</span></th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"><span
                        class="text-gray-400 font-normal">digital</span> <span
                        class="font-semibold text-gray-900">TKP</span></th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"><span
                        class="text-gray-400 font-normal">digital</span> <span
                        class="font-semibold text-gray-900">Reichw.</span></th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      <Tooltip
                        text="Gibt die Zahl der Kontakte verschiedener Werbeträger mit den Zielgruppen aus. Summe aus der Print-Reichweite (Leser pro Ausgabe nach IVW) und der digitalen Reichweite der gewählten Ausgabe (50% Printreichweite, 50% digitale Reichweite)."
                        position="top">
                        <span class="text-gray-400 font-normal">ges.</span> <span
                          class="font-semibold text-gray-900">Reichw.</span>
                      </Tooltip>
                    </th>
                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      <Tooltip text="Gesamtpreis für die Kombireichweite Print und Digital." position="top">
                        <span class="text-gray-400 font-normal">ges.</span> <span
                          class="font-semibold text-gray-900">Preis</span>
                      </Tooltip>
                    </th>
                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                      <span class="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  <tr v-for="(order, index) in orders" :key="index">
                    <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">{{
                      order.issue }}</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ order.pModule }}</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ new
                      Intl.NumberFormat().format(order.pPrice) }} €</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ new
                      Intl.NumberFormat().format(order.pTkp) }} €</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ new
                      Intl.NumberFormat().format(order.pReach) }}</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ order.dModule }}</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ new
                      Intl.NumberFormat().format(order.dPrice) }} €</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ new
                      Intl.NumberFormat().format(order.dTkp) }} €</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ new
                      Intl.NumberFormat().format(order.dReach) }}</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ new
                      Intl.NumberFormat().format(order.totalReach) }}</td>
                    <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{{ new
                      Intl.NumberFormat().format(order.totalPrice) }} €</td>
                    <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <component :is="TrashIcon" @click="removeOrder(index)" type="button"
                        class="text-primary dark:text-color-nk h-4">
                        <span class="sr-only">, {{ order.issue }}</span>
                      </component>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
