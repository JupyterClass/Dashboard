<template>
  <div class="lesson-info">
    <div v-if="selectedNotebook">
      <h1>{{selectedNotebook.id }}</h1>
      <a-button ghost type="danger" icon="delete" shape="circle" @click="handleDeleteClick" />
      <a-button ghost type="primary" icon="question" shape="circle" />
    </div>
    <clock class="clock"/>
  </div>
</template>

<script>
import socket from '~/plugins/socket.io.js';
import { Button as AButton } from "ant-design-vue";
import Clock from "./Clock";
export default {
  name: "LessonInfo",
  components: { AButton, Clock },
  methods: {
    handleDeleteClick() {
      socket.emit('client-delete-practice', this.$store.state.selectedNotebook.id);
    }
  },
  computed: {
    selectedNotebook() {
      return this.$store.state.selectedNotebook;
    },
  }
};
</script>

<style scoped>
.lesson-info {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  padding: 8px;
}

.clock {
  height: 100%;
  margin-left: 16px;
  /*background-color: red;*/
}
</style>
