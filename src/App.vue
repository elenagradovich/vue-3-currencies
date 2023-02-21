<template>
  <div class="container mx-auto flex flex-col items-center bg-gray-100 p-4">
    <div class="container">
      <div class="w-full my-4"></div>
      <section>
        <div class="flex">
          <div class="max-w-xs">
            <label for="wallet" class="block text-sm font-medium text-gray-700"
              >Ticker</label
            >
            <div class="mt-1 relative rounded-md shadow-md">
              <input
                v-model="ticker"
                @keydown.enter="add"
                v-on:input="getAutocomplete"
                type="text"
                name="wallet"
                id="wallet"
                class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
                placeholder="Example DOGE"
              />
            </div>
            <div
              v-if="autocompleteList?.length"
              class="flex bg-white shadow-md p-1 rounded-md shadow-md flex-wrap"
            >
              <span
                v-for="autocompleteItem in autocompleteList"
                v-bind:key="autocompleteItem"
                v-on:click="ticker = autocompleteItem"
                class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
              >
                {{ autocompleteItem }}
              </span>
            </div>
            <div data-add-error class="text-sm text-red-600"></div>
          </div>
        </div>
        <button
          v-bind:title="message"
          @click="add"
          type="button"
          class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          <!-- Heroicon name: solid/mail -->
          <svg
            class="-ml-0.5 mr-2 h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
            viewBox="0 0 24 24"
            fill="#ffffff"
          >
            <path
              d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
            ></path>
          </svg>
          Add
        </button>
      </section>

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
      <section v-if="selectedTicker" class="relative">
        <h3 class="text-lg leading-6 font-medium text-gray-900 my-8">
          {{ selectedTicker.currency }} - USD
        </h3>
        <div
          ref="graph"
          class="flex items-end border-gray-600 border-b border-l h-64"
        >
          <div
            v-for="(bar, idx) in normalizedGraph"
            :key="idx"
            :style="{ height: `${bar}%` }"
            class="bg-purple-800 border w-10"
          ></div>
        </div>
        <button
          @click="selectedTicker = null"
          type="button"
          class="absolute top-0 right-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            xmlns:svgjs="http://svgjs.com/svgjs"
            version="1.1"
            width="30"
            height="30"
            x="0"
            y="0"
            viewBox="0 0 511.76 511.76"
            style="enable-background: new 0 0 512 512"
            xml:space="preserve"
          >
            <g>
              <path
                d="M436.896,74.869c-99.84-99.819-262.208-99.819-362.048,0c-99.797,99.819-99.797,262.229,0,362.048    c49.92,49.899,115.477,74.837,181.035,74.837s131.093-24.939,181.013-74.837C536.715,337.099,536.715,174.688,436.896,74.869z     M361.461,331.317c8.341,8.341,8.341,21.824,0,30.165c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    l-75.413-75.435l-75.392,75.413c-4.181,4.16-9.643,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251    c-8.341-8.341-8.341-21.845,0-30.165l75.392-75.413l-75.413-75.413c-8.341-8.341-8.341-21.845,0-30.165    c8.32-8.341,21.824-8.341,30.165,0l75.413,75.413l75.413-75.413c8.341-8.341,21.824-8.341,30.165,0    c8.341,8.32,8.341,21.824,0,30.165l-75.413,75.413L361.461,331.317z"
                fill="#718096"
                data-original="#000000"
              ></path>
            </g>
          </svg>
        </button>
      </section>
    </div>
  </div>
</template>

<script>
import { subscribeToTicker, unsubscribeFromTicker } from "./api";

