<script setup lang="ts">
import { computed, reactive } from 'vue'
import { Talk } from '../models'

defineEmits<{ (e: 'talk-save', talk: Talk): void, (e: 'talk-remove', talk: Talk): void }>()
const props = defineProps<{ talk: Talk }>()
const data = reactive<Talk>(props.talk)

const day_of_week = computed(
  ()=>new Date(
    data.year,
    data.month - 1,
    data.date
  ).getDay()
)
</script>

<template>
  <div class="talk-editor border-top pt-2 mb-2" style="border-top-color: rgba(138, 84, 68, 0.5) !important;">
    <div class="form-group">
      <div class="form-label d-flex">
        <label class="me-auto" style="line-height:40px;">日付</label>
        <div class="btn-group">
          <button type="button" class="btn" @click="$emit('talk-save', data)">保存</button>
          <button type="button" class="btn" @click="$emit('talk-remove', data)">削除</button>
        </div>
      </div>
      <div class="row gy-2">
        <div class="col-sm-6">
          <div class="row">
            <div class="input-group col">
              <input type="number" class="form-control" v-model.number="data.year">
              <span class="input-group-text">年</span>
            </div>
            <div class="input-group col">
              <input type="number" class="form-control" v-model.number="data.month">
              <span class="input-group-text">月</span>
            </div>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="row">
            <div class="input-group col">
              <input type="number" class="form-control" v-model.number="data.date">
              <span class="input-group-text">日</span>
            </div>
            <div class="input-group col">
              <select class="form-select" disabled :value="day_of_week">
                <option :value="0">日</option>
                <option :value="1">月</option>
                <option :value="2">火</option>
                <option :value="3">水</option>
                <option :value="4">木</option>
                <option :value="5">金</option>
                <option :value="6">土</option>
              </select>
              <span class="input-group-text">曜日</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">時間</label>
      <div class="row">
        <div class="input-group col">
          <input type="number" class="form-control" v-model.number="data.hours">
          <span class="input-group-text">時</span>
        </div>
        <div class="input-group col">
          <input type="number" class="form-control" v-model.number="data.minutes">
          <span class="input-group-text">分</span>
        </div>
      </div>
    </div>
    <div class="form-group">
      <label class="form-label">話した内容</label>
      <textarea class="form-control" v-model="data.details"></textarea>
    </div>
  </div>
</template>
