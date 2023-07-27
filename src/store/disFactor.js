export default {
  namespaced: true,
  state: {
    step: 1,
    taskName: "",
    principal: "",
    participants: "",
    disease: "",
    dataset: "",
    use_features: [],
    known_features: [],
    target_feature: "",
    SF_DRMB: {
      K_OR: 0.15,
      K_and_PC: 0.3,
      K_and_SP: 0.75
    },
    result: [],
  },
  getters: {},
  actions: {},
  mutations: {
    ChangeStep(state, step) {
      state.step = step;
    },
    ChangeTaskInfo(state, newInfo) {
      state = Object.assign(state, newInfo);
    }
  },
};
