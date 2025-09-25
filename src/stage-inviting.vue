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
const assignRole = () => {
  game.value.assignRole();
}
</script>
<template>
  <div class="wrap">
    <div class="title">
      组团阶段
    </div>
    <el-input class="input" v-model="roomLink" placeholder="房间名">
      <template #append>
        <el-button @click="copyText(roomLink)" class="button" type="primary">复制链接</el-button>
      </template>
    </el-input>

    <div class="players">
      <player v-for="player in game.state.players" :key="player.id" :player="player"></player>
    </div>
    <el-button @click="assignRole" class="fight" :type="'primary'" :size="'large'">
      开始挑战
    </el-button>
    <span style="font-size: 0.5em; color: #999;">
      [ {{ game.state.players.length }} / 20 ] 招募中
      <template v-for="_ in (offset % 4 + 1)">.</template>
    </span>
  </div>
</template>

<style lang="less" scoped>
.players {
  height: 24em;
  display: flex;
  width: 72em;
  flex-wrap: wrap;
  padding: 10px;
  border-radius: 20px;
  background-color: #333;
  align-items: center;
  justify-content: center;
}

.wrap {
  width: 400px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.fight {
  margin-top: 0.5em;
  width: 10em;
}

.title {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 3em;
  font-weight: bold;
  color: #fff;
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