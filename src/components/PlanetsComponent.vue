<template>
  <div>
    <input
      placeholder="Search..."
      id="search"
      v-model="search"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    />
    <hr />
    <div v-if="items?.length">
      <button
        :disabled="page === 1"
        @click="page > 1 ? (page -= 1) : page"
        type="button"
        class="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800"
      >
        Prev
      </button>
      {{ page }}
      <button
        type="button"
        class="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800"
        @click="page += 1"
      >
        Next
      </button>
    </div>
    <hr />

    <ul>
      <li v-for="item in items" v-bind:key="item?.name">
        <a
          target="_blank"
          :href="item.link"
          class="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline"
          >{{ item.name }}</a
        >
      </li>
    </ul>
  </div>
</template>

<script>
import { getPlanets } from "../api";

export default {
  data() {
    return {
      items: [],
      search: "",
      page: 1,
    };
  },
  created() {
    window.addEventListener("hashchange", this.syncHash);
    this.syncHash();
    this.loadData();
  },
  beforeDestroyed() {
    window.removeEventListener("hashchange", this.syncHash);
  },
  watch: {
    page() {
      this.loadData();
      this.updateHash();
    },
    search() {
      this.page = 1;
      this.loadData();
      this.updateHash();
    },
  },
  methods: {
    async loadData() {
      const { results } = await getPlanets({
        page: this.page,
        search: this.search,
      });
      this.items = results;
    },
    syncHash() {
      const urlParams = new URLSearchParams(window.location.hash.substring(1));
      const entries = Object.fromEntries(urlParams.entries());
      if (entries.page) {
        this.page = +entries.page;
      }
      if (entries.search) {
        this.search = entries.search;
      }
    },

    updateHash() {
      const urlParams = new URLSearchParams();
      if (this.page !== 1) {
        urlParams.append("page", this.page);
      }
      if (this.search && this.search !== "") {
        urlParams.append("search", this.search);
      }

      window.location.hash = urlParams.toString();
    },
  },
};
</script>
