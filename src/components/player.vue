<template>
    <div class="player" :class="{ [props.size]: true }">
        <avatar :size="props.size" :camp="player.role.camp" :dead="!player.alive" :word="player.role.word"></avatar>
        <span :class="{ isMe: player.pcid == pcid }">{{ player.name }}</span>
    </div>
</template>
<script lang="ts" setup>
import { toRefs } from 'vue';
import avatar from './avatar.vue';
import { getLocalPcID } from '../classes/util';
const pcid = getLocalPcID()
const props = defineProps<{
    player: Player
    size: 'small' | 'medium' | 'large';
}>()
const { player } = toRefs(props)
</script>
<style lang="less" scoped>
.player {
    display: flex;
    align-items: center;
    flex-direction: column;

    &>span {
        font-size: 3em;
    }

    &.small {
        font-size: 8px;
        margin: 2px;
    }

    &.medium {
        font-size: medium;
        margin: 8px;
    }

    &.large {
        font-size: large;
        margin: 10px;
    }

    &>span {
        &.isMe {
            color: rgb(3, 217, 255);
        }

        font-size: 1.25em;
        font-weight: bold;
    }
}
</style>