<template>
    <div class="player">
        <avatar :camp="player.role.camp" :dead="!player.alive" :word="player.role.word"></avatar>
        <span>{{ player.name }}</span>
    </div>
</template>
<script lang="ts" setup>
import { toRefs } from 'vue';
import avatar from './avatar.vue';
const props = defineProps<{
    player: Player
}>();
const { player } = toRefs(props);
</script>
<style lang="less" scoped>
.player {
    display: flex;
    align-items: center;
    flex-direction: column;

    span {
        font-size: 1.25em;
        font-weight: bold;
    }
}
</style>