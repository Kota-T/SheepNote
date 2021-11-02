<script setup lang="ts">
import Popup from './Popup.vue'
import { nextTick, ref, watchEffect } from 'vue'
import { Sheep } from '../models'
import ImageEditor from './ImageEditor.vue'

const props = defineProps<{ modelValue: string | undefined }>()
const emits = defineEmits<{ (e: 'update:modelValue', modelValue: string | undefined): void }>()

const isShowEditor = ref(false)
const fileInput    = ref<HTMLInputElement>()

const img_url = ref("")

watchEffect(()=>{
  const app = document.getElementById('app')!
  if(isShowEditor.value){
    app.style.overflow = "hidden"
    app.ontouchmove = e=>e.preventDefault()
  }else{
    app.removeAttribute('style')
    app.ontouchmove = undefined
  }
})

function startEdit(file: File){
  const reader = new FileReader()
  reader.onload = ()=>{
    img_url.value = reader.result as string
    isShowEditor.value = true
  }
  reader.readAsDataURL(file)
}

function endEdit(url: string){
  emits('update:modelValue', url)
  isShowEditor.value = false
}

function hide(){
  if(!fileInput.value) return
  isShowEditor.value = false
  fileInput.value.value = ""
}

function reset(){
  if(!fileInput.value) return
  fileInput.value.value = ""
  emits('update:modelValue', undefined)
}
</script>

<template>
  <div class="d-flex">
    <div class="form-group">
      <label class="form-label">ファイルを選択</label>
      <div class="input-group">
        <input type="file" accept="image/*" class="form-control" @change="startEdit(($event.target as HTMLInputElement).files![0] as File)" ref="fileInput">
        <button type="button" class="btn" v-if="modelValue" @click="reset">消去</button>
      </div>
    </div>
    <img v-if="modelValue" :src="modelValue" class="ms-2 ms-sm-auto border border-1 rounded-circle bg-white" width="70" height="70">
    <img v-else src="../assets/human.png" class="ms-2 ms-sm-auto border border-1 rounded-circle bg-white" width="70" height="70">
  </div>
  <teleport to="body">
    <Popup v-if="isShowEditor" @hide-popup="hide">
      <ImageEditor :img_url="img_url" @end-edit="endEdit" />
    </Popup>
  </teleport>
</template>

<style>
#popup{
  width: 400px;
  height: 450px;
}
@media screen and (max-width: 500px) {
  #popup{
    width: 80vw;
    height: calc(80vw + 50px);
  }
}
#canvas_field{
  background-color: #fff;
  width: 100%;
  height: calc(100% - 50px);
  overflow: hidden;
  position: relative;
}
#controller-container{
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: skyblue;
  width: 100%;
  height: 50px;
}
#controller-container button{
  width: 60px;
  height: 30px;
  color: white;
  background-color: #ee989c;
  font-size: 15px;
  border-radius: 5px;
  margin-left: 20px;
  white-space: nowrap;
}
#controller-container button:hover{
  cursor: pointer;
}
</style>
