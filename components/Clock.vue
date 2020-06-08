<template>
  <div v-bind="$attrs">
    <code class="clock-text">{{ currentTime }}</code>
  </div>
</template>

<script>
import dayjs from "dayjs";

export default {
  name: "Clock",
  data() {
    return {
      intervalFn: null,
      currentTime: dayjs(Date.now()).format('HH:mm:ss'),
    }
  },
  mounted() {
    this.intervalFn = setInterval(() => {
      this.currentTime = dayjs(Date.now()).format('HH:mm:ss');
    }, 1000);
  }
};
</script>

<style scoped>
.clock-text {
  font-size: 3.2vmax;
  color: #8993a9;
  background-color: #e8f0ff;
  box-shadow: inset 4px 4px 8px #c3c5e6, inset -4px -4px 8px #ffffff;
  border-radius: 500px;
  padding: 2px 5% 2px 5%;
}
</style>
