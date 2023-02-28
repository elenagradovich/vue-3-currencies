<template>
  <div class="mx-auto flex flex-col items-center bg-gray-100 p-4">
    <div class="container">
      <router-link to="/">Go to Currency page</router-link>
      <hr class="w-full border-t border-gray-600 my-4" />
      <list-component :items="users" :fields="['username', 'name']">
        <template #item="props">
          <user-component :item="props.item" />
        </template>
      </list-component>
      <list-component :items="todos" :fields="['title']">
        <template #item="props">
          <todo-component :item="props.item" />
        </template>
      </list-component>
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
    TodoComponent,
    UserComponent,
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
};
</script>
