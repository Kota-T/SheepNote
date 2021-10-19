<script setup lang="ts">
import ImageUploader from './ImageUploader.vue'
import { ref, reactive, onMounted } from 'vue'
import { Sheep, Group } from '../models'
import db from '../db'

const data = reactive<Sheep>({} as Sheep)
const groupArray = ref<Group[]>([])

onMounted(async ()=>{
  groupArray.value = await db.groups.toArray()
})

function registerSheep(): void {
  if(data.name)
    db.sheep.add(data)
}
</script>

<template>
  <div class="form-group">
    <label class="form-label">名前</label>
    <input type="text" class="form-control" v-model="data.name">
  </div>
  <ImageUploader v-model="data.img_url" />
  <div class="form-group">
    <label class="form-label">性別</label>
    <select class="form-select" v-model="data.gender">
      <option value="Male">男性</option>
      <option value="Female">女性</option>
    </select>
  </div>
  <div class="form-group">
    <label class="form-label">年齢</label>
    <select class="form-select" v-model="data.age">
      <option :value="0">0~9</option>
      <option :value="10">10~19</option>
      <option :value="20">20~29</option>
      <option :value="30">30~39</option>
      <option :value="40">40~49</option>
      <option :value="50">50~59</option>
      <option :value="60">60~69</option>
      <option :value="70">70~79</option>
      <option :value="80">80~89</option>
      <option :value="90">90~99</option>
      <option :value="100">100~</option>
    </select>
  </div>
  <div class="form-group">
    <label class="form-label">住所</label>
    <textarea class="form-control" v-model="data.address"></textarea>
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
      <option>未選択</option>
      <option v-for="group in groupArray" :value="group.id">{{ group.name }}</option>
    </select>
  </div>
  <div class="form-group">
    <label class="form-label">どんな人?</label>
    <textarea class="form-control" v-model="data.note"></textarea>
  </div>
  <router-link to="/" class="btn w-100 mb-2" @click="registerSheep">登録</router-link>
</template>