export default {
  name: "App",

  data() {
    return {
      ticker: "",
      filter: "",

      tickers: [],
      currencies: [],
      selectedTicker: null,
      message: `"Вы загрузили эту страницу:" ${new Date().toLocaleString()}`,
      graphList: [],

      page: 1,
      addFieldErrorEL: null,
      autocompleteList: [],
      maxGraphElements: 1,
    };
  },
  // MOUNTED
  mounted: function () {
    this.addFieldErrorEL = document.querySelector("[data-add-error]");
    window.addEventListener("resize", this.calculateMaxGraphElenments);
  },
  // UNMOUNTED
  unmounted: function () {
    window.removeEventListener("resize", this.calculateMaxGraphElenments);
  },
  //CREATED
  created() {
    fetch("https://min-api.cryptocompare.com/data/all/coinlist?summary=true")
      .then((response) => response.json())
      .then((data) => {
        this.currencies = Object.values(data.Data);
      });

    const tickerData = localStorage.getItem("currencyList");
    if (tickerData) {
      this.tickers = JSON.parse(tickerData);
      this.tickers.forEach((item) => this.subscribeToUpdate(item.currency));
    }
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
  //COMPUTED -startIndex, -endIndex, -filteredTickers, -paginatedTickers, -pageStateOptions
  computed: {
    startIndex() {
      return (this.page - 1) * 6;
    },

    endIndex() {
      return this.page * 6;
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

    normalizedGraph() {
      const maxValue = Math.max(...this.graphList);
      const minValue = Math.min(...this.graphList);

      if (maxValue === minValue) {
        return this.graphList.map(() => 50);
      }

      return this.graphList.map(
        (price) => 5 + ((price - minValue) * 95) / (maxValue - minValue)
      );
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
    ticker() {
      this.autocompleteList = [];
    },

    selectedTicker() {
      this.graphList = [];
      //the next DOM update cycle $nextTick. $nextTick return promise
      this.$nextTick().then(this.calculateMaxGraphElenments);
      this.calculateMaxGraphElenments();
    },

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
    calculateMaxGraphElenments() {
      if (!this.$refs.graph) {
        return;
      }

      const graphWidth = 40;
      this.maxGraphElements = this.$refs.graph.clientWidth / graphWidth;
    },
    checkTicker(ticker, tickers) {
      if (tickers.length) {
        const isExist =
          tickers.length &&
          [
            ...tickers?.map((item) => {
              return item.currency.toLowerCase();
            }),
          ]?.includes(ticker.toLowerCase());
        return isExist;
      }
      return false;
    },
    showError(message, el) {
      if (el) el.innerText = message;
    },
    hideError(el) {
      if (el) el.innerText = "";
    },
    getAutocomplete() {
      if (this.currencies.length && this.ticker !== "") {
        const newList = this.currencies.filter((item) =>
          item.Symbol.toLowerCase().includes(this.ticker.toLowerCase())
        );

        if (newList.length) {
          this.autocompleteList = newList
            .slice(0, 4)
            .map((item) => item?.Symbol);
          return;
        }

        this.autocompleteList = [];
      }
      if (this.ticker === "") {
        this.autocompleteList = [];
      }
    },
    updateTicker(tickerCurrency, price) {
      this.tickers
        .filter((t) => t.currency === tickerCurrency)
        .forEach((t) => {
          if (t === this.selectedTicker) {
            this.graphList.push(price);
            while (this.graphList.length > this.maxGraphElements) {
              this.graphList.shift();
            }
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

    add() {
      const isTicker = this.checkTicker(this.ticker, this.tickers);
      if (isTicker) {
        this.showError("Такой тикер уже добавлен", this.addFieldErrorEL);
        return;
      }
      const currentTicker = {
        currency: this.ticker.toUpperCase(),
        price: "-",
      };

      this.tickers = [...this.tickers, currentTicker];
      this.ticker = "";
      this.filter = "";
      subscribeToTicker(currentTicker.currency, (newPrice) =>
        this.updateTicker(currentTicker.currency, newPrice)
      );
      this.autocompleteList = [];
      this.hideError(this.showError(this.addFieldErrorEL));
    },

    select(ticker) {
      this.selectedTicker = ticker;
    },

    handleDelete(tickerToRemove) {
      this.tickers = this.tickers.filter((t) => t !== tickerToRemove);
      if (this.selectedTicker === tickerToRemove) {
        this.selectedTicker = null;
      }
      unsubscribeFromTicker(tickerToRemove.currency);
    },
  },
};
</script>
