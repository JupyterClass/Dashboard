<template>
  <div class="student-card">
    <h3>{{ student.id }}</h3>
    <div>
      <div v-for="(attemptedQuestion, i) of attemptedQuestions"
           :key="student.id + '-AQ-' + i">
        <div class="progress-indicator">
          <code class="question-id">{{ attemptedQuestion.questionId }}</code>
          <a-progress class="progress-bar" :percent="attemptedQuestion.completeness" size="small"/>
        </div>
      </div>
      <div class="timestamp">
        {{ lastAttemptMinsAgo }}
      </div>
    </div>

  </div>
</template>

<script>
import dayjs from 'dayjs';
import { Progress as AProgress } from 'ant-design-vue';
export default {
  name: "StudentCard",
  props: ['student'],
  components: { AProgress },

  computed: {
    attemptedQuestions() {

      let attemptedQuestions = [];

      if (!this.$store.state.selectedNotebook) {
        return attemptedQuestions;
      }

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

      attemptedQuestions.sort((a, b) => {
        if (a.questionId < b.questionId) return -1;
        if (a.questionId > b.questionId) return 1;
        return 0;
      });

      return attemptedQuestions;
    },
    lastAttemptMinsAgo() {
      if (this.attemptedQuestions.length > 0) {
        let lastAttemptTimestamp = 0;
        for (const attempt of this.attemptedQuestions) {
          if (attempt.updatedAt > lastAttemptTimestamp) {
            lastAttemptTimestamp = attempt.updatedAt;
          }
        }
        return this.timestampToMinsAgo(lastAttemptTimestamp);
      }
    }
  },

  methods: {
    timestampToMinsAgo(timestamp) {
      const minDiff = dayjs().diff(dayjs(timestamp), 'minute');
      if (minDiff === 0) {
        return 'Less than a min ago';
      }
      return minDiff + ' mins ago';
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
.progress-indicator {
  display: flex;
}
.progress-indicator .question-id {
  white-space: nowrap;
  margin-right: 8px;
}
.progress-indicator .progress-bar {
  min-width: 188px;
}
.timestamp {
  text-align: right;
}
</style>
