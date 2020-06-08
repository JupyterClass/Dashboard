import { Bar } from "vue-chartjs";
export default {
  extends: Bar,
  name: "LineChart",
  props: ["title", "data", "options"],
  methods: {
    render() {
      this.renderChart(this.data, {
        title: {
          display: true,
          text: this.title,
        },
        ...this.options
      });
    }
  },
  mounted() {
    this.render();
  },
  watch: {
    data() {
      this.render();
    }
  }
};
