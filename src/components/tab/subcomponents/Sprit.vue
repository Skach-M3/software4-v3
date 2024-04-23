<template>
  <div id="sprit" ref="sprit"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "Sprit",
  props: {
    title: {
      type: String,
      default: "缺失比率图",
    },
    sprit_names: {
      type: Array,
      default: () => { },
    },
    sprit_values: {
      type: Array,
      default: () => { },
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
      var chartDom = this.$refs.sprit;
      var myChart = echarts.init(chartDom);

      // 提取dataZoom配置到变量中
      var dataZoomOption = [
        {
          type: 'inside',

        },
        {
          type: 'slider',
          left: '0%', // 调整滑动条缩放组件的左侧位置
          right: '22%', // 调整滑动条缩放组件的右侧位置
        }
      ];

      var option = {
        title: {
          text: this.title+"特征完备率",
          left: 10
        },
        toolbox: {
          left: '50%', // 设置工具箱距离容器左侧的距离
          top: '0%', // 设置工具箱距离容器顶部的距离
          width: '80%', // 设置工具箱的宽度
          height: '80%', // 设置工具箱的高度
          feature: {
            dataZoom: {
              yAxisIndex: false
            },
            saveAsImage: {
              pixelRatio: 2
            },
            restore: { show: true },
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: '10%', // 调整这些值以按比例缩小图表
          right: '19%',
          bottom: '15%',
          left: '0%',
          containLabel: true,
        },
        dataZoom: dataZoomOption, // 引用提取的dataZoom配置
        xAxis: {
          data: this.sprit_names,
          silent: false,
          splitLine: {
            show: true
          },
          splitArea: {
            show: true
          }
        },
        yAxis: {
          splitArea: {
            show: false
          }
        },
        series: [
          {
            type: 'bar',
            data: this.sprit_values,
            large: true
          }
        ]
      };
      option && myChart.setOption(option);
    },
  }

};
</script>

<style scoped>
#sprit {
  width: 100%;
  height: 100%;
}
</style>
