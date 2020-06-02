<template>
  <div class="statistics">
    <stat-card title="completed"
               stat="88%"
               icon="pie-chart"
               accent-color="#3eb5ff"/>
    <stat-card title="Avg speed"
               stat="10m 43s"
               icon="dashboard"
               accent-color="#3eb5ff"/>
  </div>
</template>

<script>
import StatCard from "./StatCard";
export default {
  name: "Statistics",
  components: { StatCard }
};
</script>

<style scoped>
.statistics {
  display: flex;
}
.statistics > div {
  margin: 10px;
  color: #3eb5ff;
}
</style>
