<script setup lang="ts">
import ImageUploader from './ImageUploader.vue'
import TalkEditor from './TalkEditor.vue'
import { ref, reactive, onMounted } from 'vue'
import { Sheep, Group, Talk } from '../models'
import db from '../db'

const props = defineProps<{ sheep_id: string }>()

const data = reactive<Sheep>({} as Sheep)
const groupArray = ref<Group[]>([])
const talkArray = ref<Talk[]>([])

onMounted(async ()=>{
  const sheep_id = Number(props.sheep_id)
  Object.assign(data, await db.sheep.get(sheep_id))
  groupArray.value = await db.groups.toArray()
  talkArray.value = await db.talks.where('sheep_id').equals(sheep_id).toArray()
})

function saveSheep(){
  if(data.id && data.name)
    db.sheep.update(data.id, data)
}

function talk2Date(talk: Talk){
  return new Date(talk.year, talk.month - 1, talk.date, talk.hours, talk.minutes)
}
function addTalk(): void {
  if(!data.id) return
  const date = new Date()
  talkArray.value.push({
    sheep_id : data.id,
    year     : date.getFullYear(),
    month    : date.getMonth() + 1,
    date     : date.getDate(),
    hours    : date.getHours(),
    minutes  : date.getMinutes(),
    details  : ""
  })
}
async function saveTalk(talk: Talk): Promise<void> {
  if(!data.id) return
  if(!talk.sheep_id)
    talk.sheep_id = data.id
  await db.talks.put(talk).then(id => talk.id = id)

  if(data.last_talk_id){
    if(data.last_talk_id === talk.id){
      const last_talk = talkArray.value.reduce((a, b)=>{
        return talk2Date(a).getTime() > talk2Date(b).getTime() ? a : b
      })
      if(data.last_talk_id === last_talk.id)
        return
      data.last_talk_id = last_talk.id
      db.sheep.update(data.id, { last_talk_id: last_talk.id })
      return
    }
    const last_talk = await db.talks.get(data.last_talk_id)
    if(last_talk && talk2Date(last_talk) > talk2Date(talk))
      return
  }

  data.last_talk_id = talk.id
  db.sheep.update(data.id, { last_talk_id: talk.id })
}
function removeTalk(talk: Talk): void {
  if(!data.id || !confirm("訪問履歴を削除しますか？")) return
  talkArray.value.splice(talkArray.value.indexOf(talk), 1)
  if(talk.id){
    db.talks.delete(talk.id)
    if(data.last_talk_id === talk.id){
      if(talkArray.value.length === 0){
        data.last_talk_id = undefined
        db.sheep.update(data.id, { last_talk_id: undefined })
        return
      }
      const last_talk = talkArray.value.reduce((a, b)=>{
        return talk2Date(a).getTime() > talk2Date(b).getTime() ? a : b
      })
      data.last_talk_id = last_talk.id
      db.sheep.update(data.id, { last_talk_id: last_talk.id })
    }
  }
}
</script>

<template>
  <div class="form-group">
    <div class="form-label d-flex">
      <label class="me-auto" style="line-height:40px;">名前</label>
      <button type="button" class="btn" @click="saveSheep">保存</button>
    </div>
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
    <select class="form-select" v-model.number="data.age">
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
  <button type="button" class="btn w-100 mb-2" @click="saveSheep">保存</button>
  <div class="form-label d-flex">
    <label class="me-auto" style="line-height:40px">訪問履歴</label>
    <button type="button" class="btn" @click="addTalk">追加</button>
  </div>
  <TalkEditor
  v-for="talk in talkArray"
  :talk="talk"
  @talk-save="saveTalk"
  @talk-remove="removeTalk"
  />
</template>
