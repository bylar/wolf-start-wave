<script setup lang="ts">
import Avatar from './components/avatar.vue';

</script>

<template>
  <div style="width: 100%; height: 100%; display: flex; justify-content: center; align-items: center;">
    <Avatar :size="'medium'" :dead="false" :word="'裁'" :camp="'master'"></Avatar>
    <Avatar :size="'medium'" :dead="false" :word="'狼'" :camp="'wolf'"></Avatar>
    <Avatar :size="'medium'" :dead="true" :word="'人'" :camp="'human'"></Avatar>
    <Avatar :size="'medium'" :dead="true" :word="'狼'" :camp="'wolf'"></Avatar>
    <Avatar :size="'medium'" :dead="true" :word="'猎'" :camp="'human'"></Avatar>
    <Avatar :size="'medium'" :dead="true" :word="'迷'" :camp="'unknown'"></Avatar>
    <Avatar :size="'medium'" :dead="true" :word="'巫'" :camp="'human'"></Avatar>

  </div>
</template>

<style scoped></style>
