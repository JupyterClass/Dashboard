<template>
  <div v-bind="$attrs">
    {{ currentTime }}
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
      this.currentTime = dayjs(Date.now()).format('hh:mm:ss a');
    }, 1000);
  }
};
</script>

<style scoped>

</style>
