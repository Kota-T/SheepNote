<script setup lang="ts">
import { reactive, toRaw } from 'vue'
import { Talk } from '../models'

defineEmits<{ (e: 'talk-save', talk: Talk): void, (e: 'talk-remove', talk: Talk): void }>()
const props = defineProps<{ talk: Talk }>()
const data = reactive<Talk>(props.talk)

function update(): void {
  data.date = new Date(data.date.getTime())
}

function unwrapReactive(talk: Talk): Talk {
  return toRaw(talk)
}
</script>

<template>
  <div class="border-top pt-2" style="border-top-color: rgba(138, 84, 68, 0.5) !important;">
    <div class="form-group">
      <div class="form-label d-flex">
        <label class="me-auto" style="line-height:40px;">日付と時間</label>
        <div class="btn-group">
          <button type="button" class="btn" @click="$emit('talk-save', unwrapReactive(data))">保存</button>
          <button type="button" class="btn" @click="$emit('talk-remove', unwrapReactive(data))">削除</button>
        </div>
      </div>
      <div class="row gy-2">
        <div class="col-sm-6 col-md-4">
          <div class="row">
            <div class="input-group col">
              <input
              type="number"
              class="form-control"
              :value="data.date.getFullYear()"
              @change="data.date.setFullYear(Number(($event.target as HTMLInputElement).value));update();"
              >
              <span class="input-group-text">年</span>
            </div>
            <div class="input-group col">
              <input
              type="number"
              class="form-control"
              :value="data.date.getMonth() + 1"
              @change="data.date.setMonth(Number(($event.target as HTMLInputElement).value) - 1);update();"
              >
              <span class="input-group-text">月</span>
            </div>
          </div>
        </div>
        <div class="col-sm-6 col-md-4">
          <div class="row">
            <div class="input-group col">
              <input
              type="number"
              class="form-control"
              :value="data.date.getDate()"
              @change="data.date.setDate(Number(($event.target as HTMLInputElement).value));update();"
              >
              <span class="input-group-text">日</span>
            </div>
            <div class="input-group col">
              <select class="form-select" disabled :value="data.date.getDay()">
                <option value="0">日</option>
                <option value="1">月</option>
                <option value="2">火</option>
                <option value="3">水</option>
                <option value="4">木</option>
                <option value="5">金</option>
                <option value="6">土</option>
              </select>
              <span class="input-group-text">曜日</span>
            </div>
          </div>
        </div>
        <div class="col-sm-12 col-md-4">
          <div class="row">
            <div class="input-group col">
              <input
              type="number"
              class="form-control"
              :value="data.date.getHours()"
              @change="data.date.setHours(Number(($event.target as HTMLInputElement).value));update();"
              >
              <span class="input-group-text">時</span>
            </div>
            <div class="input-group col">
              <input
              type="number"
              class="form-control"
              :value="data.date.getMinutes()"
              @change="data.date.setMinutes(Number(($event.target as HTMLInputElement).value));update();"
              >
              <span class="input-group-text">分</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">話した内容</label>
      <textarea class="form-control" v-model="data.details" v-textarea-resize></textarea>
    </div>
  </div>
</template>
