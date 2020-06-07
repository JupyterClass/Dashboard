<template>
  <div class="statistics">
    <accent-card title="CLASS PROGRESS">
      <doughnut-chart :data="classProgressChartData" :options="chartOptions" />
    </accent-card>
    <accent-card title="TIME TAKEN">
      <bar-chart :data="questionsTimeTakenChartData" :options="chartOptions" />
    </accent-card>
  </div>
</template>

<script>
import AccentCard from "./charts/AccentCard";
import DoughnutChart from "./charts/DoughnutChart";
import BarChart from "./charts/BarChart";
export default {
  name: "Statistics",
  components: { BarChart, AccentCard, DoughnutChart },
  data() {
    return {
      chartOptions: {
        hoverBorderWidth: 20
      },
    };
  },

  computed: {
    classProgressChartData() {

      if (!this.$store.state.selectedNotebook) {
        return [];
      }
      // Live questions only
      let completed = 0;
      let incomplete = 0;

      const students = this.$store.state.StudentStore; // TODO: Have helpers in store?
      const practiceId = this.$store.state.selectedNotebook.id;

      for (const student of Object.values(students)) {
        for (const questionId in student.progress[practiceId]) {
          if (this.$store.state.selectedQuestions.indexOf(questionId) !== -1) {
            if (student.progress[practiceId][questionId].completeness === 100) {
              completed++;
            } else {
              incomplete++;
            }
          }
        }
      }

      return {
        labels: ["Complete", "In Progress"],
        datasets: [
          {
            label: "Completed",
            backgroundColor: ["#41c488", "#ff4d4f"],
            data: [completed, incomplete]
          }
        ]
      }
    },

    questionsTimeTakenChartData() {
      const students = this.$store.state.StudentStore;
      const selectedNotebook = this.$store.state.selectedNotebook;
      const selectedQuestions = this.$store.state.selectedQuestions;

      if (!selectedNotebook) {
        return {};
      }

      const questionDurations = {};
      let minDuration = 100000; // minutes
      let maxDuration = -100000; // minutes
      for (const student of Object.values(students)) {
        const studentAttemptedQuestions = student.progress[selectedNotebook.id];

        if (!studentAttemptedQuestions) {
          continue;
        }

        for (const question of Object.values(studentAttemptedQuestions)) {

          const questionStartTime = this.$store.state.QuestionStore[selectedNotebook.id][question.id].startTime;

          if (selectedQuestions.includes(question.id)) {
            let duration = Math.round(
              ((question.completedAt || Date.now()) - questionStartTime) / 1000 / 60
            ); // secs

            if (!(question.id in questionDurations)) {
              // questionDurations[question.id] = Array(20).fill(0);
              questionDurations[question.id] = [];
            }
            // questionDurations[question.id][duration]++;
            questionDurations[question.id].push(duration);
            minDuration = Math.min(minDuration, duration);
            maxDuration = Math.max(maxDuration, duration);
          }
        }
      }

      maxDuration = Math.max(maxDuration, minDuration + 10);

      const labels = []; // Minimum 10 intervals of 60 secs
      for (let i = minDuration; i <= maxDuration; i++) {
        labels.push(i);
      }

      const numIntervals = maxDuration - minDuration;
      const datasets = [];
      for (const questionId in questionDurations) {
        const bins = Array(numIntervals).fill(0);
        console.log(bins);
        for (const duration of questionDurations[questionId]) {
          bins[duration]++;
        }
        datasets.push({
          label: questionId,
          borderWidth: 1,
          data: bins,
        })
      }

      return {
        labels,
        datasets
      }
    }
  }
};
</script>

<style scoped>
.statistics {
  display: flex;
  flex-wrap: wrap;
}
.statistics > div {
  flex: 1;
  margin: 10px;
  color: #3eb5ff;
}
.pie-chart {
  box-shadow: 0 2px 6px 1px #d5d8e2;
  padding: 8px;
  border-radius: 4px;
}
</style>
