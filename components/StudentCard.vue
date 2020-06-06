<template>
  <div class="student-card">
    <div class="student-profile">
      <h3>{{ student.id }}</h3>
<!--      <div>-->
<!--        <a-icon type="dashboard"/> {{ attemptSpeed }}-->
<!--      </div>-->
    </div>
    <div class="progress">
      <div v-for="(attemptedQuestion, i) of attemptedQuestions"
           :key="student.id + '-AQ-' + i">
        <div class="progress-indicator">
          <div class="question-id">{{ attemptedQuestion.questionId }}</div>
          <a-progress class="progress-bar" :percent="attemptedQuestion.completeness" size="small"/>
          <div style="white-space: nowrap">
            {{ strftime(timeTaken(attemptedQuestion)) }}
          </div>
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
import {
  Icon as AIcon,
  Progress as AProgress,
} from 'ant-design-vue';
export default {
  name: "StudentCard",
  props: ['student'],
  components: { AIcon, AProgress },

  computed: {
    attemptedQuestions() {

      console.log('EXPENSIVE COMPUTATION');

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
        if (this.$store.state.selectedQuestions.has(questionId)) {
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
    },
    attemptSpeed() {
      let totalTimeTakenInSeconds = 0;
      for (const attemptedQuestion of this.attemptedQuestions) {
        if (attemptedQuestion.completedAt) {
          totalTimeTakenInSeconds += this.timeTaken(attemptedQuestion);
        }
      }
      const averageTimeTakenInSeconds = totalTimeTakenInSeconds / this.attemptedQuestions.length;
      return this.strftime(averageTimeTakenInSeconds);
    }
  },

  methods: {
    timestampToMinsAgo(timestamp) {
      const minDiff = dayjs().diff(dayjs(timestamp), 'minute');
      if (minDiff === 0) {
        return 'Less than a min ago';
      }
      return minDiff + ' mins ago';
    },

    secondsSince(timestamp) {
      return dayjs().diff(dayjs(timestamp), 'seconds');
    },

    timeTaken(attemptedQuestion) {
      const questionStartTime = this.questionStartTime(attemptedQuestion);

      if (!attemptedQuestion.completedAt) {
        return this.secondsSince(questionStartTime);
      }
      return (
        attemptedQuestion.completedAt - questionStartTime
      ) / 1000;
    },

    questionStartTime(attemptedQuestion) {
      return this.$store.state.QuestionStore[this.$store.state.selectedNotebook.id][attemptedQuestion.id]['startTime'];
    },

    strftime(timeInSeconds) {
      if (timeInSeconds < 0) {
        return '-';
      }
      if (timeInSeconds <= 60) {
        return timeInSeconds + ' secs';
      }
      return Math.round(timeInSeconds / 60) + ' mins';
    }
  }
};
</script>

<style scoped>
.student-card {
  display: flex;
  align-items: center;
  background-color: white;
  box-shadow: 0 2px 6px 1px #d5d8e2;
  padding: 8px;
  margin: 8px;
  border-radius: 4px;
}
.student-profile {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 100px;
  border-radius: 4px;
  margin-right: 8px;
}
.progress {
  flex: 1;
}
.progress-indicator {
  display: flex;
  align-items: center;
}
.progress-indicator .question-id {
  white-space: nowrap;
  margin-right: 8px;
}
.progress-indicator .progress-bar {
  min-width: 100px;
}
.timestamp {
  text-align: right;
}
</style>
