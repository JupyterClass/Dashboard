<template>
  <div class="students">
    <h1>Students</h1>
    <student-card v-for="(student, i) in students"
                  :key="'student-' + i"
                  :student="student"/>
  </div>
</template>

<script>
import StudentCard from "./StudentCard";
export default {
  name: "Students",
  components: { StudentCard },
  computed: {
    students() {
      return Object.values(this.$store.state.StudentStore) || [];
    }
  }
};
</script>

<style scoped>
.students {
  padding: 20px;
  height: 100%;
}
</style>
