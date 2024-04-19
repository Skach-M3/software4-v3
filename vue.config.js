const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  productionSourceMap: false,
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    // host: "",
    // open: true,
    // 代理配置
    proxy: {
      "/echarts": {
        target: "https://echarts.apache.org/examples", // 我们要代理的地址
        pathRewrite: {
          "^/echarts": "",
        },
      },
      "/api": {
         target: "http://10.16.127.122:8186",
        //target: "http://10.16.78.108:8184", // 我们要代理的地址，实验室地址
        // 是否跨域 需要设置此值为true 才可以让本地服务代理我们发出请求
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
});
