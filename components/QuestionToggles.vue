<template>
  <div class="question-toggles">
    <a-tag v-for="question in notebookQuestions"
           :color="question.isSelected ? 'blue' : ''"
           :style="`${!question.isSelected ? 'color: rgba(0,0,0,0.3)' : ''}`"
           class="question-toggle"
           @click="handleQuestionToggleClick(question)">
      {{ question.id }}
    </a-tag>
  </div>
</template>

<script>
import { Tag as ATag } from "ant-design-vue";

export default {
  name: "QuestionToggles",
  components: { ATag },
  methods: {
    handleQuestionToggleClick(question) {
      if (this.selectedQuestions.includes(question.id)) {
        this.$store.commit('unsetSelectedQuestion', question.id);
      } else {
        this.$store.commit('setSelectedQuestion', question.id);
      }
    },
  },
  computed: {
    questions() {
      return this.$store.state.QuestionStore;
    },
    selectedNotebook() {
      return this.$store.state.selectedNotebook;
    },
    notebookQuestions() {
      const qns = [];
      const selectedQns = this.selectedQuestions;
      const selectedNb = this.selectedNotebook;
      if (selectedNb) {
        for (const qn of Object.values(this.questions[selectedNb.id])) {
          qns.push({...qn, isSelected: selectedQns.includes(qn.id) });
        }
      }
      return qns;
    },
    selectedQuestions() {
      return this.$store.state.selectedQuestions;
    }
  }
};
</script>

<style scoped>
.question-toggles {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}
.question-toggle {
  margin: 4px;
  cursor: pointer;
}
</style>
