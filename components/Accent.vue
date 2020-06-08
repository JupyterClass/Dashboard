<template>
  <div class="accent"
       :style="`${alignment}: 0; background-color: ${color}`"/>
</template>

<script>
export default {
  name: "Accent",
  props: ['color', 'alignment'],
};
</script>

<style scoped>
.accent {
  position: absolute;
  top: 0;
  right: 0;
  width: 8px;
  height: 100%;
  transition: background-color 0.3s;
}
</style>
