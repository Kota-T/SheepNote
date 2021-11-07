<script setup lang="ts">
import InputElement from './InputElement.vue'
import ImageUploader from './ImageUploader.vue'
import TalkEditor from './TalkEditor.vue'
import { computed, onMounted, ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Sheep, Group, Talk } from '../models'
import db from '../db'

const props = defineProps<{ sheep_id: string }>()

const data = reactive<Sheep>({} as Sheep)
const phone_numberValidator = computed(()=>{
  if(data.phone_number)
    return `tel:${ data.phone_number }`
})
const emailValidator = computed(()=>{
  if(data.email)
    return `mailto:${ data.email }`
})

const groupArray = ref<Group[]>([])
const talkArray = ref<Talk[]>([])

onMounted(async ()=>{
  const sheep_id = Number(props.sheep_id)
  Object.assign(data, await db.sheep.get(sheep_id))
  groupArray.value = await db.groups.toArray()
  talkArray.value = await db.talks
    .where('sheep_id')
    .equals(sheep_id)
    .reverse()
    .sortBy('date')
})

function saveSheepData(propName: string, prop: any): void {
  db.sheep.update(data.id!, { [propName]: prop })
}

const router = useRouter()

function removeSheep(){
  if(!confirm(`${data.name} さんの情報を削除しますか？`)) return
  router.back()
  db.talks
    .where('sheep_id')
    .equals(data.id!)
    .primaryKeys()
    .then(array=>array.forEach(id=>db.talks.delete(id)))
  db.sheep.delete(data.id!)
}

let tmp_talk_id = 0

function addTalk(): void {
  if(!data.id) return
  talkArray.value.unshift({
    id       : "_" + tmp_talk_id++ as unknown as number,
    sheep_id : data.id,
    date     : new Date(),
    details  : ""
  })
}
async function saveTalk(talk: Talk): Promise<void> {
  if(!data.id) return
  if(typeof talk.id === 'string')
    talk.id = undefined
  if(!talk.sheep_id)
    talk.sheep_id = data.id
  await db.talks.put(talk).then(id => talk.id = id)

  talkArray.value.sort((a, b) => b.date.getTime() - a.date.getTime())

  if(data.last_talk_id){//２回目以降
    if(data.last_talk_id === talk.id){//最新のtalkを変更した時
      const real_last_talk = talkArray.value[0]//talkArrayのなかで一番最近のもの
      if(data.last_talk_id !== real_last_talk.id){//最新だったtalkが変更され最新ではなくなったとき
        data.last_talk_id = real_last_talk.id
        db.sheep.update(data.id, { last_talk_id: real_last_talk.id })
        return
      }
    }
    //最新ではないtalkを変更してそのtalkが最新にはならなかった場合
    const last_talk = await db.talks.get(data.last_talk_id)
    if(last_talk && last_talk.date > talk.date)
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
        return a.date > b.date ? a : b
      })
      data.last_talk_id = last_talk.id
      db.sheep.update(data.id, { last_talk_id: last_talk.id })
    }
  }
}
</script>

<template>
  <InputElement @save="saveSheepData('name', data.name)">
    <template #title>名前</template>
    <template #input>
      <input type="text" class="form-control" v-model="data.name">
    </template>
    <template #value>
      <p class="form-control">{{ data.name || '未登録' }}</p>
    </template>
  </InputElement>
  <ImageUploader v-model="data.img_url" @save="saveSheepData('img_url', data.img_url)" />
  <InputElement @save="saveSheepData('gender', data.gender)">
    <template #title>性別</template>
    <template #input>
      <select class="form-select" v-model="data.gender">
        <option>男性</option>
        <option>女性</option>
      </select>
    </template>
    <template #value>
      <p class="form-control">{{ data.gender || '未登録' }}</p>
    </template>
  </InputElement>
  <InputElement @save="saveSheepData('age', data.age)">
    <template #title>年齢</template>
    <template #input>
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
    </template>
    <template #value>
      <p class="form-control">{{ data.age || '未登録' }}</p>
    </template>
  </InputElement>
  <InputElement @save="saveSheepData('address', data.address)">
    <template #title>住所</template>
    <template #input>
      <textarea class="form-control" v-model="data.address" v-textarea-resize></textarea>
    </template>
    <template #value>
      <pre class="form-control">{{ data.address || '未登録' }}</pre>
    </template>
  </InputElement>
  <InputElement @save="saveSheepData('phone_number', data.phone_number)">
    <template #title>電話番号</template>
    <template #input>
      <input type="tel" class="form-control" v-model="data.phone_number">
    </template>
    <template #value>
      <p class="input-group">
        <div class="form-control">{{ data.phone_number || '未登録' }}</div>
        <a class="btn" :href="phone_numberValidator">発信</a>
      </p>
    </template>
  </InputElement>
  <InputElement @save="saveSheepData('email', data.email)">
    <template #title>メール</template>
    <template #input>
      <input type="email" class="form-control" v-model="data.email">
    </template>
    <template #value>
      <p class="input-group">
        <div class="form-control">{{ data.email || '未登録' }}</div>
        <a class="btn" :href="emailValidator">作成</a>
      </p>
    </template>
  </InputElement>
  <InputElement @save="saveSheepData('group_id', data.group_id)">
    <template #title>グループ</template>
    <template #input>
      <select class="form-select" v-model.number="data.group_id">
        <option :value="undefined">未登録</option>
        <option v-for="group in groupArray" :value="group.id">{{ group.name }}</option>
      </select>
    </template>
    <template #value>
      <div class="input-group">
        <select class="form-select bg-white" style="background-image: none;" disabled v-model.number="data.group_id">
          <option :value="undefined">未登録</option>
          <option v-for="group in groupArray" :value="group.id">{{ group.name }}</option>
        </select>
        <router-link
        class="btn"
        v-if="data.group_id"
        :to="{ name: 'group', params: { group_id: data.group_id } }"
        >移動</router-link>
      </div>
    </template>
  </InputElement>
  <InputElement @save="saveSheepData('note', data.note)">
    <template #title>どんな人？</template>
    <template #input>
      <textarea class="form-control" v-model="data.note" v-textarea-resize></textarea>
    </template>
    <template #value>
      <pre class="form-control">{{ data.note || '未登録' }}</pre>
    </template>
  </InputElement>
  <div class="form-label d-flex">
    <label class="me-auto" style="line-height:40px">訪問履歴</label>
    <button type="button" class="btn" @click="addTalk">追加</button>
  </div>
  <TalkEditor
  v-for="talk in talkArray"
  :key="talk.id"
  :talk="talk"
  @talk-save="saveTalk"
  @talk-remove="removeTalk"
  />
  <button class="btn w-100 mb-2" @click="removeSheep">削除</button>
</template>
