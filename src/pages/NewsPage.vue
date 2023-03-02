<template>
  <div class="mx-auto flex flex-col items-center bg-gray-100 p-4">
    <div class="container">
      <select
        v-model="selectedTab"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option value="techcrunch">TechCrunch</option>
        <option value="planets">Planets</option>
      </select>
      <hr />
      <TechCrunch v-if="selectedTab === 'techcrunch'" />
      <PlanetsComponent v-if="selectedTab === 'planets'" />
    </div>
  </div>
</template>

<script>
import TechCrunch from "../components/TechCrunch.vue";
import PlanetsComponent from "../components/PlanetsComponent.vue";

export default {
  components: {
    TechCrunch,
    PlanetsComponent,
  },
  data() {
    return {
      selectedTab: "techcrunch",
    };
  },

  watch: {
    selectedTab() {
      window.location.hash = "";
    },
  },
};
</script>
