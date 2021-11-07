<script setup lang="ts">
import Dexie from 'dexie'

async function reset(): Promise<void> {
  if(confirm("データを全て消去しますか？") && confirm("本当にいいですか？")){
    Dexie.delete('SheepNoteDB')
    location.href = "/"
  }
}
</script>

<template>
  <nav class="nav sticky-top">
    <router-link to="/" class="nav-link position-sticky start-0">
      <img src="./assets/hitsuji.png" height="60">
    </router-link>
    <router-link to="/" class="nav-link">トップ</router-link>
    <router-link to="/register" class="nav-link">登録</router-link>
    <router-link to="/groups" class="nav-link">グループ一覧</router-link>
    <span class="nav-link" @click="reset">リセット</span>
  </nav>
  <div class="container">
    <router-view></router-view>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&family=Roboto&display=swap');
@import 'bootstrap/dist/css/bootstrap.css';
:root{
  --main-color: #8a5444;
  --bg-color: #fff9f3;
}
body{
  font-family: "Roboto", "Noto Sans JP";
  color: var(--main-color) !important;
  background-color: var(--bg-color);
}
.nav{
  flex-wrap: nowrap;
  overflow-x: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.nav::-webkit-scrollbar{
  display:none;
}
.nav-link{
  font-weight: bold;
  color: var(--main-color);
  line-height: 60px;
  white-space: nowrap;
}
.nav-link:hover{
  cursor: pointer;
  color: #b9958a;
}
.btn{
  color: var(--main-color);
  background-color: transparent;
  border: 1px solid var(--main-color);
}
.btn:hover{
  color: var(--bg-color);
  background-color: var(--main-color);
}
.btn svg{
  width: 32px;
  height: 26px;
  fill: var(--main-color);
}
.btn svg:hover{
  fill: var(--bg-color);
}
.form-group{
  margin-bottom: 1rem;
}
.form-label{
  font-weight: bold;
}
.card{
  border: 1px solid;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>
