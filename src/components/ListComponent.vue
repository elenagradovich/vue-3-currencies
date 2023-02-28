<template>
  <input placeholder="filter..." v-model="filter" />
  <ul>
    <li v-for="item in filteredItems" :key="item.id">
      <slot name="item" :item="item"> </slot>
    </li>
  </ul>
</template>

<script>
export default {
  name: "ListComponent",
  props: {
    items: {
      type: Array,
      required: true,
    },
    fields: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      filter: "",
    };
  },
  computed: {
    filteredItems() {
      return this.filter
        ? this.items.filter((item) =>
            this.fields.some((field) => {
              return item[field]
                ?.toLowerCase()
                .includes(this.filter?.toLowerCase());
            })
          )
        : this.items;
    },
  },
};
</script>
