<script setup lang="ts">
import ImageUploader from './ImageUploader.vue'
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Sheep, Group } from '../models'
import db from '../db'

const data = reactive<Sheep>({} as Sheep)
const groupArray = ref<Group[]>([])

onMounted(async ()=>{
  groupArray.value = await db.groups.toArray()
})

const router = useRouter()

function registerSheep(): void {
  db.sheep.add(data)
    .then(id => {
      router.push({ name: 'sheep', params: { sheep_id: id } })
    })
}

async function detectAddress(): Promise<void> {
  const API_KEY = await fetch('/api-key').then(res=>res.text())

  const address = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      err => reject(err)
    )
  })
  .then(obj => {
    const { lat, lng } = obj as { lat: number, lng: number }
    return fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}`)
    .then(res=>res.json())
    .then(data=>{
      const address = data.results[0].formatted_address
      return address.substring(address.indexOf(' ') + 1)
    })
  })
  .catch(console.error)

  if(address)
    data.address = address
}
</script>

<template>
  <div class="form-group">
    <label class="form-label">名前</label>
    <input type="text" class="form-control" v-model="data.name">
  </div>
  <div class="form-group">
    <label class="form-label">性別</label>
    <select class="form-select" v-model="data.gender">
      <option>男性</option>
      <option>女性</option>
    </select>
  </div>
  <div class="form-group">
    <label class="form-label">年齢</label>
    <select class="form-select" v-model="data.age">
      <option>0~9</option>
      <option>10~19</option>
      <option>20~29</option>
      <option>30~39</option>
      <option>40~49</option>
      <option>50~59</option>
      <option>60~69</option>
      <option>70~79</option>
      <option>80~89</option>
      <option>90~99</option>
      <option>100~</option>
    </select>
  </div>
  <div class="form-group">
    <div class="form-label d-flex">
      <label class="me-auto" style="line-height:40px;">住所</label>
      <button type="button" class="btn" @click="detectAddress">現在地を取得</button>
    </div>
    <textarea class="form-control" v-model="data.address" v-textarea-resize></textarea>
  </div>
  <div class="form-group">
    <label class="form-label">電話番号</label>
    <input type="tel" class="form-control" v-model="data.phone_number">
  </div>
  <div class="form-group">
    <label class="form-label">メール</label>
    <input type="email" class="form-control" v-model="data.email">
  </div>
  <div class="form-group">
    <label class="form-label">グループ</label>
    <select class="form-select" v-model.number="data.group_id">
      <option :value="undefined">未選択</option>
      <option v-for="group in groupArray" :value="group.id">{{ group.name }}</option>
    </select>
  </div>
  <div class="form-group">
    <label class="form-label">どんな人？</label>
    <textarea class="form-control" v-model="data.note" v-textarea-resize></textarea>
  </div>
  <button class="btn w-100 mb-2" @click="registerSheep">登録</button>
</template>
