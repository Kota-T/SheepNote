<script setup lang="ts">
function disableScroll(event: TouchEvent){
  const popup = document.getElementById('popup')
  if(event.target === popup) {
    event.stopPropagation();
  }else{
    event.preventDefault();
  }
}
</script>

<template>
  <div id="popup-background" @click="$emit('hide-popup')" @touchmove.stop="disableScroll">
    <slot></slot>
  </div>
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
  z-index: 150;
}
</style>
