<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Group } from '../models'
import db from '../db'

const groupArray = ref<Group[]>([])

onMounted(async ()=>{
  groupArray.value = await db.groups.toArray()
})

function addGroup(){
  groupArray.value.push({} as Group)
}
function saveGroup(new_group: Group){
  if(new_group.name && groupArray.value.reduce((acc, group) => acc + (group.name === new_group.name ? 1 : 0), 0) === 1)
    db.groups.put(new_group).then(id => new_group.id = id)
}
function removeGroup(group: Group){
  if(!confirm(`グループ：${group.name} を削除しますか？`)) return
  groupArray.value.splice(groupArray.value.indexOf(group), 1)
  if(group.id){
    db.groups.delete(group.id)
    db.sheep.where('group_id').equals(group.id).modify({ group_id: null })
  }
}
</script>

<template>
  <button type="button" class="btn w-100 mb-2" @click="addGroup">新規作成</button>
  <div class="card" v-for="group in groupArray">
    <div class="card-body">
      <input type="text" class="form-control mb-2" v-model="group.name">
      <div class="btn-group w-100">
        <router-link v-if="group.id" :to="{ name: 'group', params: { group_id: group.id } }" class="btn">メンバーを表示</router-link>
        <button type="button" class="btn" @click="saveGroup(group)">保存</button>
        <button type="button" class="btn" @click="removeGroup(group)">削除</button>
      </div>
    </div>
  </div>
</template>
