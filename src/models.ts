type Gender = "男性" | "女性"
type Age = "0~9" | "10~19" | "20~29" | "30~39" | "40~49" | "50~59" | "60~69" | "70~79" | "80~89" | "90~99" | "100~"

export interface Sheep {
  id?: number
  img_url?: string
  name?: string
  gender?: Gender
  age?: Age
  address?: string
  phone_number?: string
  email?: string
  note?: string
  group_id?: number
  last_talk_id?: number
  next_talk_id?: number
}

export interface Group {
  id?: number
  name: string
}

export interface Talk {
  id?: number
  sheep_id: number
  date: Date
  details: string
}
