<script setup lang="ts">
defineProps<{
  contents1: string | number;
  contents2?: string | number;
}>();
</script>
<template>
  <div class="column justify-center">
    <span class="main">{{ contents1 }}</span>
    <span class="sub">{{ contents2 }}</span>
  </div>
</template>
<style lang="scss" scoped>
.main {
  margin-bottom: -4px;
}
.sub {
  color: #bbb;
  font-size: 11px;
  font-weight: lighter;
}
</style>
