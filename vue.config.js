const path = require("path");

module.exports = {
  transpileDependencies: ["vuetify"],
  // chainWebpack: config => {
  //   config.plugin('VuetifyLoaderPlugin').tap(() => [{
  //     progressiveImages: true
  //   }])
  // },
  configureWebpack: (config) => {
    config.resolve.alias = {
      "@": path.resolve(__dirname, "src"),
      "@mixins": path.resolve(__dirname, "src/mixins"),
    };
    if (process.env.NODE_ENV !== "production") return;
    return {
      plugins: [],
    };
  },
};
