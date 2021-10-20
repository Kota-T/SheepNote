<script setup lang="ts">
import SheepIcon from './SheepIcon.vue'
import { ref, onMounted } from 'vue'
import { Sheep } from '../models'
import db from '../db'

const sheepArray = ref<Sheep[]>([])
onMounted(async ()=>{
  sheepArray.value = await db.sheep.toArray()
})
async function search(text: string): Promise<void> {
  if(!text){
    sheepArray.value = await db.sheep.toArray()
    return
  }

  sheepArray.value = await Promise.all(
    text.split(' ').map(
      kwd => db.sheep.filter(
        sheep => Object.entries(sheep)
          .filter(([k, v]) => ['name', 'note'].includes(k))
          .filter(([k, v]) => v.includes(kwd))
          .length !== 0
      ).toArray()
    )
  )
  .then(arr => arr.reduce((acc, val) => acc.concat(val), []))
}
function removeSheep(sheep: Sheep): void {
  if(!confirm(`${sheep.name} さんの情報を削除しますか？`)) return
  sheepArray.value.splice(sheepArray.value.indexOf(sheep), 1)
  if(sheep.id)
    db.sheep.delete(sheep.id)
}
</script>

<template>
  <div class="form-group">
    <input type="text" class="form-control" placeholder="検索" @input="search(($event.target as HTMLInputElement).value)">
  </div>
  <SheepIcon
  v-for="sheep in sheepArray"
  :key="sheep.id"
  :sheep="sheep"
  @remove-sheep="removeSheep"
  />
</template>
