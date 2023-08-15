const path = require("path");

module.exports = {
  mode: "production",
  entry: path.join(__dirname, "src", "index.js"),
  experiments: {
    outputModule: true,
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "mui-form-handler.min.js",
    library: {
      type: "module",
    },
  },
  module: {
    rules: [
      {
        test: /\.?js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              ["@babel/preset-react", { runtime: "automatic" }],
            ],
          },
        },
      },
    ],
  },
  externals: {
    "@mui/material/styles": "@mui/material/styles",
    "@mui/material": "@mui/material",
    react: "react",
    "react-dom": "react-dom",
  },
};
