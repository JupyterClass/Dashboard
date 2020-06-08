<template>
  <div class="statistics">
    <div class="progress">
      <div style="padding: 4px;">
        <doughnut-chart class="doughnut-chart"
                        title="PROGRESS"
                        :data="classProgressChartData"
                        :options="{...chartOptions, legend: false}" />
      </div>
      <div class="stat-cards">
        <stat-card accent-color="rgb(84,202,255)"
                   accent-position="left"
                   title="Completed"
                   style="margin-bottom: 8px;"
                   :stat="classProgress.completed"/>
        <stat-card accent-color="rgb(255,89,133)"
                   title="In Progress"
                   :stat="classProgress.incomplete"/>
      </div>
    </div>
    <line-chart class="line-chart"
                title="TIME TAKEN"
                :data="questionsTimeTakenChartData"
                :options="{
                  ...chartOptions,
                  scales: {
                    xAxes: [{
                      scaleLabel: {
                        display: true,
                        labelString: 'Time Taken (mins)'
                      },
                      ticks: {
                        stepSize: 1
                      }
                    }],
                    yAxes: [{
                      position: 'left',
                      scaleLabel: {
                        display: true,
                        labelString: 'Student Count'
                      },
                      ticks: {
                        beginAtZero: true,
                        stepSize: 1
                      }
                    }]
                  },
                }" />
  </div>
</template>

<script>
import DoughnutChart from "./charts/DoughnutChart";
import LineChart from "./charts/LineChart";
import Clock from "./Clock";
import randomcolor from "randomcolor";
import StatCard from "./StatCard";
function getRandomRgba(alpha) {
  return randomcolor({ format: 'rgb' }).replace(')', `, ${alpha})`);
}
const colorMemo = {};

export default {
  name: "Statistics",
  components: {StatCard, Clock, LineChart, DoughnutChart },
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
    classProgress() {
      if (!this.$store.state.selectedNotebook) {
        return [];
      }

      let completed = 0;
      const students = this.$store.state.StudentStore; // TODO: Have helpers in store?
      const practiceId = this.$store.state.selectedNotebook.id;
      const selectedQuestions = this.$store.state.selectedQuestions;
      let incomplete = selectedQuestions.length * Object.keys(students).length;

      for (const student of Object.values(students)) {
        for (const questionId in student.progress[practiceId]) {
          if (selectedQuestions.indexOf(questionId) !== -1) {
            if (student.progress[practiceId][questionId].completeness === 100) {
              completed++;
            }
          }
        }
      }
      return { completed, incomplete: incomplete - completed };
    },

    classProgressChartData() {
      const { completed, incomplete } = this.classProgress;
      return {
        labels: ["Complete", "In Progress"],
        datasets: [
          {
            label: "Completed",
            backgroundColor: ["rgba(84,202,255,0.7)", "rgba(255,89,133,0.7)"],
            borderWidth: 1,
            borderColor: ['rgb(84,202,255)', 'rgb(255,89,133)'],
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
          // if (!questionStartTime) {
          //   // Not started yet
          //   continue;
          // }
          if (selectedQuestions.includes(question.id)) {
            let duration = Math.floor(
              ((question.completedAt || Date.now()) - questionStartTime) / 1000 / 60
            ); // secs

            if (isNaN(duration)) {
              // student already completed before instructor started timing
              duration = 0;
            }

            if (!(question.id in questionDurations)) {
              questionDurations[question.id] = [];
            }
            questionDurations[question.id].push(duration);
            minDuration = Math.min(minDuration, duration);
            maxDuration = Math.max(maxDuration, duration);
          }
        }
      }

      maxDuration = Math.max(maxDuration, minDuration + 10);

      const labels = []; // Minimum 10 intervals of 60 secs
      for (let i = minDuration; i <= maxDuration + 1; i++) {
        labels.push(i);
      }

      const datasets = [];

      for (const questionId in questionDurations) {
        const bins = {};
        for (const duration of questionDurations[questionId]) {
          if (!bins[duration]) {
            bins[duration] = 0;
          }
          bins[duration]++;
        }
        const data = [];
        for (const [duration, count] of Object.entries(bins)) {
          data.push({ x: Number.parseInt(duration), y: count });
        }

        if (!(questionId in colorMemo)) {
          colorMemo[questionId] = getRandomRgba(0.4);
        }

        datasets.push({
          label: questionId,
          backgroundColor: colorMemo[questionId],
          data,
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
}
.progress {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.stat-cards {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4px;
  max-width: 500px;
  max-height: 300px;
}
.stat-cards > div {
  flex: 1;
}
.doughnut-chart {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  /*box-shadow: 0 2px 6px 1px #d5d8e2;*/
  padding: 8px 8px 24px 8px;
  border-radius: 4px;
}
.line-chart {
  flex: 6;
  box-shadow: 0 2px 6px 1px #d5d8e2;
  padding: 4px;;
  border-radius: 4px;
}
</style>
