<template>
  <div class="statistics">
    <clock class="clock"/>
    <doughnut-chart class="doughnut-chart"
                    title="PROGRESS"
                    :data="classProgressChartData"
                    :options="chartOptions" />
    <line-chart class="line-chart"
                title="TIME TAKEN"
                :data="questionsTimeTakenChartData"
                :options="chartOptions" />
  </div>
</template>

<script>
import DoughnutChart from "./charts/DoughnutChart";
import LineChart from "./charts/LineChart";
import Clock from "./Clock";
export default {
  name: "Statistics",
  components: { Clock, LineChart, DoughnutChart },
  data() {
    return {
      chartOptions: {
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
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
            backgroundColor: ["#54caff", "#ff5985"],
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
      let minDuration = 1000; // minutes;
      let maxDuration = -1; // minutes

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
              questionDurations[question.id] = [];
            }
            questionDurations[question.id].push(duration);
            minDuration = Math.min(minDuration, duration);
            maxDuration = Math.max(maxDuration, duration);
          }
        }
      }

      minDuration = Math.max(minDuration, 0);
      maxDuration = Math.max(maxDuration, minDuration + 10);

      const labels = []; // Minimum 10 intervals of 60 secs
      for (let i = minDuration; i <= maxDuration; i++) {
        labels.push(i);
      }
      const numIntervals = (maxDuration - minDuration) || 10;
      const datasets = [];
      for (const questionId in questionDurations) {
        const bins = Array(numIntervals + 1).fill(0);
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
  flex-direction: column;
  height: 100%;
}
.statistics > div {
  margin: 10px;
  color: #3eb5ff;
}
.clock {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  margin-right: 16px;
  text-align: center;
  /*box-shadow: 0 2px 6px 1px #d5d8e2;*/
  /*border-radius: 4px;*/
}
.doughnut-chart {
  flex: 3;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  box-shadow: 0 2px 6px 1px #d5d8e2;
  padding: 8px;
  border-radius: 4px;
}
.line-chart {
  flex: 6;
  box-shadow: 0 2px 6px 1px #d5d8e2;
  padding: 8px;
  border-radius: 4px;
}
</style>
