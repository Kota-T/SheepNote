<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Sheep, Talk } from '../models'
import db from '../db'

defineEmits<{ (e: 'remove-sheep', sheep: Sheep): void }>()
const props = defineProps<{ sheep: Sheep }>()

const last_talk = reactive<Talk>({} as Talk)
const next_talk = reactive<Talk>({} as Talk)
onMounted(async ()=>{
  if(props.sheep.last_talk_id){
    Object.assign(last_talk, await db.talks.get(props.sheep.last_talk_id))
  }
  if(props.sheep.next_talk_id){
    Object.assign(next_talk, await db.talks.get(props.sheep.next_talk_id))
  }
})
function getDay(date: Date): string {
  return ['日', '月', '火', '水', '木', '金', '土'][date.getDay()]
}
</script>

<template>
  <div class="card">
    <div class="card-body position-relative">
      <h5 class="card-title fw-bold">{{ sheep.name }}</h5>
      <p class="card-text">最後に訪問した時間<br>
        <span v-if="!Object.keys(last_talk).length">
          -- 年 -- 月 -- 日 ( -- ) -- 時 -- 分
        </span>
        <span v-else>
        {{ last_talk.date.getFullYear()}}年
        {{ last_talk.date.getMonth() + 1 }}月
        {{ last_talk.date.getDate() }}日
        ({{ getDay(last_talk.date) }})
        {{ last_talk.date.getHours() }}時
        {{ last_talk.date.getMinutes() }}分
        </span>
      </p>
      <p class="card-text">次に訪問する予定の時間<br>
        <span v-if="!Object.keys(next_talk).length">
          -- 年 -- 月 -- 日 ( -- ) -- 時 -- 分
        </span>
        <span v-else>
        {{ next_talk.date.getFullYear() }}年
        {{ next_talk.date.getMonth() + 1 }}月
        {{ next_talk.date.getDate() }}日
        ({{ getDay(last_talk.date) }})
        {{ next_talk.date.getHours() }}時
        {{ next_talk.date.getMinutes() }}分
        </span>
      </p>
      <div class="text-end">
        <div class="btn-group">
          <router-link :to="{ name: 'sheep', params: { sheep_id: sheep.id } }" class="btn">編集</router-link>
          <button type="button" class="btn" @click="$emit('remove-sheep', props.sheep)">削除</button>
        </div>
      </div>
      <div class="position-absolute" style="top:10px;right:10px;" v-if="sheep.img_url">
        <img class="rounded-circle" :src="sheep.img_url" width="70" height="70">
      </div>
    </div>
  </div>
</template>
