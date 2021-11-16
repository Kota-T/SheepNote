<script setup lang="ts">
defineProps<{ titles: string[] }>()
defineEmits<{ (e: 'change', title: string): void }>()
</script>

<template>
  <ul class="nav nav-tabs">
    <li class="nav-item" v-for="title in titles">
      <a class="nav-link" @click="$emit('change', title)">{{ title }}</a>
    </li>
  </ul>
</template>
