<script lang="ts" setup>
import player from './components/player.vue';
import { ref, toRefs } from 'vue';
import { Game } from './game';
const props = defineProps<{
  game: Game
}>();
const { game } = toRefs(props);
const offset = ref(0);
setInterval(() => {
  offset.value = offset.value + 1
}, 1000) 
</script>
<template>
  <div class="wrap">
    <div class="title">
      Night
    </div>
    <div class="main">
      <div class="players">
        <player v-for="player in game.state.players" :size="'small'" :key="player.id" :player="player"></player>
        <player v-for="player in game.state.players" :size="'small'" :key="player.id" :player="player"></player>
        <player v-for="player in game.state.players" :size="'small'" :key="player.id" :player="player"></player>
        <player v-for="player in game.state.players" :size="'small'" :key="player.id" :player="player"></player>
      </div>
      <div class="chat-room">

      </div>
      <div class="oprate">
        <template v-if="game.opraters.value.length">
          <template v-for="oprater in game.opraters.value">
            <template v-if="oprater.name === 'justice'">
              <div class="justice-box">
                <div style="padding-top: 20px;">
                  <el-button :size="'larger'" :type="'primary'">挑战成功</el-button>
                  <el-button :size="'larger'" :type="'primary'">挑战失败</el-button>
                </div>
                <span>[ 选择挑战结果 ]</span>
              </div>
            </template>
            <template v-else-if="oprater.name === 'vote'">
              <div class="vote-box">
                <div style="padding-top: 20px;">
                  <el-button :size="'larger'" :type="'primary'">进行投票</el-button>
                </div>
                <span>[ 当前选择：未选择 ]</span>
              </div>
            </template>
          </template>
        </template>
        <template v-else>
          当前不可操作
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.chat-room {
  width: 80em;
  height: 32em;
  margin-top: 1em;
}

.justice-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &>span {
    font-size: 0.75em;
    color: #999;
  }
}

.vote-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &>span {
    font-size: 0.75em;
    color: #999;
  }
}

.main {
  background-color: #444;
  border-radius: 20px;
  padding: 20px;

}

.players {
  height: 6em;
  display: flex;
  width: 80em;
  flex-wrap: wrap;
  padding: 5px;
  align-items: center;
  justify-content: center;
  background-color: #333;
  border-radius: 20px;
}

.oprate {
  background-color: #333;
  border-radius: 20px;
  padding: 10px;
  font-size: large;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #999;
  height: 4em;
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