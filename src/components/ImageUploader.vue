<script setup lang="ts">
import InputElement from './InputElement.vue'
import ImageEditor from './ImageEditor.vue'
import { computed, nextTick, onMounted, ref, watchEffect } from 'vue'
import { Sheep } from '../models'

const props = defineProps<{ isEditing: boolean, modelValue?: string }>()
const emits = defineEmits<{ (e: 'update:modelValue', modelValue?: string): void }>()

const isShowEditor = ref(false)
const fileInput    = ref<HTMLInputElement>()

import human_img from "../assets/human.png"
const img_src = computed(() => props.modelValue || human_img)

const uploaded_img_url = ref("")

function startEdit(file: File){
  const reader = new FileReader()
  reader.onload = ()=>{
    uploaded_img_url.value = reader.result as string
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

function reset(){
  fileInput.value!.value = ""
  emits('update:modelValue', undefined)
}
</script>

<template>
  <label class="d-flex">
    <img :src="img_src" class="mx-auto my-3 border border-1 rounded-circle bg-white" width="120" height="120">
    <input
    type="file"
    accept="image/*"
    class="d-none"
    :disabled="!isEditing"
    @change="startEdit(($event.target as HTMLInputElement).files![0] as File)"
    ref="fileInput"
    >
  </label>
  <Popup v-if="isShowEditor" @hide-popup="hide">
    <ImageEditor :img_url="uploaded_img_url" @end-edit="endEdit" />
  </Popup>
</template>
