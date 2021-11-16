<script setup lang="ts">
import { computed, ref, reactive, onMounted } from 'vue'
import { Sheep, Talk } from '../models'
import db from '../db'
import { date2string } from '../util'

const props = defineProps<{ sheep: Sheep }>()

const last_talk = reactive<Talk>({} as Talk)
const next_talk = reactive<Talk>({} as Talk)
const last_talk_date_string = computed(() => date2string(last_talk.date))
const next_talk_date_string = computed(() => date2string(next_talk.date))
onMounted(async ()=>{
  if(props.sheep.last_talk_id){
    Object.assign(last_talk, await db.talks.get(props.sheep.last_talk_id))
  }
  if(props.sheep.next_talk_id){
    Object.assign(next_talk, await db.talks.get(props.sheep.next_talk_id))
  }
})
</script>

<template>
  <div class="card col-sm">
    <div class="card-body position-relative">
      <h5 class="card-title fw-bold">{{ sheep.name }}</h5>
      <p class="card-text">住所<br>{{ sheep.address || "--" }}</p>
      <p class="card-text">最後に訪問した時間<br>
        <template v-if="!Object.keys(last_talk).length">
          -- 年 -- 月 -- 日 ( -- ) -- 時 -- 分
        </template>
        <template v-else>{{ last_talk_date_string }}</template>
      </p>
      <p class="card-text">次に訪問する予定の時間<br>
        <template v-if="!Object.keys(next_talk).length">
          -- 年 -- 月 -- 日 ( -- ) -- 時 -- 分
        </template>
        <template v-else>{{ next_talk_date_string }}</template>
      </p>
      <div class="text-end">
        <router-link :to="{ name: 'sheep', params: { sheep_id: sheep.id } }" class="btn">詳細</router-link>
      </div>
      <div class="position-absolute" style="top:10px;right:10px;" v-if="sheep.img_url">
        <img class="rounded-circle" :src="sheep.img_url" width="70" height="70">
      </div>
    </div>
  </div>
</template>
