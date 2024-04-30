import { mapGetters, mapState } from "vuex";

export default {
  computed: {
    ...mapState({ m_dataList: "dataList" }),
    ...mapGetters({ m_dataDisList: "dataDisList" }),
    m_step() {
      return this.$store.state[this.moduleName].step;
    },
    m_taskName() {
      return this.$store.state[this.moduleName].taskName;
    },
    m_principal() {
      return this.$store.state[this.moduleName].principal;
    },
    m_participants() {
      return this.$store.state[this.moduleName].participants;
    },
    m_disease() {
      return this.$store.state[this.moduleName].disease;
    },
    m_tips() {
      return this.$store.state[this.moduleName].tips;
    },
    m_dataset() {
      return this.$store.state[this.moduleName].dataset;
    },
    m_use_features() {
      return this.$store.state[this.moduleName].use_features;
    },
    m_known_features() {
      return this.$store.state[this.moduleName].known_features;
    },
    m_target_feature() {
      return this.$store.state[this.moduleName].target_feature;
    },
    m_algorithm() {
      return this.$store.state[this.moduleName].algorithm;
    },
    m_SF_DRMB() {
      return this.$store.state[this.moduleName].SF_DRMB;
    },
    m_result() {
      return this.$store.state[this.moduleName].result;
    },
    m_is_common() {
      return this.$store.state[this.moduleName].is_common;
    },
    m_node_data() {
      return this.$store.state[this.moduleName].node_data;
    },
    m_all_featrues() {
      return this.$store.state[this.moduleName].all_featrues;
    },
    m_caculate_use_features() {
      return this.$store.state[this.moduleName].caculate_use_features;
    },
    m_caculate_known_features() {
      return this.$store.state[this.moduleName].caculate_known_features;
    },
    m_caculate_target_feature() {
      return this.$store.state[this.moduleName].caculate_target_feature;
    },
    m_traditional_res() {
      return this.$store.state[this.moduleName].traditional_res;
    },
  },
  methods: {
    m_changeStep(newStep) {
      this.$store.commit(`${this.moduleName}/ChangeStep`, newStep);
    },
    m_changeTaskInfo(newValue) {
      this.$store.commit(`${this.moduleName}/ChangeTaskInfo`, newValue);
    },
    m_SF_DRMB_update(newdata) {
      this.$store.commit(`${this.moduleName}/SF_DRMB_update`, newdata);
    },
  },
};
