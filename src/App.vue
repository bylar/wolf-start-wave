<script setup lang="ts">
import { Game } from './game';
import StageWelcome from './stage-welcome.vue';

const game = new Game();

</script>

<template>
  <template v-if="game.state.stage == 'Welcome'">
    <StageWelcome :game="game"></StageWelcome>
  </template>

</template>

<style scoped></style>
