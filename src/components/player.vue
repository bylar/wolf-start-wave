<template>
    <avatar :camp="player.role.camp" :dead="!player.alive" :word="player.role.word"></avatar>
</template>
<script lang="ts" setup>
import { toRefs } from 'vue';
import avatar from './avatar.vue';
const props = defineProps<{
    player: Player
}>();
const { player } = toRefs(props);
</script>