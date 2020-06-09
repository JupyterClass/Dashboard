<template>
  <div class="container">
    <div>
      <div class="brand">
        <img src="~/assets/icon.jpg" width="200" alt="JupyterClass icon" />
        <h3>Jupyter Class</h3>
      </div>
      <a-select placeholder="Notebook"
                :value="selectedNotebook && selectedNotebook.id"
                style="width: 100%; padding: 10px;">
        <a-select-option v-for="(notebook, i) in notebooks"
                         :key="notebook.id"
                         @click="handleNotebookClick(notebook)">
          {{ notebook.id }}
        </a-select-option>
      </a-select>
    </div>
    <div style="width: 100%; overflow: scroll;">
      <questions />
    </div>
    <div class="upload">
      <upload />
    </div>
  </div>
</template>

<script>
import { Select as ASelect } from 'ant-design-vue';
import Upload from './Upload';
import Questions from './Questions';

export default {
  name: "Sider",
  components: {
    ASelect,
    ASelectOption: ASelect.Option,
    Questions,
    Upload
  },

  computed: {
    selectedNotebook() { return this.$store.state.selectedNotebook },
    notebooks() { return this.$store.state.NotebookStore },
  },

  methods: {
    handleNotebookClick(notebook) {
      if (notebook.id !== this.selectedNotebook) {
        this.$store.commit('setSelectedNotebook', notebook);
        this.$store.commit('setSelectedQuestions',
          Object.values(
            this.$store.state.QuestionStore
              [this.selectedNotebook.id]).map(qn => qn.id)
        );
      }
    }
  }
};
</script>

<style scoped>

  .brand > h3 {
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
    /*justify-content: space-between;*/
    height: 100%;
  }

  .upload {
    width: 100%;
    padding: 8px;
    margin-top: auto;
    box-shadow: inset 0 0 8px #adafc4;
    border-radius: 8px;
    z-index: 1;
  }

  @media (max-width: 1023px) {
    .brand {
      display: none;
    }
  }

</style>
