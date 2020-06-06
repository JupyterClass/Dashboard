<template>
  <div class="questions">
    <question-card v-for="(question, i) in questions"
                   :question="question"
                   :key="question.practiceId + question.id + i" />
  </div>
</template>

<script>
  import QuestionCard from "./QuestionCard";

  export default {
    name: "Questions",
    components: {
      QuestionCard,
    },

    computed: {
      questions() {
        const selectedNotebook = this.$store.state.selectedNotebook;
        if (selectedNotebook) {
          const questionTree = this.$store.state.QuestionStore;
          return Object.values(questionTree[selectedNotebook.id]);
        }
        return [];
      }
    },
  };
</script>

<style scoped>
  .questions {
    display: flex;
    flex-direction: column;
    overflow: scroll;
    background-color: #ffffff;
    margin: 5px;
    border-radius: 4px;
    min-height: 20px;
  }
</style>
