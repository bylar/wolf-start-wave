<script lang="ts" setup>
import player from './components/player.vue';
import { ref, toRefs } from 'vue';
import { Game } from './game';
const props = defineProps<{
  game: Game
}>();
const { game } = toRefs(props);

</script>
<template>
  <div class="wrap">
    <div class="title">
      <span>招募中...</span>
    </div>
    <div class="players">
      <player v-for="player in game.state.players" :key="player.id" :player="player"></player>
    </div>
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