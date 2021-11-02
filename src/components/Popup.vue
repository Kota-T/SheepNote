<template>
  <div
  id="popup-background"
  @click="$emit('hide-popup');"
  >
    <slot></slot>
  </div>
  <!--
  @mousedown.stop
  @mousemove.stop
  @pointerdown.stop
  @pointermove.stop
  @scroll.stop
  @touchstart.stop
  @touchmove.stop
  -->
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
