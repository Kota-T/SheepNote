<script setup lang="ts">
import db from './db'

function reset(): void {
  if(confirm("データを全て消去しますか？") && confirm("本当にいいですか？")){
    db.sheep.clear()
    db.groups.clear()
    db.talks.clear()
  }
}
</script>

<template>
  <nav class="nav">
    <router-link to="/" class="nav-link ps-2"><img src="/hitsuji.png" height="60"></router-link>
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
}
body{
  font-family: "Roboto", "Noto Sans JP";
  color: var(--main-color) !important;
  background-color: #FFF9F3;
}
.nav{
  overflow-x: scroll;
}
.nav-link{
  font-weight: bold;
  color: var(--main-color);
  line-height: 60px;
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
  color: #ffffff;
  background-color: var(--main-color);
}
.form-group{
  margin-bottom: 0.5rem;
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
