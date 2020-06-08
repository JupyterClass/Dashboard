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
      currentTime: dayjs(Date.now()).format('hh:mm:ss a'),
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
}
</style>
