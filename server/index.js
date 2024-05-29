const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", (req, res) => {
  res.send("Server is running");
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

app.listen(5000, console.log("Server started on PORT 5000"));
