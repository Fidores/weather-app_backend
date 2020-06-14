module.exports = function (obj) {
  return Object.entries(obj)
    .map((entry) => entry.join("="))
    .join("&");
};
