const withLqipImages = require("next-lqip-images");

module.exports = withLqipImages({
  fileExtensions: ["jpg", "jpeg", "png", "gif"],
  reactStrictMode: true,
  target: "serverless",
  images: {
    disableStaticImages: true,
  },
});
