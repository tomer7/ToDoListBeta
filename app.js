const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js")


const app = express();
const items = ["Buy Food","Cook Food","Eat Food"];
const hiddenItems = [];
const workItems = []
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"));
app.get("/", function(req, res){
  const day = date.getDate();
  res.render('list', {listTitle: day, newListItems: items});

})

app.post("/", function(req,res){
  if (req.body.trashClick !== undefined)
  {
    for (var i = 0; i < items.length; i++) {
      if (req.body.trashClick === items[i])
      {
        var theRemoved = items.splice(i, 1);
        break;
      }
    }
    res.redirect("/");
    console.log("trashClick")
  }
  if (req.body.hideClick !== undefined)
  {
    for (var i = 0; i < items.length; i++) {
      if (req.body.hideClick === items[i])
      {
        hiddenItems.push(items[i]);
        var theRemoved = items.splice(i, 1);
        break;
      }
    }
    res.redirect("/");
    console.log("hideClick")
  }
  if (req.body.newItem !== undefined)
  {
    const item = req.body.newItem;

    if (req.body.list === "Work") {
      workItems.push(item);
      res.redirect("/work")
    }
    else
    {
      items.push(item)
      res.redirect("/");
    }
  }
})

app.get("/work", function(req,res) {
  res.render("list", {listTitle: "Work List", newListItems: workItems})
})

app.post("/work", function(req,res) {
  const item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work")
})

app.get("/about", function(req,res) {
  res.render("about")
})

app.listen(3000, function(){
  console.log("Server on 3000")
})
