<template>
  <div class="container">
    <div>
      <div class="brand">
        <img src="~/assets/icon.jpg" width="200" alt="JupyterClass icon" />
        <h1>Jupyter Class</h1>
      </div>
      <div class="notebooks">
        <div class="notebook-container"
           v-for="(notebook, i) in notebooks"
           :key="'notebook-' + i"
           @click="handleNotebookClick(notebook)"
           :style="{
              flex: notebook.id === selectedNotebook ? 10 : 0.001,
           }">
        {{ notebook.id }}

        <div class="notebook-status-indicator"
             :style="{
                backgroundColor: notebook.id === selectedNotebook ? '#57de9b' : '#ff9ea0',
             }">
        </div>
        <questions v-if="notebook.id === selectedNotebook" />
      </div>
      </div>
    </div>
    <div class="upload">
      <upload />
    </div>
  </div>
</template>

<script>
import Upload from './Upload';
import Questions from './Questions';

export default {
  name: "Sider",
  components: { Questions, Upload },
  data() {
    return {
      selectedNotebook: '',
    }
  },

  computed: {
    selectedNotebook() { return this.$store.state.selectedNotebook },
    notebooks() { return this.$store.state.NotebookStore },
  },

  methods: {
    handleNotebookClick(notebook) {
      this.$store.commit('setSelectedNotebook', notebook);
      this.selectedNotebook = notebook.id;
    }
  }
};
</script>

<style scoped>

  .brand > h1 {
    width: 100%;
    text-align: center;
    padding-top: 5px;
    color: #3d6788;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  .container {
    display: flex;
    flex-direction: column;
    flex-basis: auto;
    justify-content: space-between;
    height: 100%;
  }

  .notebooks {
    display: flex;
    flex-direction: column;
    flex-basis: auto;
    height: 100%;
  }

  .notebook-container {
    min-height: 30px;
    position: relative;
    padding: 5px;
    margin: 10px;
    box-shadow: 0 2px 6px 1px #d5d8e2;
    border-radius: 4px;
    overflow: hidden;
    transition: all 0.4s;
  }

  .notebook-container:hover {
    transform: translateX(5px);
  }

  .notebook-status-indicator {
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    width: 7px;
    background-color: #ff9ea0;
    transition: background-color 0.2s;
    /*box-shadow: -2px 0 1px 1px #ffb5b7;*/
  }

  .upload {
    width: 100%;
    padding: 5px;
  }

</style>
