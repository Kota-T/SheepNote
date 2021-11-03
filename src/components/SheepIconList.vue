<script setup lang="ts">
import SheepIcon from './SheepIcon.vue'
import { ref, onMounted } from 'vue'
import { Sheep } from '../models'
import db, { distinctTableDataArray, sortSheep } from '../db'
import { flattenShallowly } from '../util'

const sheepArray = ref<Sheep[]>([])
onMounted(async ()=>{
  sheepArray.value = await db.sheep.toArray(sortSheep)
})

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
            .filter(([k, v]: [string, string]) => ['name', 'gender', 'note'].includes(k))
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
        .then(arr => distinctTableDataArray<Sheep>(arr))
        .catch(err=>console.error("talks", err))
    )
  )
  .then(flattenShallowly)

  sheepArray.value = await sortSheep(
    distinctTableDataArray<Sheep>(
      flattenShallowly(
        [sheepSearch, groupsSearch, talksSearch]
      )
    )
  )
}
function removeSheep(sheep: Sheep): void {
  if(!confirm(`${sheep.name} さんの情報を削除しますか？`)) return
  sheepArray.value.splice(sheepArray.value.indexOf(sheep), 1)
  if(sheep.id){
    db.talks
      .where('sheep_id')
      .equals(sheep.id)
      .primaryKeys()
      .then(array=>array.forEach(id=>db.talks.delete(id)))
    db.sheep.delete(sheep.id)
  }
}
</script>

<template>
  <div class="form-group">
    <input
    type="text"
    class="form-control"
    placeholder="検索"
    @input="search(($event.target as HTMLInputElement).value)"
    >
  </div>
  <SheepIcon
  v-for="sheep in sheepArray"
  :key="sheep.id"
  :sheep="sheep"
  @remove-sheep="removeSheep"
  />
</template>
