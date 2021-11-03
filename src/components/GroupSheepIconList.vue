<script setup lang="ts">
import SheepIcon from './SheepIcon.vue'
import { ref, onMounted } from 'vue'
import { Sheep } from '../models'
import db, { sortSheep } from '../db'

const props = defineProps<{ group_id: string }>()
const group_id = Number(props.group_id)
const group_name = ref("")
const sheepArray = ref<Sheep[]>([])
onMounted(async ()=>{
  db.groups
    .get(group_id)
    .then(group => {
      if(group)
        group_name.value = group.name
    })
  sheepArray.value = await db.sheep
    .where('group_id')
    .equals(group_id)
    .toArray(sortSheep)
})
function removeSheep(sheep: Sheep): void {
  if(!confirm(`${sheep.name} さんの情報をグループから削除しますか？`)) return
  sheepArray.value.splice(sheepArray.value.indexOf(sheep), 1)
  if(sheep.id)
    db.sheep.update(sheep.id, { group_id: undefined })
}
</script>

<template>
  <h4 class="fw-bold">{{ group_name }}</h4>
  <SheepIcon
  v-for="sheep in sheepArray"
  :key="sheep.id"
  :sheep="sheep"
  @remove-sheep="removeSheep"
  />
</template>
