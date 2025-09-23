<script setup lang="ts">
type props = {
    word?: string, src?: string
    dead: boolean;
    size?: 'small' | 'medium' | 'large';
    camp?: 'human' | 'wolf' | 'master' | 'unknown'
}

const props = withDefaults(defineProps<props>(), {
    camp: 'unknown',
    size: 'medium'
});

</script>
<template>
    <div class="avatar" :class="{ 'dead': dead, [size]: true, [camp]: true }">
        <img v-if="src" :src="src" :alt="word" />
        <span v-else>{{ word }}</span>
    </div>
</template>
<style lang="less" scoped>
.avatar {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    border: 5px solid;
    border-radius: 10%;
    width: 5em;
    height: 5em;
    border-color: greenyellow;
    margin: 4px;
    animation: breathe-glow 2s ease-in-out infinite;

    &.dead {
        border-color: red !important;
        color: red !important;
        background-color: #000 !important;
        box-shadow: 0 0 20px rgb(255, 0, 0) !important;
    }
}

.avatar {
    &.human {
        background-color: rgb(1, 217, 255);
        color: rgb(255, 251, 0);
    }

    &.wolf {
        background-color: rgb(255, 72, 0);
    }

    &.master {
        background-color: rgb(255, 251, 0);
        color: #000;
    }

    &.unknown {
        background-color: rgb(153, 153, 153);
    }

}

.avatar {
    &>span {
        font-size: 3em;
    }

    &.small {
        font-size: small;
    }

    &.medium {
        font-size: medium;
    }

    &.large {
        font-size: large;
    }
}


@keyframes breathe-glow {
    0% {
        box-shadow:
            0 0 5px rgba(65, 246, 59, 0.5),
            0 0 10px rgba(59, 246, 68, 0.4),
            0 0 15px rgba(81, 246, 59, 0.3),
            0 0 20px rgba(59, 246, 84, 0.2);
    }

    50% {
        box-shadow:
            0 0 10px rgba(59, 246, 59, 0.8),
            0 0 20px rgba(59, 246, 90, 0.6),
            0 0 30px rgba(96, 246, 59, 0.4),
            0 0 40px rgba(90, 246, 59, 0.2);
    }

    100% {
        box-shadow:
            0 0 5px rgba(112, 246, 59, 0.5),
            0 0 10px rgba(90, 246, 59, 0.4),
            0 0 15px rgba(90, 246, 59, 0.3),
            0 0 20px rgba(75, 246, 59, 0.2);
    }
}
</style>
