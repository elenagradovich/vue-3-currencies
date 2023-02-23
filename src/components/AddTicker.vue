<template>
  <section>
    <div class="flex">
      <div class="max-w-xs">
        <label for="wallet" class="block text-sm font-medium text-gray-700"
          >Ticker</label
        >
        <div class="mt-1 relative rounded-md shadow-md">
          <input
            v-model="currency"
            @keydown.enter="addNewTicker"
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
            v-on:click="currency = autocompleteItem"
            class="inline-flex items-center px-2 m-1 rounded-md text-xs font-medium bg-gray-300 text-gray-800 cursor-pointer"
          >
            {{ autocompleteItem }}
          </span>
        </div>
        <div data-add-error class="text-sm text-red-600"></div>
      </div>
    </div>
    <add-button
      class="my-4"
      v-bind:title="message"
      @click="addNewTicker"
      type="button"
      :disabled="disabled"
    />
  </section>
</template>

<script>
import AddButton from "./AddButton.vue";

export default {
  name: "AddTicker",
  components: {
    AddButton,
  },
  data() {
    return {
      currency: "",
      message: `"Вы загрузили эту страницу:" ${new Date().toLocaleString()}`,
      currencies: [],
      autocompleteList: [],
    };
  },
  props: {
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: {
    "add-ticker": (value) => typeof value === "string" && value.length > 0,
  },
  created() {
    fetch("https://min-api.cryptocompare.com/data/all/coinlist?summary=true")
      .then((response) => response.json())
      .then((data) => {
        this.currencies = Object.values(data.Data);
      });
  },
  watch: {
    currency() {
      if (!this.currency) this.autocompleteList = [];
    },
  },
  methods: {
    addNewTicker() {
      debugger;
      if (this.currency !== "") {
        const newTicker = {
          currency: this.currency.toUpperCase(),
          price: "-",
        };
        this.$emit("add-ticker", newTicker);
        this.currency = "";
      }
    },
    getAutocomplete() {
      if (this.currencies.length && this.currency !== "") {
        const newList = this.currencies.filter((item) =>
          item.Symbol.toLowerCase().includes(this.currency.toLowerCase())
        );

        if (newList.length) {
          this.autocompleteList = newList
            .slice(0, 4)
            .map((item) => item?.Symbol);
          return;
        }

        this.autocompleteList = [];
      }
      if (this.currency === "") {
        this.autocompleteList = [];
      }
    },
  },
};
</script>
