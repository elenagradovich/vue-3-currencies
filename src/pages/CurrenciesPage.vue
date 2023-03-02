<template>
  <div class="mx-auto flex flex-col items-center bg-gray-100 p-4">
    <div class="container">
      <div class="w-full my-4"></div>
      <add-ticker @add-ticker="add" :disabled="isDisabledAddButton" />

      <template v-if="tickers?.length">
        <hr class="w-full border-t border-gray-600 my-4" />
        <div>
          Page {{ page }}
          <button
            class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            v-if="page > 1"
            @click="page = page - 1"
          >
            Prev
          </button>
          <button
            class="my-4 mx-2 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            @click="page = page + 1"
            v-if="hasNextPage"
          >
            Next
          </button>
          <div>Filter: <input v-model="filter" /></div>
        </div>
        <hr class="w-full border-t border-gray-600 my-4" />
        <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div
            v-for="t in paginatedTickers"
            :key="t.currency"
            @click="select(t)"
            :class="{
              'border-4': selectedTicker === t,
            }"
            class="bg-white overflow-hidden shadow rounded-lg border-purple-800 border-solid cursor-pointer"
          >
            <div
              class="px-4 py-5 sm:p-6 text-center"
              :class="{
                'bg-red-100': t.price === '-',
              }"
            >
              <dt class="text-sm font-medium text-gray-500 truncate">
                {{ t.currency }} - USD
              </dt>
              <dd class="mt-1 text-3xl font-semibold text-gray-900">
                {{ formatPrice(t.price) }}
              </dd>
            </div>
            <div class="w-full border-t border-gray-200"></div>
            <button
              @click.stop="handleDelete(t)"
              class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 hover:opacity-20 transition-all focus:outline-none"
            >
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="#718096"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                ></path></svg
              >Delete
            </button>
          </div>
        </dl>
        <hr class="w-full border-t border-gray-600 my-4" />
      </template>
      <graph-component
        :selectedTicker="selectedTicker"
        :price="graphValue"
        @reset-ticker="resetSelectedTicker"
      />
    </div>
  </div>
</template>

<script>
import { subscribeToTicker, unsubscribeFromTicker } from "../api";
import AddTicker from "../components/AddTicker.vue";
import GraphComponent from "../components/GraphComponent.vue";

export default {
  name: "App",
  components: {
    AddTicker,
    GraphComponent,
  },
  data() {
    return {
      filter: "",
      tickers: [],
      selectedTicker: null,
      page: 1,
      MAX_PER_PAGE: 6,
      graphValue: 0,
    };
  },
  created() {
    const windowData = Object.fromEntries(
      new URL(window.location).searchParams.entries()
    );

    const VALID_KEYS = ["filter", "page"];

    VALID_KEYS.forEach((key) => {
      if (windowData[key]) {
        this[key] = windowData[key];
      }
    });

    const tickersData = localStorage.getItem("cryptonomicon-list");

    if (tickersData) {
      this.tickers = JSON.parse(tickersData);
      this.tickers.forEach((ticker) => {
        subscribeToTicker(ticker.currency, (newPrice) =>
          this.updateTicker(ticker.currency, newPrice)
        );
      });
    }

    setInterval(this.updateTickers, 5000);
  },
  mounted: function () {
    this.addFieldErrorEL = document.querySelector("[data-add-error]");
  },
  //COMPUTED -startIndex, -endIndex, -filteredTickers, -paginatedTickers, -pageStateOptions
  computed: {
    isDisabledAddButton() {
      return this.tickers.length > this.MAX_PER_PAGE * 2;
    },
    startIndex() {
      return (this.page - 1) * this.MAX_PER_PAGE;
    },

    endIndex() {
      return this.page * this.MAX_PER_PAGE;
    },

    filteredTickers() {
      return this.tickers.filter((ticker) =>
        ticker.currency?.toLowerCase().includes(this.filter?.toLowerCase())
      );
    },

    paginatedTickers() {
      return this.filteredTickers.slice(this.startIndex, this.endIndex);
    },

    hasNextPage() {
      return this.filteredTickers.length > this.endIndex;
    },
    pageStateOptions() {
      return {
        filter: this.filter,
        page: this.page,
      };
    },
  },
  //WATCH -ticker, -selectedTicker, -tickers, -paginatedTickers, -filter, -pageStateOptions
  watch: {
    tickers(newValue, oldValue) {
      console.log(newValue === oldValue);
      localStorage.setItem("cryptonomicon-list", JSON.stringify(this.tickers));
    },

    paginatedTickers() {
      if (this.paginatedTickers.length === 0 && this.page > 1) {
        this.page -= 1;
      }
    },

    filter() {
      this.page = 1;
    },

    pageStateOptions(value) {
      window.history.pushState(
        null,
        document.title,
        `${window.location.pathname}?filter=${value.filter}&page=${value.page}`
      );
    },
  },
  // METHODS
  methods: {
    checkTicker({ currency }) {
      if (this.tickers.length) {
        const isExist =
          this.tickers.length &&
          [
            ...this.tickers?.map((item) => {
              return item.currency.toLowerCase();
            }),
          ]?.includes(currency?.toLowerCase());
        return isExist;
      }
      return false;
    },
    updateTicker(tickerCurrency, price) {
      this.tickers
        .filter((t) => t.currency === tickerCurrency)
        .forEach((t) => {
          if (t === this.selectedTicker) {
            this.graphValue = price;
          }
          t.price = price;
        });
    },

    formatPrice(price) {
      if (price === "-") {
        return price;
      }
      return price > 1 ? price.toFixed(2) : price.toPrecision(2);
    },

    add(newTicker) {
      if (this.checkTicker(newTicker, this.tickers)) {
        this.showError("Такой тикер уже добавлен", this.addFieldErrorEL);
        return;
      }

      this.tickers = [...this.tickers, newTicker];
      this.filter = "";
      subscribeToTicker(newTicker.currency, (newPrice) =>
        this.updateTicker(newTicker.currency, newPrice)
      );
      this.hideError(this.addFieldErrorEL);
    },

    select(ticker) {
      this.selectedTicker = ticker;
    },

    resetSelectedTicker() {
      this.selectedTicker = null;
    },

    handleDelete(tickerToRemove) {
      this.tickers = this.tickers.filter((t) => t !== tickerToRemove);
      if (this.selectedTicker === tickerToRemove) {
        this.selectedTicker = null;
      }
      unsubscribeFromTicker(tickerToRemove.currency);
    },
    showError(message, el) {
      if (el) el.innerText = message;
    },
    hideError(el) {
      if (el) el.innerText = "";
    },
  },
};
</script>
