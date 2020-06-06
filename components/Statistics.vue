<template>
  <div class="statistics">
<!--    <stat-card title="completed"-->
<!--               stat="88%"-->
<!--               icon="pie-chart"-->
<!--               accent-color="#3eb5ff"/>-->
<!--    <stat-card title="Avg speed"-->
<!--               stat="10m 43s"-->
<!--               icon="dashboard"-->
<!--               accent-color="#3eb5ff"/>-->
    <accent-card title="CLASS PROGRESS">
      <doughnut-chart :data="chartData" :options="chartOptions" />
    </accent-card>
  </div>
</template>

<script>
import AccentCard from "./charts/AccentCard";
import DoughnutChart from "./charts/DoughnutChart";
export default {
  name: "Statistics",
  components: { AccentCard, DoughnutChart },
  data() {
    return {
      chartOptions: {
        hoverBorderWidth: 20
      },
    };
  },
  computed: {
    chartData() {

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
    }
  }
};
</script>

<style scoped>
.statistics {
  display: flex;
}
.statistics > div {
  margin: 10px;
  color: #3eb5ff;
}
.pie-chart {
  box-shadow: 0 2px 6px 1px #d5d8e2;
  padding: 8px;
  border-radius: 4px;
}
</style>
