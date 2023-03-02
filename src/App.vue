<template>
  <div id="app">
    <div class="flex flex-col w-full p-4">
      <router-link to="/">Go to Currency page</router-link>
      <router-link to="/examples">Go to Examples</router-link>
      <router-link to="/news">Go to News page</router-link>
    </div>
    <router-view></router-view>
  </div>
</template>
