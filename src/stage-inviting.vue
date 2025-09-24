<script lang="ts" setup>
import player from './components/player.vue';
import { ref, toRefs } from 'vue';
import { Game } from './game';
import { copyText } from './classes/util';
const props = defineProps<{
  game: Game
}>();
const { game } = toRefs(props);
const roomLink = `${location.origin}/${game.value.pcid}`;
const offset = ref(0);
setInterval(() => {
  offset.value = offset.value + 1
}, 1000)
</script>
<template>
  <div class="wrap">
    <div class="title">
      <el-input class="input" v-model="roomLink" placeholder="房间名">
        <template #append>
          <el-button @click="copyText(roomLink)" class="button" type="primary">复制链接</el-button>
        </template>
      </el-input>
      <span style="margin-top: 0.5em;">
        [ {{ game.state.players.length }} / 20 ] 招募中
        <template v-for="_ in (offset % 4 + 1)">.</template>
      </span>
    </div>
    <div class="players">
      <player v-for="player in game.state.players" :key="player.id" :player="player"></player>
    </div>
  </div>
</template>

<style lang="less" scoped>
.players {
  height: 32em;
  display: flex;
  width: 64em;
  flex-wrap: wrap;
  padding: 10px;
  border-radius: 20px;
  background-color: #333;
}

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
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 0.75em;
}

.input {
  text-align: center;
  width: 40em;
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