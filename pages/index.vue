<template>
  <div class="main">
    <a-modal
      v-if="isMobileView && modalVisible"
      :visible="modalVisible"
      :footer="[]"
      @cancel="modalVisible = false"
    >
      <sider/>
    </a-modal>
    <a-button v-if="isMobileView"
              @click="modalVisible = true"
              shape="circle"
              icon="menu"
              type="primary"
              class="affix"/>
    <div v-else class="sider">
      <sider/>
    </div>
    <div class="content-primary">
      <statistics/>
    </div>
    <div class="content-secondary">
      <students/>
    </div>
  </div>
</template>

<script>
import socket from '~/plugins/socket.io.js';
import {
  Layout as ALayout,
  Row as ARow,
  Col as ACol,
  Button as AButton,
  Modal as AModal,
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
    AButton,
    AModal,
    ALayoutSider: ALayout.Sider,
    ALayoutContent: ALayout.Content,
    ARow,
    ACol,
    Sider,
    Questions,
  },

  data() {
    return {
      winResizeFn: null,
      modalVisible: false,
      isMobileView: window ? window.innerWidth < 1024 : true,
    }
  },

  beforeCreate() {
    // Init vuex store
    this.$axios.get(process.env.API_SYNC_STORES)
      .then(response => {
        this.$store.commit('syncStore', response.data);
        this.$store.commit('setSelectedNotebook', Object.values(this.notebooks)[0]);
        this.$store.commit('setSelectedQuestions',
          Object.values(this.questions[this.selectedNotebook.id]).map(qn => qn.id)
        );
      });

    // Register events
    socket.on('store-update', data => {
      this.$store.commit('syncStore', data);
    });
    socket.on('students-update', data => {
      this.$store.commit('syncStudents', data);
    });
    socket.on('questions-update', data => {
      this.$store.commit('syncQuestions', data);
    })
  },

  mounted() {
    this.winResizeFn = window.addEventListener('resize', () => {
      this.isMobileView = window.innerWidth < 1024;
    });
  },

  destroyed() {
    window.removeEventListener('resize', this.winResizeFn);
  },

  computed: {
    notebooks() {
      return this.$store.state.NotebookStore;
    },
    questions() {
      return this.$store.state.QuestionStore;
    },
    selectedNotebook() {
      return this.$store.state.selectedNotebook;
    },
  },
}
</script>

<style scoped>
.main {
  display: flex;
  height: 100vh;
  width: 100vw;
  overflow: scroll;
}

.affix {
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 2;
  height: 50px; width: 50px;
}

.sider {
  width: 228px;
}

.content {
  display: flex;
  padding: 16px 16px 16px 8px;
}

.content-primary {
  flex: 2;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: scroll;
}

.content-secondary {
  flex: 1;
  overflow: scroll;
  height: 100%;
}

@media (max-width: 1023px) {
  .main {
    flex-direction: column;
    height: auto;
  }
}

</style>
