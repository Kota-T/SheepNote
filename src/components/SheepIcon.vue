<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Sheep, Talk } from '../models'
import db from '../db'

defineEmits<{ (e: 'remove-sheep', sheep: Sheep): void }>()
const props = defineProps<{ sheep: Sheep }>()

const last_talk = reactive<Talk>({} as Talk)
const last_talk_day = ref("--")
const next_talk = reactive<Talk>({} as Talk)
const next_talk_day = ref("--")
onMounted(async ()=>{
  if(props.sheep.last_talk_id){
    Object.assign(last_talk, await db.talks.get(props.sheep.last_talk_id))
    last_talk_day.value = getDay(last_talk)
  }
  if(props.sheep.next_talk_id){
    Object.assign(next_talk, await db.talks.get(props.sheep.next_talk_id))
    next_talk_day.value = getDay(next_talk)
  }
})
function getDay(talk: Talk): string {
  const index = new Date(talk.year, talk.month - 1, talk.date, talk.hours, talk.minutes).getDay()
  return ['日', '月', '火', '水', '木', '金', '土'][index]
}
</script>

<template>
  <div class="card">
    <div class="card-body">
      <h5 class="card-title fw-bold">{{ sheep.name }}</h5>
      <p class="card-text">最後に訪問した時間<br>
        {{ last_talk.year || "--" }}年
        {{ last_talk.month || "--" }}月
        {{ last_talk.date || "--" }}日
        ({{ last_talk_day }})
        {{ last_talk.hours || "--" }}時
        {{ last_talk.minutes || "--" }}分
      </p>
      <p class="card-text">次に訪問する予定の時間<br>
        {{ next_talk.year || "--" }}年
        {{ next_talk.month || "--" }}月
        {{ next_talk.date || "--" }}日
        ({{ next_talk_day }})
        {{ next_talk.hours || "--" }}時
        {{ next_talk.minutes || "--" }}分
      </p>
      <div class="text-end">
        <div class="btn-group">
          <router-link :to="{ name: 'edit', params: { sheep_id: sheep.id } }" class="btn">編集</router-link>
          <button type="button" class="btn" @click="$emit('remove-sheep', props.sheep)">削除</button>
        </div>
      </div>
    </div>
  </div>
</template>
