<template>
  <div class="status" :style="{ color, fontWeight: 'bold' }">
    <div class="circle" :style="{ backgroundColor: color }" />
    {{ text || 'STATUS' }}
  </div>
</template>

<script>
export default {
  name: "status",
  props: ['text', 'color']
};
</script>

<style scoped>
.circle {
  content: "";
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50px;
  background-color: lightgrey;
}
</style>
