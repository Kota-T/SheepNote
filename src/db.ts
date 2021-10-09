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
