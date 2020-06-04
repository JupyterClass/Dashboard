<template>
  <div class="students">
    <div class="header">
      <h1>Students</h1>
      <a-button type="danger" shape="round" @click="handleKickAll">
        Kick All
      </a-button>
    </div>
    <student-card v-for="(student, i) in students"
                  :key="'student-' + i"
                  :student="student"/>
  </div>
</template>

<script>
import { Button as AButton } from "ant-design-vue";
import StudentCard from "./StudentCard";
export default {
  name: "Students",
  components: { AButton, StudentCard },
  computed: {
    students() {
      return Object.values(this.$store.state.StudentStore) || [];
    }
  },
  methods: {
    handleKickAll() {
      // TODO:
      //  1. are you sure?
      //  2. eject all students from the server
    }
  }
};
</script>

<style scoped>
.students {
  padding: 20px;
  height: 100%;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
