<script setup lang="ts">
import SheepIcon from './SheepIcon.vue'
import { ref, onMounted } from 'vue'
import { Sheep } from '../models'
import db from '../db'

const sheepArray = ref<Sheep[]>([])
onMounted(async ()=>{
  sheepArray.value = await db.sheep.toArray()
})
function removeSheep(sheep: Sheep): void {
  if(!confirm(`${sheep.name} さんの情報を削除しますか？`)) return
  sheepArray.value.splice(sheepArray.value.indexOf(sheep), 1)
  if(sheep.id)
    db.sheep.delete(sheep.id)
}
</script>

<template>
  <SheepIcon
  v-for="sheep in sheepArray"
  :key="sheep.id"
  :sheep="sheep"
  @remove-sheep="removeSheep"
  />
</template>
