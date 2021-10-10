<script>
import { onMounted } from 'vue'
onMounted(()=>{
  document.body.ontouchmove = e=>e.preventDefault()
})
</script>

<template>
  <div id="popup-background" @click="document.body.ontouchmove=null;$emit('hide-popup');">
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
