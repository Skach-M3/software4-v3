export default {
  namespaced: true,
  state() {
    return {
      step: 1,
      taskName: "",
      principal: "",
      participants: "",
      disease: "",
      tips:"",
      dataset: "",
      use_features: [],
      known_features: [],
      target_feature: [],
      all_featrues:[],
      caculate_use_features:[],
      caculate_known_features:[],
      caculate_target_feature:[],
      algorithm:'',
      SF_DRMB: {
        K_OR: 0.15,
        K_and_PC: 0.3,
        K_and_SP: 0.75,
      },
      result: [],
      is_common:false,
      node_data:'',
      traditional_res:{}
    };
  },
  getters: {},
  actions: {},
  mutations: {
    ChangeStep(state, step) {
      state.step = step;
    },
    ChangeTaskInfo(state, newInfo) {
      state = Object.assign(state, newInfo);
    },
    // ChangeTaskInfo没法深拷贝所以需要单独的函数处理
    SF_DRMB_update(state, newdata) {
      state.SF_DRMB = Object.assign(state.SF_DRMB, newdata);
    },
  },
};
