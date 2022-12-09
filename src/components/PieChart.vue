<script>
import { Pie } from "vue-chartjs";

export default {
  extends: Pie,
  data() {
    return {
      data: {
        labels: [],
        datasets: [],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        tooltips: {
          mode: "dataset",
          callbacks: {
            label: function (tooltipItem, data) {
              let time = Math.floor(
                data.datasets[tooltipItem.datasetIndex].data[
                  tooltipItem.index
                ] / 60
              );
              if (time > 60) {
                time =
                  Math.floor(
                    data.datasets[tooltipItem.datasetIndex].data[
                      tooltipItem.index
                    ] /
                      60 /
                      60
                  ).toString() +
                  " h " +
                  Math.floor(
                    (data.datasets[tooltipItem.datasetIndex].data[
                      tooltipItem.index
                    ] /
                      60) %
                      60
                  ).toString() +
                  " min";
              } else {
                time = Math.floor(time).toString() + " min";
              }
              return data.labels[tooltipItem.index] + " : " + time;
            },
          },
        },
      },
    };
  },
  mounted() {
    // this.addPlugin({
    //   afterDraw(chart) {
    //     const legend = chart.legend;
    //     legend.top = chart.height - legend.height / 2 - legend.top / 2;
    //   },
    // });
    let days = this.$store.state.days.slice(0, 7);
    let tasks = this.$store.state.tasksPerDate.slice(0, 7);
    this.render(days.reverse(), tasks.reverse());
  },
  methods: {
    render(days, tasks) {
      this.data.labels = [];
      this.data.datasets = [];

      let data = [];
      let categoryName = [];
      let colorArray = [];
      let back_ground = [];
      for (let i = 0; i < this.$store.state.runTaskCategory.length; i++) {
        let categorySum = 0;
        categoryName.push(this.$store.state.runTaskCategory[i].name);

        for (let j = 0; j < tasks.length; j++) {
          for (let k = 0; k < tasks[j].length; k++) {
            if (
              tasks[j][k].category_id == this.$store.state.runTaskCategory[i].id
            ) {
              categorySum += tasks[j][k].subtime;
            }
          }
        }

        data.push(categorySum);

        let color = "none";
        let background = "none";
        switch (this.$store.state.runTaskCategory[i].color_id) {
          case 0:
            color = "#F44336";
            background = "#FFCDD2";
            break;
          case 1:
            color = "#E91E63";
            background = "#F8BBD0";
            break;
          case 2:
            color = "#9C27B0";
            background = "#E1BEE7";
            break;
          case 3:
            color = "#3F51B5";
            background = "#C5CAE9";
            break;
          case 4:
            color = "#2196F3";
            background = "#BBDEFB";
            break;
          case 5:
            color = "#00BCD4";
            background = "#B2EBF2";
            break;
          case 6:
            color = "#009688";
            background = "#B2DFDB";
            break;
          case 7:
            color = "#4CAF50";
            background = "#C8E6C9";
            break;
          case 8:
            color = "#CDDC39";
            background = "#F0F4C3";
            break;
          case 9:
            color = "#FF9800";
            background = "#FFE0B2";
            break;
          case 10:
            color = "#795548";
            background = "#D7CCC8";
            break;
          case 11:
            color = "#000000";
            background = "#BDBDBD";
            break;
        }
        colorArray.push(color);
        back_ground.push(background);
      }

      this.data.labels = categoryName;
      const dataSet = {
        data: data,
        borderColor: colorArray,
        backgroundColor: back_ground,
        borderWidth: 2,
      };
      this.data.datasets.push(dataSet);
      this.renderChart(this.data, this.options);
    },
  },
};
</script>
