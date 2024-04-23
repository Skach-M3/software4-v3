<template>
  <div>
      <vue-office-pdf :src="url"/>
  </div>
    </template>
     
    <script>
    import VueOfficeDocx from '@vue-office/docx'
    import '@vue-office/docx/lib/index.css'
    import VueOfficeExcel from '@vue-office/excel'
    import '@vue-office/excel/lib/index.css'
    import VueOfficePdf from '@vue-office/pdf'
    import { getRequest, postRequest } from "@/api/user";
    export default {
      components:{
        VueOfficePdf
      },
      data(){
        return {
          url: '' //设置文档网络地址，可以是相对地址
        }
      },
      created(){
        getRequest("/file/getIntroFile").then((res) => {
          this.url = res
        });
      }
    }
    </script>