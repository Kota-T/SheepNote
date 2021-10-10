<script setup lang="ts">
import Popup from './Popup.vue'
import { ref } from 'vue'
import { Sheep } from '../models'
import { FrameCanvas, ImageCanvas, trim } from '../canvas'

const props = defineProps<{ sheep: Sheep }>()

const isShowEditor = ref(false)
const fileInput    = ref<HTMLInputElement>()
const img          = ref<HTMLImageElement>()
const canvas_field = ref<HTMLDivElement>()
const zoom_slider  = ref<HTMLInputElement>()
const btn          = ref<HTMLButtonElement>()

function startEdit(fileList: FileList | null){
  if(
    !fileList ||
    !fileList.length ||
    !canvas_field.value ||
    !btn.value ||
    !img.value ||
    !zoom_slider.value
  ) return

  const file = fileList[0]

  const reader = new FileReader()
  reader.onload = ()=>{
    if(!canvas_field.value || !btn.value || !zoom_slider.value) return
    document.body.ontouchmove = e=>e.preventDefault()
    isShowEditor.value = true
    const frameCvs = new FrameCanvas(canvas_field.value)
    const imgCvs = new ImageCanvas(
      reader.result as string, canvas_field.value, zoom_slider.value
    )
    btn.value.onclick = ()=>{
      if(!canvas_field.value || !img.value) return
      const resultCvs = trim(imgCvs, frameCvs)
      if(!resultCvs){
        return
      }
      const url = resultCvs.toDataURL()
      props.sheep.img_url = url
      img.value.src = url
      canvas_field.value.innerHTML = ""
      isShowEditor.value = false
    }
  };
  reader.readAsDataURL(file)
}

function hide(){
  if(!canvas_field.value || !fileInput.value) return
  canvas_field.value.innerHTML = ""
  document.body.ontouchmove = null
  isShowEditor.value = false
  fileInput.value.value = ""
}
</script>

<template>
  <div class="form-group d-flex">
    <div>
      <label class="form-label">ファイルを選択</label>
      <input type="file" accept="image/*" class="form-control" @change="startEdit(($event.target as HTMLInputElement).files)" ref="fileInput">
    </div>
    <img :src="sheep.img_url" class="ms-2" width="70" height="70" ref="img">
  </div>
  <Popup v-show="isShowEditor" @hide-popup="hide">
    <div id="popup" @click.stop @touchmove.stop>
      <div id="canvas_field" ref="canvas_field" @touchmove.stop></div>
      <div id="controller-container">
        <input type="range" value="0" ref="zoom_slider" @touchmove.stop>
        <button type="button" ref="btn">完了</button>
      </div>
    </div>
  </Popup>
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
