<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Group } from '../models'
import db from '../db'

const groupArray = ref<Group[]>([])

onMounted(async ()=>{
  groupArray.value = await db.groups.toArray()
})

const isEditing = ref(false)

function addGroup(): void {
  groupArray.value.push({} as Group)
}
function saveGroup(new_group: Group): void {
  if(
    new_group.name &&
    groupArray.value.reduce(
      (acc, group) => acc + (group.name === new_group.name ? 1 : 0),
      0
    ) === 1
  ){
    db.groups
      .put(new_group)
      .then(id => new_group.id = id)
  }
}
function removeGroup(group: Group): void {
  if(group.id && !confirm(`グループ：${group.name} を削除しますか？`)) return
  groupArray.value.splice(groupArray.value.indexOf(group), 1)
  if(group.id){
    db.groups.delete(group.id)
    db.sheep
      .where('group_id')
      .equals(group.id)
      .modify({ group_id: null })
  }
}
</script>

<template>
  <button type="button" class="btn w-100 mb-2" @click="addGroup">新規作成</button>
  <div class="card" v-for="group in groupArray">
    <div class="card-body">
      <input type="text" class="form-control mb-2" :readonly="!isEditing" v-model="group.name">
      <div class="btn-group w-100">
        <router-link v-if="group.id" :to="{ name: 'group', params: { group_id: group.id } }" class="btn">メンバーを表示</router-link>
        <button v-if="!isEditing" type="button" class="btn" @click="isEditing=true">編集</button>
        <template v-else>
          <button type="button" class="btn" @click="saveGroup(group);isEditing=false;">保存</button>
          <button type="button" class="btn" @click="isEditing=false">終了</button>
        </template>
        <button type="button" class="btn" @click="removeGroup(group)">削除</button>
      </div>
    </div>
  </div>
</template>
