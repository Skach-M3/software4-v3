export const tabSwitch = {
    data() {
        return {
            activeName: 'first'
        };
    },
    methods: {
        handleClick(tab, event) {
            console.log(tab, event);
        }
    }
}

export const resetForm = {
  methods: {
    resetForm(formName) {
      // 不加if判断会报错找不到resetFields，因为form用的v-if，不显示时找不到DOM结构
      if (this.$refs[formName]) {
        this.$refs[formName].resetFields();
      }
    }
  },
};

export const debounce = {
  methods: {
    debounce(fn, delay) {
      let t = null;
      return function () {
        if (t !== null) {
          clearTimeout(t);
        }
        t = setTimeout(() => {
          fn.call(this);
        }, delay);
      }
    }
  }
}

export const setCookie = {
  method: {
    setCookie (obj, limitTime) {
      let data = new Date( new Date().getTime() + limitTime*24*60*60*1000 ).toUTCString();

      for(let i in obj) {
          document.cookie = i + '=' + obj[i] + ';expires=' + data;
      }
    }
  }
}

export function deepClone (obj){
  const cache = new WeakMap();

  function _deepClone(obj){
    if(obj == null|| typeof obj !== "object"){
      return obj;
    }
    if(cache.has(obj)){
      return cache.get(obj);
    }
    const result = Array.isArray(obj) ? []:{};
    cache.set(obj,result);
    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        result[key] = _deepClone(obj[key]);
      }
    }
    return result;
  }
  return _deepClone(obj);
}