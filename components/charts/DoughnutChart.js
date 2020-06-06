import { Doughnut } from "vue-chartjs";
export default {
  extends: Doughnut,
  name: "DoughnutChart",
  props: ["data", "options"],
  mounted() {
    // this.chartData is created in the mixin.
    // If you want to pass options please create a local options object
    this.renderChart(this.data, {
      // options
      animation: false
    });
  },
  watch: {
    data() {
      this.renderChart(this.data, {animation: false});
    }
  }
};
