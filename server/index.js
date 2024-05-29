const express = require("express");
// const cors = require("cors");
const axios = require("axios");

const app = express();
// app.use(cors());
app.use(express.json());
const PORT = 8080;

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});

app.get("/allmodules", async (request, response) => {
  const suiteURL = "https://meek-salmiakki-e84eac.netlify.app/data/suites.json";
  const moduleData = await axios.get(suiteURL).then(async (response) => {
    const allModules = response.data.children;
    return allModules;
  });
  //return moduleData;
  response.send(moduleData);
});
