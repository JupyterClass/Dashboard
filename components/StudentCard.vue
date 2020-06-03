<template>
  <div class="student-card">
    <h3>{{ student.id }}</h3>
  </div>
</template>

<script>
export default {
  name: "StudentCard",
  props: ['student']
};
</script>

<style scoped>
.student-card {
  background-color: white;
  box-shadow: 0 2px 6px 1px #d5d8e2;
  padding: 8px;
  margin: 8px;
  border-radius: 4px;
}
</style>
