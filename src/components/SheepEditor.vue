<script setup lang="ts">
import ImageUploader from './ImageUploader.vue'
import TalkEditor from './TalkEditor.vue'
import { computed, onMounted, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Sheep, Group, Talk } from '../models'
import db from '../db'

const props = defineProps<{ sheep_id: string }>()

const tabs = ref(['情報', '連絡先', '訪問履歴'])
const currentTab = ref(tabs.value[0])

const isEditing = ref(false)

const sheep = reactive<Sheep>({} as Sheep)
const phone_numberValidator = computed(()=>{
  if(sheep.phone_number)
    return `tel:${ sheep.phone_number }`
})
const emailValidator = computed(()=>{
  if(sheep.email)
    return `mailto:${ sheep.email }`
})

const groupArray = ref<Group[]>([])
const talkArray = ref<Talk[]>([])

onMounted(async ()=>{
  const sheep_id = Number(props.sheep_id)
  Object.assign(sheep, await db.sheep.get(sheep_id))
  groupArray.value = await db.groups.toArray()
  talkArray.value = await db.talks
    .where('sheep_id')
    .equals(sheep_id)
    .reverse()
    .sortBy('date')
})

function saveSheepData(propName: string, prop: any): void {
  db.sheep.update(sheep.id!, { [propName]: prop })
}

function saveSheep(): void {
  db.sheep.update(sheep.id!, sheep)
}

const router = useRouter()

function removeSheep(){
  if(!confirm(`${sheep.name} さんの情報を削除しますか？`)) return
  router.back()
  db.talks
    .where('sheep_id')
    .equals(sheep.id!)
    .primaryKeys()
    .then(array=>array.forEach(id=>db.talks.delete(id)))
  db.sheep.delete(sheep.id!)
}

function updateLastTalkId(){
  talkArray.value.sort((a, b) => b.date.getTime() - a.date.getTime())
  const last_talk = talkArray.value[0]
  sheep.last_talk_id = last_talk.id
  db.sheep.update(sheep.id!, { last_talk_id: last_talk.id })
}

function addTalk(): void {
  const talk: Talk = {
    sheep_id : sheep.id!,
    date     : new Date(),
    detail  : ""
  }
  db.talks
    .put(talk)
    .then(id => {
      talk.id = id
      talkArray.value.unshift(talk)
      updateLastTalkId()
    })
}
function saveTalk(talk: Talk): void {
  db.talks.update(talk.id!, talk)
  updateLastTalkId()
}
function removeTalk(talk: Talk): void {
  if(!confirm("訪問履歴を削除しますか？")) return
  talkArray.value.splice(talkArray.value.indexOf(talk), 1)
  db.talks.delete(talk.id!)
  if(talkArray.value.length === 0){
    sheep.last_talk_id = undefined
    db.sheep.update(sheep.id!, { last_talk_id: undefined })
    return
  }
  if(sheep.last_talk_id === talk.id)
    updateLastTalkId()
}
</script>

<template>
  <Tab :titles="tabs" @change="(title: string) => currentTab = title"/>
  <template v-if="currentTab === '情報'">
    <div class="w-100 text-end">
      <button v-if="!isEditing" type="button" class="btn" @click="isEditing=true">編集</button>
      <div v-else class="btn-group">
        <button type="button" class="btn" @click="saveSheep();isEditing=false;">保存</button>
        <button type="button" class="btn" @click="isEditing=false">終了</button>
      </div>
    </div>
    <ImageUploader :isEditing="isEditing" v-model="sheep.img_url" />
    <div class="form-group">
      <label class="form-label">名前</label>
      <input v-if="isEditing" type="text" class="form-control" v-model="sheep.name">
      <p v-else class="form-control">{{ sheep.name || '未登録' }}</p>
    </div>
    <div class="form-group">
      <label class="form-label">性別</label>
      <select v-if="isEditing" class="form-select" v-model="sheep.gender">
        <option>男性</option>
        <option>女性</option>
      </select>
      <p v-else class="form-control">{{ sheep.gender || '未登録' }}</p>
    </div>
    <div class="form-group">
      <label class="form-label">年齢</label>
      <select v-if="isEditing" class="form-select" v-model="sheep.age">
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
      <p v-else class="form-control">{{ sheep.age || '未登録' }}</p>
    </div>
    <div class="form-group">
      <label class="form-label">グループ</label>
      <select v-if="isEditing" class="form-select" v-model.number="sheep.group_id">
        <option :value="undefined">未登録</option>
        <option v-for="group in groupArray" :value="group.id">{{ group.name }}</option>
      </select>
      <div v-else class="input-group">
        <select class="form-select bg-white" style="background-image: none;" disabled v-model.number="sheep.group_id">
          <option :value="undefined">未登録</option>
          <option v-for="group in groupArray" :value="group.id">{{ group.name }}</option>
        </select>
        <router-link
        class="btn"
        v-if="sheep.group_id"
        :to="{ name: 'group', params: { group_id: sheep.group_id } }"
        >移動</router-link>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">どんな人？</label>
      <textarea v-if="isEditing" class="form-control" v-model="sheep.note" v-textarea-resize></textarea>
      <pre v-else class="form-control">{{ sheep.note || '未登録' }}</pre>
    </div>
    <button class="btn w-100 mb-2" @click="removeSheep">削除</button>
  </template>
  <template v-else-if="currentTab === '連絡先'">
    <div class="w-100 text-end">
      <button v-if="!isEditing" type="button" class="btn" @click="isEditing=true">編集</button>
      <div v-else class="btn-group">
        <button type="button" class="btn" @click="saveSheep();isEditing=false;">保存</button>
        <button type="button" class="btn" @click="isEditing=false">終了</button>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">住所</label>
      <textarea v-if="isEditing" class="form-control" v-model="sheep.address" v-textarea-resize></textarea>
      <pre v-else class="form-control">{{ sheep.address || '未登録' }}</pre>
    </div>
    <div class="form-group">
      <label class="form-label">電話番号</label>
      <input v-if="isEditing" type="tel" class="form-control" v-model="sheep.phone_number">
      <p v-else class="input-group">
        <div class="form-control">{{ sheep.phone_number || '未登録' }}</div>
        <a class="btn" :href="phone_numberValidator">発信</a>
      </p>
    </div>
    <div class="form-group">
      <label class="form-label">メール</label>
      <input v-if="isEditing" type="email" class="form-control" v-model="sheep.email">
      <p v-else class="input-group">
        <div class="form-control">{{ sheep.email || '未登録' }}</div>
        <a class="btn" :href="emailValidator">作成</a>
      </p>
    </div>
  </template>
  <template v-else-if="currentTab === '訪問履歴'">
    <button type="button" class="btn w-100 mb-3" @click="addTalk">追加</button>
    <TalkEditor
    v-for="talk in talkArray"
    :key="talk.id"
    :talk="talk"
    @talk-save="saveTalk"
    @talk-remove="removeTalk"
    />
  </template>
</template>
