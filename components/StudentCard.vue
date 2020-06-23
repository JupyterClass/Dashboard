<template>
  <div class="student-card" @click="visible = !visible">
    <div class="student-card-head">
      <h3 class="student-profile">
        {{ student.id }}
      </h3>
      <div class="timestamp">
        {{ lastAttemptMinsAgo }}
      </div>
    </div>
    <div v-show="visible" class="progress">
      <div v-for="(attemptedQuestion, i) of attemptedQuestions"
           :key="student.id + '-AQ-' + i">
        <div class="progress-indicator">
          <div class="question-id">{{ attemptedQuestion.id }}</div>
          <a-progress class="progress-bar" :percent="attemptedQuestion.completeness" size="small"/>
          <div style="white-space: nowrap">
            {{ strftime(timeTaken(attemptedQuestion)) }}
          </div>
        </div>
      </div>
    </div>
    <accent :color="hasFinishedAllQuestions ? '#45b1ff' : '#ff6388'"
            alignment="left"/>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import {
  Icon as AIcon,
  Progress as AProgress,
} from 'ant-design-vue';
import Accent from "./Accent";

export default {
  name: "StudentCard",
  props: ['student', 'attemptedQuestions'],
  components: { AIcon, AProgress, Accent },

  data() {
    return {
      visible: true,
    }
  },

  mounted() {
    this.visible = !this.hasFinishedAllQuestions;
  },

  computed: {

    hasFinishedAllQuestions() {
      const selectedNotebook = this.$store.state.selectedNotebook;
      if (!selectedNotebook) {
        return true;
      }
      for (const qnId of this.$store.state.selectedQuestions) {
        const practice = this.student.progress[selectedNotebook.id];
        if (!practice) {
          return false;
        }
        const questionAttempt = practice[qnId];
        if (!questionAttempt || questionAttempt.completeness !== 100) {
          return false;
        }
      }
      return true;
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
      return minDiff + 'm ago';
    },

    secondsSince(timestamp) {
      return dayjs().diff(dayjs(timestamp), 'second');
    },

    timeTaken(attemptedQuestion) {
      const questionStartTime = this.questionStartTime(attemptedQuestion);
      if (!questionStartTime) {
        // Sonic the hedgehog coder finished even before the instructor got to the qn
        return -1;
      }

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
        return Math.round(timeInSeconds) + 's';
      }
      return Math.floor(timeInSeconds / 60) + 'm';
    }
  },
};
</script>

<style scoped>
.student-card {
  position: relative;
  background-color: white;
  box-shadow: 0 2px 6px 1px #d5d8e2;
  padding: 8px 8px 8px 14px;
  margin: 8px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
}
.student-card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.student-profile {
  margin: 0 8px 4px 0 !important;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}
.student-profile > div {
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
  min-width: 70px;
}
.timestamp {
  text-align: right;
  font-size: 0.9em;
  color: #999da8;
}
</style>
