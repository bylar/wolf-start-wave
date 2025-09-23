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
      <span>招募中...</span>
    </div>
    <el-input class="input" v-model="inputText" :size="'large'" :placeholder="'请输入游戏内便于辨认的昵称（最好是游戏内昵称）'"></el-input>
    <el-button class="button" type="primary" :size="'large'">开一局</el-button>
    <span class="tip"> [发起者身份固定为裁判] </span>
  </div>
</template>

<style lang="less" scoped>
.wrap {
  width: 400px;
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

.input {
  text-align: center;
}

.button {
  margin-top: 20px;
  width: 100%;
}

.tip {
  margin-top: 2px;
  font-size: 12px;
  color: #999;
}
</style>