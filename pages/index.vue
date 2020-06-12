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
      <div>
        <div class="lesson-info">
          <div>
            <h1>{{ selectedNotebook ? selectedNotebook.id : '' }}</h1>
            <div>Delte</div>
          </div>
          <clock class="clock"/>
        </div>
        <question-toggles/>
      </div>
      <statistics/>
    </div>
    <div class="content-secondary"
         :style="`flex: ${studentsVisible ? 1 : 0.02}`">
      <a-button class="collapse-btn"
                @click="studentsVisible = !studentsVisible"
                :block="true"
                style="background:#a4a8c6; border: 1px solid white;"
                :icon="studentsVisible ? 'caret-right' : 'caret-left'"
                type="primary"/>
      <students/>
    </div>
  </div>
</template>

<script>
import {
  Layout as ALayout,
  Row as ARow,
  Col as ACol,
  Button as AButton,
  Modal as AModal,
} from 'ant-design-vue';
import Sider from "../components/Sider";
import Questions from "../components/Questions";
import Clock from "../components/Clock";
import QuestionToggles from "../components/QuestionToggles";
import Statistics from "../components/Statistics";
import ClassroomLayout from "../components/ClassroomLayout";
import Students from "../components/Students";

export default {
  components: {
    Students,
    ClassroomLayout,
    Clock,
    Statistics,
    ALayout,
    AButton,
    AModal,
    ALayoutSider: ALayout.Sider,
    ALayoutContent: ALayout.Content,
    ARow,
    ACol,
    Sider,
    Questions,
    QuestionToggles
  },

  data() {
    return {
      winResizeFn: null,
      modalVisible: false,
      studentsVisible: true,
      isMobileView: window ? window.innerWidth < 1024 : true,
    }
  },

  beforeCreate() {
    // Init vuex store
    this.$axios.get('/api/sync-stores')
      .then(response => {
        console.log('response => ', response);
        this.$store.commit('syncStore', response.data);
        console.log('response.data => ', response.data);
        this.$store.commit('setSelectedNotebook', Object.values(this.notebooks)[0]);
        this.$store.commit('setSelectedQuestions',
          Object.values(this.questions[this.selectedNotebook.id]).map(qn => qn.id)
        );
      });
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
  height: 50px;
  width: 50px;
}

.sider {
  width: 228px;
}

.content-primary {
  flex: 2;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: scroll;
  padding-top: 8px;
}

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

.content-secondary {
  position: relative;
  flex: 1;
  overflow: scroll;
  height: 100%;
  transition: flex 0.3s;
  padding-left: 5px;
}

.collapse-btn {
  position: absolute;
  left: 1px;
  top: 50%;
  width: 20px;
  height: 50px;
  z-index: 1;
}

@media (max-width: 1023px) {
  .main {
    flex-direction: column;
    height: auto;
  }
}

</style>
