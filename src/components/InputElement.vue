<script setup lang="ts">
import { ref } from 'vue'

const emits = defineEmits<{ (e: 'save'): void }>()

const isEditing = ref(false)

function save(){
  isEditing.value = false
  emits('save')
}
</script>

<template>
  <div class="form-group">
    <div class="form-label d-flex">
      <label class="me-auto" style="line-height:40px;">
        <slot name="title"></slot>
      </label>
      <div class="btn-group" v-if="isEditing">
        <button type="button" class="btn" @click="save">保存</button>
        <button type="button" class="btn" @click="isEditing=false">終了</button>
      </div>
      <svg class="pencil" v-else @click="isEditing=true">
        <use href="../assets/pencil.svg#pencil"/>
      </svg>
    </div>
    <slot name="input" v-if="isEditing"></slot>
    <slot name="value" v-else></slot>
  </div>
</template>

<style>
.pencil{
  box-sizing: content-box;
  width: 32px;
  height: 26px;
  fill: var(--main-color);
  padding: 7px 13px;
}
.pencil:hover{
  cursor: pointer;
  opacity: 0.8;
}
</style>
