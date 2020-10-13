const espress = require("express");

const app = espress();

app.listen(5050);

app.get("/", (req, res) => {
  res.send("hello");
});
