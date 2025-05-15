const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
var app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());

mongoose.connect("mongodb+srv://saurabhmahajanq:<db_password>@todolist.blq6qnx.mongodb.net/?retryWrites=true&w=majority&appName=todolist");
const trySchema = new mongoose.Schema({
  name: String,
  priority: {
    type: String,
    enum: ["high", "medium", "low"],
    default: "medium",
  },
});

const item = mongoose.model("task", trySchema);

app.get("/", async function (req, res) {
  try {
    foundItems = await item.find({});
    res.render("list", { exes: foundItems });
  } catch (error) {
    console.error("error fetching items:", err);
  }
});

app.listen("3000", function () {
  console.log("server is running");
});

app.post("/", async function (req, res) {
  var element = req.body.ele1;
  var pelement = req.body.priority;

  const handleelement = req.body.ele1?.trim();
  console.log(pelement);

  if (
    element &&
    handleelement &&
    ["high", "medium", "low"].includes(pelement)
  ) {
    todoo = new item({ name: element, priority: pelement });
    await todoo.save();
    res.redirect("/");
  } else {
    console.log("empty string not allowed");
    res.redirect("/"); //validation. Otherwise the page keeps reloading if we don't provide the priority value
  }
});

app.post("/delete", async function (req, res) {
  const deleted = req.body.del;
  await item.findByIdAndDelete(deleted);
  res.redirect("/");
});

app.put("/update", async function (req, res) {
  const id = req.body.id;
  const newpara = req.body.data;
  const priorityupdate = req.body.priorityupdate;

  await item.findByIdAndUpdate(id, { name: newpara, priority: priorityupdate });
  res.status(200).json({ message: "Update successful" });
});
