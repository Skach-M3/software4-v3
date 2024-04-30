<template>
  <div id="graph" ref="graph"></div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "Graph",
  props: {
    title_text: {
      type: String,
      default: "关系图",
    },
    node: {
      type: Array,
      default: () => {},
    },
    links: {
      type: Array,
      default: () => {},
    },
  },
  data() {
    return {
      // con_node:[],
      // un_con_node:[],
      // con_links:[]
    };
  },
  created() {
  //   this.links.forEach(element => {
  //     this.con_node.push(element.source);
  //     this.con_node.push(element.target);
  //   });
  //   this.con_node = [...new Set(this.con_node)];
  //   console.log(this.con_node);
  //   this.un_con_node = this.node.filter(function(elem){
  //       for(var i=0;i<this.con_node.length;i++){
  //           if(elem.name==this.con_node[i]){
  //               return false;
  //       }
  //     }
  // });

  },
  mounted() {
    this.initMyChart();
  },

  methods: {
    // 省略号函数
    ellipsis(str, maxLength) {
      return str.length > maxLength ? str.slice(0, maxLength) + " ..." : str;
    },
    initMyChart() {
      var chartDom = this.$refs.graph;
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        title: {
          text: this.title_text,
          subtext: "下层为因变量，上层为自变量，数字代表权重",
          left: 0,
          top:0
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            saveAsImage: { show: true }
          } 
        },
        emphasis: {
              focus: 'adjacency',
              label: {
                position: 'right',
                show: true
              }
            },
        tooltip: {},
        animationDurationUpdate: 1500,
        animationEasingUpdate: "quinticInOut",
      //   series:function(){
      //      let serie=[]
           
      //     return serie;
      //  },
        series: [
          {
            type: "graph",
            layout: "none",
            symbolSize: 60, //节点大小
            roam: true,
            label: {
              //节点标识
              show: true,
              formatter: (params) => {
                const maxLength = 5;
                const labelText = params.data.name;
                return this.ellipsis(labelText, maxLength);
              },
            },
            edgeSymbol: ["circle", "arrow"],//箭头形状
            // edgeSymbolSize: [4, 10],
            edgeLabel: {
              //边上标识
              fontSize: 15,
              formatter: "{c}", //显示links的value值
            },
            // edgeSymbolSize: [3, 10],
            data: this.node,
            itemStyle:{
                
                      color: function(params) {
                        return params.data.color    //获取具体的参数
                   
                }
        },
            // [
            //   {
            //     name: "Node 1",
            //     x: 300,
            //     y: 500,
            //   },
            //   {
            //     name: "Node 2",
            //     x: 800,
            //     y: 300,
            //   },
            //   {
            //     name: "Node 3",
            //     x: 550,
            //     y: 100,
            //   },
            //   {
            //     name: "Node 4",
            //     x: 550,
            //     y: 500,
            //   },
            // ],
            links: this.links,
            // [
            //   {
            //     source: 0,
            //     target: 1,
            //     symbolSize: [5, 20],
            //     label: {
            //       show: true,
            //     },
            //     lineStyle: {
            //       width: 5,
            //       curveness: 0.2,
            //     },
            //   },
            //   {
            //     source: "Node 2",
            //     target: "Node 1",
            //     label: {
            //       show: true,
            //     },
            //     lineStyle: {
            //       curveness: 0.2,
            //     },
            //   },
            //   {
            //     source: "Node 1",
            //     target: "Node 3",
            //   },
            //   {
            //     source: "Node 2",
            //     target: "Node 3",
            //   },
            //   {
            //     source: "Node 2",
            //     target: "Node 4",
            //   },
            //   {
            //     source: "Node 1",
            //     target: "Node 4",
            //   },
            // ],
            lineStyle: {
              opacity: 0.9,
              width: 0.5,
              curveness: 0,
            },
          },
          
        ],
      };
  //     option = {
  //   title: {
  //     text: 'Les Miserables',
  //     subtext: 'Default layout',
  //     top: 'bottom',
  //     left: 'right'
  //   },
  //   tooltip: {},
  //   // legend: [
  //   //   {
  //   //     // selectedMode: 'single',
  //   //     data: graph.categories.map(function (a) {
  //   //       return a.name;
  //   //     })
  //   //   }
  //   // ],
  //   animationDuration: 1500,
  //   animationEasingUpdate: 'quinticInOut',
  //   series: [
  //     {
  //       name: 'Les Miserables',
  //       type: 'graph',
  //       layout: 'none',
  //       data: this.node,
  //       links: this.links,
  //       //categories: graph.categories,
  //       roam: true,
  //       label: {
  //         position: 'right',
  //         formatter: '{b}'
  //       },
  //       lineStyle: {
  //         color: 'source',
  //         curveness: 0.3
  //       },
  //       emphasis: {
  //         focus: 'adjacency',
  //         lineStyle: {
  //           width: 10
  //         }
  //       }
  //     }
  //   ]
  // };

      option && myChart.setOption(option);
    },
  },
};
</script>

<style scoped>
#graph {
  width: 100%;
  height: 100%;
}
</style>
