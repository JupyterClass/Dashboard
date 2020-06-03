<template>
  <div class="main">
    <div class="sider">
      <sider/>
    </div>
    <div class="content">
      <div class="content-primary">
        <statistics/>
        <div class="classroom-layout-wrapper">
          <classroom-layout/>
        </div>
      </div>
      <div class="content-secondary">
        <students/>
      </div>
    </div>
  </div>
</template>

<script>
import socket from '~/plugins/socket.io.js';
import {
  Layout as ALayout,
  Row as ARow,
  Col as ACol,
} from 'ant-design-vue';
import Sider from "../components/Sider";
import Questions from "../components/Questions";
import StatCard from "../components/StatCard";
import Statistics from "../components/Statistics";
import ClassroomLayout from "../components/ClassroomLayout";
import Students from "../components/Students";

export default {
  components: {
    Students,
    ClassroomLayout,
    Statistics,
    StatCard,
    ALayout,
    ALayoutSider: ALayout.Sider,
    ALayoutContent: ALayout.Content,
    ARow,
    ACol,
    Sider,
    Questions,
  },
  beforeCreate() {
    // Init vuex store
    this.$axios.get(process.env.API_SYNC_STORES)
      .then(response => {
        this.$store.commit('syncStore', response.data);
      });

    // Register events
    socket.on('store-update', data => {
      this.$store.commit('syncStore', data);
    })
  },

  computed: {
    notebooks() {
      return this.$store.state.NotebookStore;
    },
    questions() {
      return this.$store.state.QuestionStore;
    }
  }
}
</script>

<style scoped>
.main {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: scroll;
}

.sider {
  width: 228px;
}

.content {
  flex: 1;
  display: flex;
  padding: 16px 16px 16px 8px;
}

.content-primary {
  flex: 2;
  display: flex;
  flex-direction: column;
}

.content-secondary {
  flex: 1;
  margin-left: 16px;
}

.classroom-layout-wrapper {
  flex: 1;
  padding-top: 16px;
}

</style>
