<template>
  <label>
    <input type="checkbox" :checked="item.completed" />
    {{ item.title }}
  </label>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>
