<script lang="ts" setup>
import Avatar from './components/avatar.vue';
import { ref, toRefs } from 'vue';
import { Game } from './game';
const props = defineProps<{
  game: Game
}>();
const game = toRefs(props.game);
const inputText = ref(''); 

</script>
<template>
  <div class="wrap">
    <div class="title">
      <Avatar :size="'medium'" :dead="false" :word="'团'" :camp="'master'"></Avatar>
      <Avatar :size="'medium'" :dead="false" :word="'本'" :camp="'master'"></Avatar>
      <Avatar :size="'medium'" :dead="false" :word="'狼'" :camp="'wolf'"></Avatar>
      <Avatar :size="'medium'" :dead="false" :word="'人'" :camp="'human'"></Avatar>
      <Avatar :size="'medium'" :dead="true" :word="'杀'" :camp="'wolf'"></Avatar>
    </div>
    <el-input :size="'large'" :placeholder="'请输入游戏内便于辨认的昵称（最好是游戏内昵称）'"></el-input>
    <el-button class="button" type="primary" :size="'large'">开一局</el-button>
  </div>
</template>

<style lang="less" scoped>
.wrap {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.title {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

.button {
  margin: 20px 0;
  width: 100%;
}
</style>