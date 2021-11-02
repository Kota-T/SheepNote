<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue'
import { Canvas } from '../canvas'

const props = defineProps<{ img_url: string }>()
const emits = defineEmits<{ (e: 'end-edit', url: string): void }>()

const slider_min = ref(0)
const slider_max = ref(0)
const frameCvs = ref()
const frameCvsData = reactive({
  width: 0,
  height: 0,
  x: 15,
  y: 15
})
const imgCvs = ref()
const imgCvsData = reactive({
  width: 0,
  height: 0,
  x: 15,
  y: 15
})
let img: HTMLImageElement, originalWidth: number, originalHeight: number
onMounted(()=>{
  const FRAME_SIZE = Math.min(window.innerWidth * 0.8, 400) - 30

  frameCvsData.width  = FRAME_SIZE
  frameCvsData.height = FRAME_SIZE
  nextTick(()=>{
    frameCvs.value.ctx.strokeStyle = "red"
    frameCvs.value.ctx.lineWidth = 1
    frameCvs.value.ctx.strokeRect(0, 0, FRAME_SIZE, FRAME_SIZE)
  })

  img = new Image()
  img.src = props.img_url
  img.onload = () => {
    const ratio = img.naturalHeight / img.naturalWidth
    if(img.naturalWidth < FRAME_SIZE || img.naturalHeight < FRAME_SIZE){
      slider_min.value = 0
      if(ratio > 1){
        imgCvsData.width  = FRAME_SIZE
        imgCvsData.height = FRAME_SIZE * ratio
        slider_max.value = FRAME_SIZE
      }else{
        imgCvsData.width  = FRAME_SIZE / ratio
        imgCvsData.height = FRAME_SIZE
        slider_max.value = FRAME_SIZE / ratio
      }
    }else{
      imgCvsData.width  = img.naturalWidth
      imgCvsData.height = img.naturalHeight
      if(ratio > 1){
        slider_min.value = FRAME_SIZE - imgCvsData.width
      }else{
        slider_min.value = (FRAME_SIZE - imgCvsData.height) / ratio
      }
      slider_max.value = -slider_min.value
    }

    originalWidth = imgCvsData.width
    originalHeight = imgCvsData.height

    imgCvsData.x = (FRAME_SIZE + 30 - imgCvsData.width) / 2
    imgCvsData.y = (FRAME_SIZE + 30 - imgCvsData.height) / 2

    nextTick(()=>{
      imgCvs.value.ctx.drawImage(img, 0, 0, imgCvsData.width, imgCvsData.height)
    })
  }
})

function isOnImgCvs(XY: { x: number, y: number }): boolean {
  return (
    0 <= XY.x && XY.x <= imgCvsData.width
                 &&
    0 <= XY.y && XY.y <= imgCvsData.height
  )
}

function getPointerXYOnImgCvs(event: PointerEvent): { x: number, y: number } {
  const cvs_rect = imgCvs.value.canvas.getBoundingClientRect()
  const x = event.clientX - cvs_rect.left
  const y = event.clientY - cvs_rect.top
  return { x, y }
}

let initXY: { x: number, y: number } | undefined;
let isMoving = false

function startMove(e: PointerEvent){
  const XY = getPointerXYOnImgCvs(e)
  if(isOnImgCvs(XY)){
    isMoving = true
    initXY = XY
  }
}

function move(e: PointerEvent){
  if(!isMoving) return
  const currentXY = getPointerXYOnImgCvs(e)

  imgCvsData.x += currentXY.x - initXY!.x
  imgCvsData.y += currentXY.y - initXY!.y
}

function endMove(){
  isMoving = false
  initXY = undefined
}

function resize(valueX: number): void {
  const valueY = valueX * img.naturalHeight / img.naturalWidth
  const beforeWidth  = imgCvsData.width
  const beforeHeight = imgCvsData.height
  imgCvsData.width  = originalWidth  + valueX
  imgCvsData.height = originalHeight + valueY
  imgCvsData.x -= (imgCvsData.width  - beforeWidth ) / 2
  imgCvsData.y -= (imgCvsData.height - beforeHeight) / 2
  nextTick(()=>{
    imgCvs.value.ctx.drawImage(img, 0, 0, imgCvsData.width, imgCvsData.height)
  })
}

