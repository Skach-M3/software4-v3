<template>
  <div :id="grapgId" :ref="grapgId" style="width: 100%;height: 100%"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "Heat",
  props: {
    title_text: {
      type: String,
      default: "专病集疾病占比",
    },
    target_list: {
      type: Array,
      default: () => {},
    },
    caculate_list: {
      type: Array,
      default: () => {},
    },
    data: {
      type: Array,
      default: () => {},
    },
    grapgId: {
      type: String,
      default: "heat",
    },
  },
  data() {
    return {

    };
  },
  created() {


  },
  mounted() {
    this.initMyChart();
  },

  methods: {
    initMyChart() {
      var chartDom = document.getElementById(this.grapgId);
      console.log(chartDom);
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        title: {
          text: this.title_text,
          left: 'center',
          top:0
        },
        tooltip: {
          position: 'top'
        },
        grid: {
          height: '50%',
          top: '10%'
        },
        xAxis: {
          type: 'category',
          
          data: this.target_list,
          splitArea: {
            show: true
          }
        },
        yAxis: {
          type: 'category',
          data: this.caculate_list,
          splitArea: {
            show: true
          }
        },
        visualMap: {
          min: 0,
          max: 10,
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          bottom: '15%'
        },
        series: [
          {
            name: 'Punch Card',
            type: 'heatmap',
            data: this.data,
            label: {
              show: true
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };

      option && myChart.setOption(option);
    },
  },
};
</script>

<style scoped>
/* .heat {
  width: 100%;
  height: 100%;
} */
</style>
