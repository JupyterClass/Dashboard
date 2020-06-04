<template>
  <div class="student-card">
    <h3>{{ student.id }}</h3>
    <div>
      <div v-for="(attemptedQuestion, i) of attemptedQuestions"
           :key="student.id + '-AQ-' + i">
        {{ attemptedQuestion.questionId }}
        {{ attemptedQuestion.completeness }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StudentCard",
  props: ['student'],
  computed: {

    attemptedQuestions() {

      let attemptedQuestions = [];

      if (!this.$store.state.selectedNotebook) {
        return attemptedQuestions;
      }

      console.log(this.student.id);
      const notebookProgress = this.$store.state
        .StudentStore[this.student.id]
        .progress[this.$store.state.selectedNotebook.id];

      if (!notebookProgress) {
        return attemptedQuestions;
      }

      for (const [questionId, completeness] of Object.entries(notebookProgress)) {
        if (this.$store.state.QuestionStore
            [this.$store.state.selectedNotebook.id]
            [questionId].isLive) {
          attemptedQuestions.push({ questionId, ...completeness });
        }
      }
      return attemptedQuestions;
    }
  }
};
</script>

<style scoped>
.student-card {
  background-color: white;
  box-shadow: 0 2px 6px 1px #d5d8e2;
  padding: 8px;
  margin: 8px;
  border-radius: 4px;
}
</style>
