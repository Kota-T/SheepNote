<script setup lang="ts">
defineEmits<{ (e: 'hide-popup'): void }>()
</script>

<template>
  <teleport to="#app">
    <div id="popup-background" @click="$emit('hide-popup')">
      <slot></slot>
    </div>
  </teleport>
</template>

<style>
#popup-background{
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0,0,0,0.6);
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1200;
}
</style>
