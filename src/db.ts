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

export const distinctTableDataArray = <T extends { id?: number }>(arr: T[]): T[] => {
  return Array.from(
    new Map(
      arr.map(td => [td.id, td])
    ).values()
  )
}

export const compareSheep = async (f: Sheep, s: Sheep): Promise<boolean> => {
  if(!f.last_talk_id && s.last_talk_id)
    return false
  if(!f.last_talk_id || !s.last_talk_id)
    return true
  const f_last_talk_date = await db.talks.get(f.last_talk_id).then(talk => talk?.date)
  const s_last_talk_date = await db.talks.get(s.last_talk_id).then(talk => talk?.date)
  if(!f_last_talk_date && s_last_talk_date)
    return false
  if(!f_last_talk_date || !s_last_talk_date)
    return true
  if(f_last_talk_date < s_last_talk_date)
    return false
  return true
}

export const sortSheep = async (arr: Sheep[]): Promise<Sheep[]> => {
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
