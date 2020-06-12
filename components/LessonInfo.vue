<template>
  <div class="lesson-info">
    <div v-if="selectedNotebook">
      <h1>{{selectedNotebook.id }}</h1>
      <a-popconfirm placement="bottom" @confirm="handleDeleteClick">
        <template slot="title">
          <p>Confirm delete notebook?</p>
          <p>This will erase all related to this notebook!</p>
        </template>
        <a-button ghost type="danger" icon="delete" shape="circle" />
      </a-popconfirm>
      <a-button ghost type="primary" icon="question" shape="circle" />
    </div>
    <clock class="clock"/>
  </div>
</template>

<script>
import socket from '~/plugins/socket.io.js';
import {
  Button as AButton,
  Popconfirm as APopconfirm,
} from "ant-design-vue";
import Clock from "./Clock";
export default {
  name: "LessonInfo",
  components: { AButton, APopconfirm, Clock },
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
