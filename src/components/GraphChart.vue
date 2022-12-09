<script>
import { Bar } from "vue-chartjs";

export default {
  extends: Bar,
  data() {
    return {
      data: {
        labels: [],
        datasets: [],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              scaleLabel: {
                display: true,
              },
              stacked: true,
            },
          ],
          yAxes: [
            {
              stacked: true,
              ticks: {
                callback: function (value) {
                  return Math.floor(value / 60 / 60).toString() + " h ";
                },
                stepSize: 7200,
                min: 0,
              },
            },
          ],
        },
        tooltips: {
          mode: "label",
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
              return (
                data.datasets[tooltipItem.datasetIndex].label + " : " + time
              );
            },
          },
        },
      },
    };
  },
  mounted() {
    let days = this.$store.state.days.slice(0, 7);
    let tasks = this.$store.state.tasksPerDate.slice(0, 7);
    this.render(days.reverse(), tasks.reverse());
  },
  methods: {
    render(days, tasks) {
      this.data.datasets = [];
      this.data.labels = [];
      this.data.labels = days;

      let dateSumTime = Array(days.length);
      dateSumTime.fill(0);
      const sum = {
        label: "合計",
        type: "line",
        data: dateSumTime,
        lineTension: 0,
        borderWidth: 4,
        borderColor: "red",
        backgroundColor: "transparent",
      };
      this.data.datasets.push(sum);
      for (let i = 0; i < this.$store.state.runTaskCategory.length; i++) {
        let data = [];
        for (let j = 0; j < days.length; j++) {
          let sumSubTime = 0;
          for (let k = 0; k < tasks[j].length; k++) {
            if (
              this.$store.state.runTaskCategory[i].id == tasks[j][k].category_id
            ) {
              sumSubTime += tasks[j][k].subtime;
            }
          }
          dateSumTime[j] += sumSubTime;
          data.push(sumSubTime);
        }

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
        const category = {
          label: this.$store.state.runTaskCategory[i].name,
          data: data,
          borderColor: color,
          backgroundColor: background,
          borderWidth: 2,
        };
        this.data.datasets.push(category);
      }
      this.renderChart(this.data, this.options);
    },
  },
};
</script>
