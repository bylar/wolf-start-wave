<script setup lang="ts">
import { Game } from './game';
import StageWelcome from './stage-welcome.vue';
import stageInviting from './stage-inviting.vue';
import stageMorning from './stage-morning.vue';
import stageDaylight from './stage-daylight.vue';
import stageEvening from './stage-evening.vue';
import stageNight from './stage-night.vue';


const game = new Game();

</script>

<template>
  <template v-if="game.state.stage == 'Welcome'">
    <StageWelcome :game="game"></StageWelcome>
  </template>
  <template v-else-if="game.state.stage == 'Inviting'">
    <stageInviting :game="game"></stageInviting>
  </template>
  <template v-else-if="game.state.stage == 'Morning'">
    <stageMorning :game="game"></stageMorning>
  </template>
  <template v-else-if="game.state.stage == 'Daylight'">
    <stageDaylight :game="game"></stageDaylight>
  </template>
  <template v-else-if="game.state.stage == 'Evening'">
    <stageEvening :game="game"></stageEvening>
  </template>
  <template v-else-if="game.state.stage == 'Night'">
    <stageNight :game="game"></stageNight>
  </template>

</template>

<style scoped></style>
