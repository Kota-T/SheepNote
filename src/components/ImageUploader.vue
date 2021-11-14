<script setup lang="ts">
import InputElement from './InputElement.vue'
import ImageEditor from './ImageEditor.vue'
import { nextTick, onMounted, ref, watchEffect } from 'vue'
import { Sheep } from '../models'

const props = defineProps<{ modelValue?: string }>()
const emits = defineEmits<{ (e: 'update:modelValue', modelValue?: string): void; (e: 'save'): void; }>()

const isShowEditor = ref(false)
const fileInput    = ref<HTMLInputElement>()

const img_url = ref("")

function startEdit(file: File){
  const reader = new FileReader()
  reader.onload = ()=>{
    img_url.value = reader.result as string
    isShowEditor.value = true
  }
  reader.readAsDataURL(file)
}

function endEdit(url: string){
  isShowEditor.value = false
  emits('update:modelValue', url)
}

function hide(){
  isShowEditor.value = false
  fileInput.value!.value = ""
}

function save(){
  emits('save')
}

function reset(){
  fileInput.value!.value = ""
  emits('update:modelValue', undefined)
}
</script>

<template>
  <div class="d-flex">
    <InputElement @save="save">
      <template #title>写真</template>
      <template #input>
        <div class="input-group">
          <input
          type="file"
          accept="image/*"
          class="form-control"
          @change="startEdit(($event.target as HTMLInputElement).files![0] as File)"
          ref="fileInput"
          >
          <button type="button" class="btn" v-if="modelValue" @click="reset">消去</button>
        </div>
      </template>
      <template #value></template>
    </InputElement>
    <img v-if="modelValue" :src="modelValue" class="ms-auto mb-3 border border-1 rounded-circle bg-white" width="86" height="86">
    <img v-else src="../assets/human.png" class="ms-auto mb-3 border border-1 rounded-circle bg-white" width="86" height="86">
  </div>
  <Popup v-if="isShowEditor" @hide-popup="hide">
    <ImageEditor :img_url="img_url" @end-edit="endEdit" />
  </Popup>
</template>
