const express = require("express");
const bodyParser = require("body-parser");
//const date = require(__dirname + "/date.js")
const mongoose = require("mongoose");
const _ = require("lodash");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin:Test123@cluster0.nigpj.mongodb.net/todolistDB", {
  useNewUrlParser: true
})

const itemsSchema = new mongoose.Schema({
  name: String,
  whichList: String
})

const Item = mongoose.model("Item", itemsSchema)

const item1 = new Item({
  name: "Welcome to your todolist!",
  whichList: "Today"
})
const item2 = new Item({
  name: "Drink A Lot Of Water",
  whichList: "Today"
})
const item3 = new Item({
  name: "Eat The Food",
  whichList: "Today"
})

const defaultItems = [item1, item2, item3]
const itemHideExampleArr = [];

const listSchema = {
  name: String,
  items: [itemsSchema]
}

const List = mongoose.model("List", listSchema)

List.findOne({
  name: "Hidden"
}, function(err, foundList) {
  if (!err) {
    if (!foundList) {
      // Create a new hidden list
      const list = new List({
        name: "Hidden",
        items: []
      })
      list.save()
    }
  }
})


app.get("/", function(req, res) {
  //const day = date.getDate();
  Item.find({}, function(err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (!err){console.log("Successfully added default items")}
      })
      res.redirect("/")
    } else {
      res.render('list', {
        listTitle: "Today",
        newListItems: foundItems
      });
    }
  })
})

app.get("/:customListName", function(req, res) {
  const customListName = _.capitalize(req.params.customListName)
  List.findOne({
    name: customListName
  }, function(err, foundList) {
    if (!err) {
      if (!foundList) {
        // Create a new list
        const list = new List({
          name: customListName,
          items: defaultItems
        })
        list.save()
        res.redirect("/" + customListName)
      } else {
        //Show an existing list
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items
        })
      }
    }
  })
})


app.post("/", function(req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
    name: itemName,
    whichList: listName
  })

  if (listName === "Today") {
    item.save()
    res.redirect("/")
  } else {
    List.findOne({
      name: listName
    }, function(err, foundList) {
      foundList.items.push(item)
      foundList.save();
      res.redirect("/" + listName)
    })
  }
})

app.post("/delete", function(req, res) {
let checkedItemId;
let listName;
  if (!req.body.checkbox)
  {
    checkedItemId = req.body.trashClick
    listName = req.body.whichList
  }
  else
  {
      checkedItemId = req.body.checkbox
      listName = req.body.listName
  }


  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully Delete");
      }
      res.redirect("/")
    })
  } else {
    List.findOneAndUpdate({
      name: listName
    }, {
      $pull: {
        items: {
          _id: checkedItemId
        }
      }
    }, function(err, foundList) {
      if (!err) {
        res.redirect("/" + listName);
      }
    })
  }
})

app.post("/hide", function(req,res) {

  const listName = req.body.whichList
  const theItemId = req.body.theItemId
  const theItemString = req.body.theItemString

  if (listName === "Today") {
    List.findOne({
      name: "Hidden"
    }, function(err, foundList) {
      const item = new Item({
        name: theItemString,
        whichList : listName
      })
      foundList.items.push(item)
      foundList.save();
      console.log("Moved to Hidden List");
    })
    Item.findByIdAndRemove(theItemId, function(err) {
      if (!err) { console.log("Successfully Delete")}
      res.redirect("/")
    })
  } else {
    List.findOne({
      name: "Hidden"
    }, function(err, foundList) {
      const item = new Item({
        name: theItemString,
        whichList : listName
      })
      foundList.items.push(item)
      foundList.save();
      console.log("Moved to Hidden List");
    })

    List.findOneAndUpdate({
      name: listName
    }, {
      $pull: {
        items: {
          _id: theItemId
        }
      }
    }, function(err, foundList) {
      if (!err) {
        console.log("Successfully Delete")
        res.redirect("/" + listName);
      }
    })
  }
})




app.get("/hide/showitems", function(req,res){
  List.findOne({
    name: "Hidden"
  }, function(err, foundList) {
    if (!err) {
      if (!foundList) {
        // Create a new list
        const list = new List({
          name: "Hidden",
          items: itemHideExampleArr
        })
        list.save()
        res.redirect("/hide/showitems")
      } else {
        //Show an existing list
        res.render("hidden", {
          listTitle: "Your Hidden List",
          newListItems: foundList.items
        })
      }
    }
  })
})


app.post("/returnFromHide", function(req,res){
  const listName = req.body.whichList
  const theItemString = req.body.undoClick
  const theItemId = req.body.theItemId

  const item = new Item({
    name: theItemString,
    whichList: listName
  })
  if (listName === "Today") {
    item.save()
  } else {
    List.findOne({
      name: listName
    }, function(err, foundList) {
      foundList.items.push(item)
      foundList.save();
    })
  }
  List.findOneAndUpdate({
    name: "Hidden"
  }, {
    $pull: {
      items: {
        _id: theItemId
      }
    }
  }, function(err, foundList) {
    if (!err) {
      console.log("Successfully Delete")
    }
  })
  res.redirect("/hide/showitems")
})




app.listen(3000, function() {
  console.log("Server on 3000")
})
