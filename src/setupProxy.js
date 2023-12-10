const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: ["https://nestme-server.onrender.com", "http://localhost:5000"],
      changeOrigin: true,
    })
  );
};
