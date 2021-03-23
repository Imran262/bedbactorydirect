const webpack = require("webpack");
const path = require("path");
const fs = require("fs");
const PARENT_THEME = "tilemountain";
module.exports = function(config) {
  // console.log("Config Here is Fawad", config);
  if (!config.plugins) config.plugins = [];
  config.plugins.push(
    new webpack.NormalModuleReplacementPlugin(/(\.*)/, resource => {
      let match = resource.request.match(/^theme\/(.*)/);
      if (match) {
        if (!fs.existsSync(path.resolve(__dirname, match[1]))) {
          resource.request = resource.request.replace(
            /^theme\//,
            "src/themes/" + PARENT_THEME + "/"
          );
        }
      }
    })
  );
  return config;
};
