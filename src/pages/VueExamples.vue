<template>
  <div class="mx-auto flex flex-col items-center bg-gray-100 p-4">
    <div class="container">
      <router-link to="/">Go to Currency page</router-link>
      <hr class="w-full border-t border-gray-600 my-4" />
      <list-component
        :items="users"
        :fields="['username', 'name']"
        :itemComponent="$options.propsComponents.UserComponent"
      />
      <list-component
        :items="todos"
        :fields="['title']"
        :itemComponent="$options.propsComponents.TodoComponent"
      />
    </div>
  </div>
</template>

<script>
import { loadUsers, loadTodos } from "../api";
import ListComponent from "../components/ListComponent.vue";
import UserComponent from "../components/UserComponent.vue";
import TodoComponent from "../components/TodoComponent.vue";

export default {
  name: "VueExamples",
  components: {
    ListComponent,
  },
  propsComponents: {
    UserComponent,
    TodoComponent,
  },
  mounted() {
    loadUsers().then((users) => {
      this.users = users;
    });
    loadTodos().then((todos) => {
      this.todos = todos;
    });
  },
  data() {
    return {
      users: [],
      todos: [],
    };
  },
  // computed: {
  //   filteredItems() {
  //     return this.filter
  //       ? this.users.filter((item) =>
  //           item.fields.some((field) => {
  //             return field?.toLowerCase().includes(this.filter?.toLowerCase());
  //           })
  //         )
  //       : this.users;
  //   },
  // },
};
</script>
