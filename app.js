const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js")


const app = express();
const items = ["Buy Food", "Cook Food", "Eat Food"];
const hiddenItems = [];
const workItems = ["Add Your Work To Do"]
const homeItems = ["Add Your Home To Do"]
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static("public"));
app.get("/", function(req, res) {
  const day = date.getDate();
  res.render('list', {
    listTitle: day,
    newListItems: items
  });

})

app.post("/", function(req, res) {

  if (req.body.list === "Work" || req.body.whichList === "Work") { // inside work list
    if (req.body.trashClick !== undefined) {
      for (var i = 0; i < workItems.length; i++) {
        if (req.body.trashClick === workItems[i]) {
          workItems.splice(i, 1);
          break;
        }
      }
      res.redirect("/work");
      console.log("trashClick")
    }
    if (req.body.hideClick !== undefined) {
      for (var i = 0; i < workItems.length; i++) {
        if (req.body.hideClick === workItems[i]) {
          hiddenItems.push({theList : "Work", value : workItems[i]});
          console.log(hiddenItems);
          workItems.splice(i, 1);
          break;
        }
      }
      res.redirect("/work");
      console.log("hideClick")
    }
    if (req.body.newItem !== undefined) {
      const item = req.body.newItem;

      workItems.push(item);
      res.redirect("/work")

    }
  } else if (req.body.list === "Home" || req.body.whichList === "Home") { // inside home list
    if (req.body.trashClick !== undefined) {
      for (var i = 0; i < homeItems.length; i++) {
        if (req.body.trashClick === homeItems[i]) {
          homeItems.splice(i, 1);
          break;
        }
      }
      res.redirect("/home");
      console.log("trashClick")
    }
    if (req.body.hideClick !== undefined) {
      for (var i = 0; i < homeItems.length; i++) {
        if (req.body.hideClick === homeItems[i]) {
          hiddenItems.push({theList : "Home", value : homeItems[i]});
          homeItems.splice(i, 1);
          break;
        }
      }
      res.redirect("/home");
      console.log("hideClick")
    }
    if (req.body.newItem !== undefined) {
      const item = req.body.newItem;

      homeItems.push(item);
      res.redirect("/home")
    }
  } else { // inside regular list
    if (req.body.trashClick !== undefined) {
      for (var i = 0; i < items.length; i++) {
        if (req.body.trashClick === items[i]) {
          items.splice(i, 1);
          break;
        }
      }
      res.redirect("/");
      console.log("trashClick")
    }
    if (req.body.hideClick !== undefined) {
      for (var i = 0; i < items.length; i++) {
        if (req.body.hideClick === items[i]) {
          hiddenItems.push({theList : "Regular", value: items[i]});
          items.splice(i, 1);
          break;
        }
      }
      res.redirect("/");
      console.log("hideClick")
    }
    if (req.body.newItem !== undefined) {
      const item = req.body.newItem;

      items.push(item)
      res.redirect("/");
    }

  } // else closer - regular list


})

app.get("/work", function(req, res) {
  res.render("list", {
    listTitle: "Work List",
    newListItems: workItems
  })
})


app.get("/about", function(req, res) {
  res.render("about")
})

app.get("/home", function(req, res) {
  res.render("list", {
    listTitle: "Home List",
    newListItems: homeItems
  })
})

app.get("/hidden", function(req, res) {
  res.render("hidden", {
    listTitle: "Your Hidden List",
    newListItems: hiddenItems
  })
})

app.post("/hidden", function(req, res) {
  for (var i = 0; i < hiddenItems.length; i++)
  {
    if (req.body.undoClick === hiddenItems[i].value)
    {
      if (hiddenItems[i].theList === "Work")
      {
        workItems.push(hiddenItems[i].value)
        hiddenItems.splice(i, 1);
      }
      else if (hiddenItems[i].theList === "Home")
      {
        homeItems.push(hiddenItems[i].value)
        hiddenItems.splice(i, 1);
      }
      else if (hiddenItems[i].theList === "Regular")
      {
        items.push(hiddenItems[i].value)
        hiddenItems.splice(i, 1);
      }
      break;
    }
  }
  res.redirect("/hidden");
  console.log("UndoClick")
})



app.listen(3000, function() {
  console.log("Server on 3000")
})
