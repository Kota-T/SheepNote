import Dexie from 'dexie'
import { Sheep, Group, Talk } from './models'

const SCHEMA_VERSION = 1

const db = new class SheepNoteDB extends Dexie {
  sheep  : Dexie.Table<Sheep, number>
  groups : Dexie.Table<Group, number>
  talks  : Dexie.Table<Talk, number>

  constructor() {
    super("SheepNoteDB")
    this.version(SCHEMA_VERSION).stores({
      sheep: `
        ++id,
        name,
        img_url,
        gender,
        age,
        address,
        phone_number,
        email,
        note,
        group_id,
        last_talk_id,
        next_talk_id
      `,
      groups: '++id, name',
      talks: '++id, sheep_id, date, details'
    })

    this.sheep  = this.table("sheep")
    this.groups = this.table("groups")
    this.talks  = this.table("talks")
  }
}()

export default db

export const getDate = (talk_id: number) => db.talks.get(talk_id).then(talk => {
  if(talk && talk.year && talk.month && talk.date && talk.hours && talk.minutes)
    return new Date(talk.year, talk.month - 1, talk.date, talk.hours, talk.minutes)
  return undefined
})
export const compareSheep = async (f: Sheep, s: Sheep) => {
  if(!f.last_talk_id && s.last_talk_id)
    return false
  if(!f.last_talk_id || !s.last_talk_id)
    return true
  const f_last_talk_date = await getDate(f.last_talk_id)
  const s_last_talk_date = await getDate(s.last_talk_id)
  if(!f_last_talk_date && s_last_talk_date)
    return false
  if(!f_last_talk_date || !s_last_talk_date)
    return true
  if(f_last_talk_date < s_last_talk_date)
    return false
  return true
}
export const sortSheep = async (arr: Sheep[]) => {
  for(let i = 0; i < arr.length - 1; i++){
    for(let j = i + 1; j < arr.length; j++){
      if(await compareSheep(arr[i], arr[j]) === false){
        const tmp = arr[i]
        arr[i] = arr[j]
        arr[j] = tmp
      }
    }
  }
  return arr
}