function trim(){
  //画像canvasの画像canvasの中の切り取る座標
  let imgTop, imgRight, imgBottom, imgLeft
  //フレームcanvasの中の描画する座標
  let frameTop, frameRight, frameBottom, frameLeft

  //画像canvasの左端とフレームの位置関係
  if(imgCvsData.x < frameCvsData.x){//画像canvasの左端がフレームの左にある時
    imgLeft = frameCvsData.x - imgCvsData.x
    frameLeft = 0
  }else if(imgCvsData.x < frameCvsData.x + frameCvsData.width){//画像canvasの左端がフレームの中にある時
    imgLeft = 0
    frameLeft = imgCvsData.x - frameCvsData.x
  }else{//画像canvasの左端がフレームの右にある時
    alert("画像がフレームの外にあります。")
    return
  }

  //画像canvasの上端とフレームの位置関係
  if(imgCvsData.y < frameCvsData.y){//画像canvasの上端がフレームの上にある時
    imgTop = frameCvsData.y - imgCvsData.y
    frameTop = 0
  }else if(imgCvsData.y < frameCvsData.y + frameCvsData.width){//画像canvasの上端がフレームの中にある時
    imgTop = 0
    frameTop = imgCvsData.y - frameCvsData.y
  }else{//画像canvasの上端がフレームの下にある時
    alert("画像がフレームの外にあります。")
    return
  }

  //画像canvasの右端とフレームの位置関係
  if(imgCvsData.x + imgCvsData.width < frameCvsData.x){//画像canvasの右端がフレームの左にある時
    alert("画像がフレームの外にあります。")
    return
  }else if(imgCvsData.x + imgCvsData.width < frameCvsData.x + frameCvsData.width){//画像canvasの右端がフレームの中にある時
    imgRight = imgCvsData.width
    frameRight = imgCvsData.x + imgCvsData.width - frameCvsData.x
  }else{//画像canvasの右端がフレームの右にある時
    imgRight = imgCvsData.width - (imgCvsData.x + imgCvsData.width - frameCvsData.x - frameCvsData.width)
    frameRight = frameCvsData.width
  }

  //画像canvasの下端とフレームの位置関係
  if(imgCvsData.y + imgCvsData.height < frameCvsData.y){//画像canvasの下端がフレームの上にある時
    alert("画像がフレームの外にあります。")
    return
  }else if(imgCvsData.y + imgCvsData.height < frameCvsData.y + frameCvsData.width){//画像canvasの下端がフレームの中にある時
    imgBottom = imgCvsData.height
    frameBottom = imgCvsData.y + imgCvsData.height - frameCvsData.y
  }else{//画像canvasの下端がフレームの下にある時
    imgBottom = imgCvsData.height - (imgCvsData.y + imgCvsData.height - frameCvsData.y - frameCvsData.height)
    frameBottom = frameCvsData.height
  }

  const resultCvs = document.createElement('canvas')
  resultCvs.width  = frameCvsData.width
  resultCvs.height = frameCvsData.height
  const resultCtx = resultCvs.getContext('2d')
  if(!resultCtx) return
  resultCtx.fillStyle = "white"
  resultCtx.fillRect(0, 0, resultCvs.width, resultCvs.height)
  resultCtx.drawImage(
    imgCvs.value.canvas,
    imgLeft,
    imgTop,
    imgRight - imgLeft,
    imgBottom - imgTop,
    frameLeft,
    frameTop,
    frameRight- frameLeft,
    frameBottom - frameTop
  )

  emits('end-edit', resultCvs.toDataURL())
}
</script>

<template>
  <div id="popup">
    <div id="canvas_field"
    @pointerdown="startMove"
    @pointermove="move"
    @pointerup="endMove();console.log('pointer up');"
    @pointerout="endMove();console.log('pointer out');"
    >
      <Canvas
      :width="imgCvsData.width"
      :height="imgCvsData.height"
      :x="imgCvsData.x"
      :y="imgCvsData.y"
      ref="imgCvs"
      />
      <Canvas
      :width="frameCvsData.width"
      :height="frameCvsData.height"
      :x="frameCvsData.x"
      :y="frameCvsData.y"
      ref="frameCvs"
      />
    </div>
    <div id="controller-container">
      <input
      type="range"
      :value="0"
      :min="slider_min"
      :max="slider_max"
      @input="resize(Number(($event.target as HTMLInputElement).value))"
      >
      <button type="button" @click="trim">完了</button>
    </div>
  </div>
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
