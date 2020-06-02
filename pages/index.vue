<template>
  <div style="height: 100vh; width: 100vw; overflow: hidden;">
    <a-row style="height: 100%">
      <a-col :xs="4"
             style="height: 100%; background-color: #ffffff">
        <sider/>
      </a-col>
      <a-col :xs="20" style="height: 100%; background-color: #f4f8ff">

      </a-col>
    </a-row>
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

export default {
  components: {
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

    // Register event
    // socket.on('store-update', data => {
    //   this.$store.commit('syncStore', data);
    // })
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

</style>
