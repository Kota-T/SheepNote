<script setup lang="ts">
import SheepIcon from './SheepIcon.vue'
import { ref, onMounted } from 'vue'
import { Sheep } from '../models'
import db, { sortSheep } from '../db'

const sheepArray = ref<Sheep[]>([])
onMounted(async ()=>{
  sheepArray.value = await db.sheep.toArray(sortSheep)
})

const flattenShallowly = (arr: any[]) => arr.reduce((acc: any[], val: any[]) => acc.concat(val), [])
const distinctObjectArray = (arr: { id?: number }[]) => Array.from(new Map((arr as { id: number }[]).map(obj => [obj.id!, obj])).values())

async function search(text: string): Promise<void> {
  if(!text){
    sheepArray.value = await db.sheep.toArray(sortSheep)
    return
  }

  const sheepSearch = await Promise.all(
    text.split(' ').map(
      kwd => db.sheep
        .filter(
          sheep => Object.entries(sheep)
            .filter(([k, v]: [string, string]) => ['name', 'note'].includes(k))
            .filter(([k, v]: [string, string]) => v.includes(kwd))
            .length !== 0
        )
        .toArray()
    )
  )
  .then(flattenShallowly)

  const groupsSearch = await Promise.all(
    text.split(' ').map(
      kwd => db.groups
        .filter(group => group.name.includes(kwd))
        .toArray(
          groups => groups.map(
            group => db.sheep
              .where('group_id')
              .equals(group.id!)
              .toArray()
          )
        )
        .then(arr => Promise.all(arr))
        .then(flattenShallowly)
        .catch(err=>console.error("groups", err)),
    )
  )
  .then(flattenShallowly)

  const talksSearch = await Promise.all(
    text.split(' ').map(
      kwd => db.talks
        .filter(talk => talk.details.includes(kwd))
        .toArray(
          talks => talks.map(
            talk => db.sheep
              .get(talk.sheep_id)
          )
        )
        .then(arr => Promise.all(arr) as Promise<Sheep[]>)
        .then(distinctObjectArray)
        .catch(err=>console.error("talks", err))
    )
  )
  .then(flattenShallowly)

  sheepArray.value = await sortSheep(distinctObjectArray(flattenShallowly([sheepSearch, groupsSearch, talksSearch])) as Sheep[])
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
