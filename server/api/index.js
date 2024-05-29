const express = require("express");
const app = express();

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.send({ data: "abc" });
});

app.get("/allmodules", async function (req, res) {
  const suiteURL = "https://meek-salmiakki-e84eac.netlify.app/data/suites.json";
  const moduleData = await axios.get(suiteURL).then(async (response) => {
    const allModules = response.data.children;
    return allModules;
  });
  res.send(moduleData);
});

app.listen(5000, () => console.log("Server ready on port 5000."));

module.exports = app;
