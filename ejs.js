// ------------Required Packages-------
var express = require("express");
var app = express();
var session = require("express-session");
var multer = require("multer");
var body_parser = require("body-parser");
var mongodb = require("mongodb").MongoClient;

// --------DB connection-------
var url = "mongodb://5f1bc91980f37a4cd249762e:c22osqlokird77nhc22osqlokird77ni@128.199.17.119:3002";
mongodb.connect(url, function (err, db) {
  if (err) {
    throw err;
  }
});

var DBname = "c22osqlokird77nc";

// ----------------MiddleWare------------
app.use(express.static("public_html"));
app.use(express.static("uploads"));
app.use(express.static("partials"));
app.set("view engine", "ejs");
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));
app.listen(8000, () => {
  console.log("server is running");
});
app.use(
  session({
    secret: "helloworld",
    resave: false,
    saveUninitialized: true,
  })
);

//----------MultiPart data configuration---------
var multer_storage_config = multer.diskStorage({
  destination: (req, file, cb) => {
    if (req.originalUrl == "/product") {
      cb(null, __dirname + "/public_html/img");
    } else if (req.originalUrl == "/login") {
      cb(null, __dirname + "/public_html/uploads");
    }
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});
var uploader = multer({ storage: multer_storage_config });

// ----------Route Handling----------

// -------GET request on index page-------
app.get("/", function (req, res) {
  if (req.session.login == true) {
    if (req.session.role == "Admin") {
      var data = [];
      mongodb.connect(url, function (err, db) {
        var select = db.db(DBname);
        select
          .collection("product")
          .find()
          .toArray(function (error, resp) {
            if (error) {
              throw error;
            } else {
              data = resp;
              res.render("admin", { item: data });
              db.close();
            }
          });
      });
    } else if (req.session.role == "Customer") {
      var data = [];
      mongodb.connect(url, function (err, db) {
        var select = db.db(DBname);
        select
          .collection("product")
          .find()
          .toArray(function (error, resp) {
            if (error) {
              throw error;
            } else {
              data = resp;
              res.render("main", { item: data });
              db.close();
            }
          });
      });
    }
  } else {
    res.render("index");
  }
});

// -------GET request on Admin page-------
app.get("/admin", function (req, res) {
  if (req.session.login == true) {
    var data = [];
    mongodb.connect(url, function (err, db) {
      var select = db.db(DBname);
      select
        .collection("product")
        .find()
        .toArray(function (error, resp) {
          if (error) {
            throw error;
          } else {
            data = resp;
            res.render("admin", { item: data });
            db.close();
          }
        });
    });
  } else {
    res.render("index");
  }
});

// -------GET request on Signup page-------
app.get("/signup", function (req, res) {
  if (req.session.login == true) {
    if (req.session.role == "Admin") {
      var data = [];
      mongodb.connect(url, function (err, db) {
        var select = db.db(DBname);
        select
          .collection("product")
          .find()
          .toArray(function (error, resp) {
            if (error) {
              throw error;
            } else {
              data = resp;
              res.render("admin", { item: data });
              db.close();
            }
          });
      });
    } else if (req.session.role == "Customer") {
      var data = [];
      mongodb.connect(url, function (err, db) {
        var select = db.db(DBname);
        select
          .collection("product")
          .find()
          .toArray(function (error, resp) {
            if (error) {
              throw error;
            } else {
              data = resp;
              res.render("main", { item: data });
              db.close();
            }
          });
      });
    }
  } else {
    res.render("signup");
  }
});

// -------GET request on Customer home page-------
app.get("/main", function (req, res) {
  if (req.session.login == undefined) {
    res.redirect("main");
  } else {
    var data = [];
    mongodb.connect(url, function (err, db) {
      var select = db.db(DBname);
      select
        .collection("product")
        .find()
        .toArray(function (error, resp) {
          if (error) {
            throw error;
          } else {
            data = resp;
            res.render("main", { item: data });
            db.close();
          }
        });
    });
  }
});

// -------GET request on Customer cart page-------
app.get("/cart", function (req, res) {
  if (req.session.login == undefined) {
    res.render("index");
  } else {
    var data = [];
    mongodb.connect(url, function (err, db) {
      var select = db.db(DBname);
      select
        .collection("emailcart")
        .find()
        .toArray(function (error, resp) {
          if (error) {
            throw error;
          } else {
            data = resp;
            var temp = [];
            for (var i = 0; i < data.length; i++) {
              if (req.session.email == data[i].emailId) {
                temp.push(data[i]);
              }
            }
            res.render("cart", { item: temp });
            db.close();
          }
        });
    });
  }
});

// -------GET request to check credential in DB for Admin-------
app.get("/loginadmin", function (req, res) {
  mongodb.connect(url, function (err, db) {
    var select = db.db(DBname);
    select
      .collection("newAdmin")
      .find()
      .toArray(function (error, resp) {
        if (error) {
          throw error;
        } else {
          data = resp;
          res.send(resp);
          db.close();
        }
      });
  });
});

// -------GET request to check credential in DB for Customer-------
app.get("/logincustomer", function (req, res) {
  mongodb.connect(url, function (err, db) {
    var select = db.db(DBname);
    select
      .collection("newCustomer")
      .find()
      .toArray(function (error, resp) {
        if (error) {
          throw error;
        } else {
          data = resp;
          res.send(resp);
          db.close();
        }
      });
  });
});

// -------GET request for all users logout-------
app.get("/logout", function (req, res) {
  req.session.destroy();
  res.render("index");
});

// -------GET request for all users profile Name-------
app.get("/profile", function (req, res) {
  res.send(req.session.fname);
});

// -------GET request for all users profile Picture-------
app.get("/p_pic", function (req, res) {
  res.send("./uploads/" + req.session.pic);
});

// -------POST request for Admin successful login-------
var emailId;
app.post("/successadmin", function (req, res) {
  req.session.login = true;
  req.session.fname = req.body.name;
  req.session.email = req.body.email;
  req.session.role = req.body.role;
  req.session.pic = req.body.pic;
  emailId = req.body.email;
  var data = [];
  mongodb.connect(url, function (err, db) {
    var select = db.db(DBname);
    select
      .collection("product")
      .find()
      .toArray(function (error, resp) {
        if (error) {
          throw error;
        } else {
          data = resp;
          res.render("admin", { item: data });
          db.close();
        }
      });
  });
});

// -------POST request for Customer successful login-------
app.post("/successcustomer", function (req, res) {
  req.session.login = true;
  req.session.fname = req.body.name;
  req.session.email = req.body.email;
  req.session.role = req.body.role;
  req.session.pic = req.body.pic;
  emailId = req.body.email;
  var data = [];
  mongodb.connect(url, function (err, db) {
    var select = db.db(DBname);
    select
      .collection("product")
      .find()
      .toArray(function (error, resp) {
        if (error) {
          throw error;
        } else {
          data = resp;
          res.render("main", { item: data });
          db.close();
        }
      });
  });
});

// -------POST request to add item into cart oneByone-------
app.post("/singleproduct", function (req, res) {
  var filter = {
    _id: parseInt(req.body.item_id),
  };
  mongodb.connect(url, function (err, db) {
    var select = db.db(DBname);
    select
      .collection("product")
      .find(filter)
      .toArray(function (error, resp) {
        if (error) {
          throw error;
        } else {
          res.send(resp);
          db.close();
        }
      });
  });
});

app.post("/newUser", function (req, res) {
  var data = [];
  if (req.body.option == "Admin") {
    mongodb.connect(url, function (err, db) {
      var select = db.db(DBname);
      select
        .collection("newAdmin")
        .find()
        .toArray(function (error, resp) {
          if (error) {
            throw error;
          } else {
            data = resp;
            res.send(data);
            db.close();
          }
        });
    });
  } else if (req.body.option == "Customer") {
    mongodb.connect(url, function (err, db) {
      var select = db.db(DBname);
      select
        .collection("newCustomer")
        .find()
        .toArray(function (error, resp) {
          if (error) {
            throw error;
          } else {
            data = resp;
            res.send(data);
            db.close();
          }
        });
    });
  }
});

// -------------SignUp Form request------------
app.post("/login", uploader.single("profile_pic"), function (req, res) {
  var fullname = req.body.fullname;
  var email = req.body.email;
  var password = req.body.password;
  var role = req.body.role;
  var profile_pic = req.file.originalname;
  var obj = { fullname, email, password, profile_pic, role };
  req.session.pic == req.file.profile_pic;
  if (role == "Admin") {
    databaseInsert("newAdmin", obj);
    res.render("index");
  } else if (role == "Customer") {
    databaseInsert("newCustomer", obj);
    res.render("index");
  }
});

// ------------Product Update for admin------------
app.post("/productUpdate", function (req, res) {
  var filter = {
    _id: parseInt(req.body.productId),
  };
  var newValue = {
    $set: {
      itemName: req.body.itemName,
      descr: req.body.descr,
      rupees: req.body.rupees,
      quantity: req.body.quantity,
    },
  };
  mongodb.connect(url, function (err, db) {
    var select = db.db(DBname);
    select
      .collection("product")
      .updateOne(filter, newValue, function (error, resp) {
        if (error) {
          throw error;
        } else {
          db.close();
        }
      });
  });
  res.redirect("admin");
});

// ------------Product add into db for admin------------
app.post("/product", uploader.single("productimage"), function (req, res) {
  ID = ID + 1;
  var _id = ID;
  var itemName = req.body.itemName;
  var descr = req.body.descr;
  var rupees = req.body.rupees;
  var quantity = req.body.quantity;
  var source = "./img/" + req.file.originalname;
  var obj = { _id, itemName, descr, rupees, quantity, source };
  databaseInsert("product", obj);
  res.redirect("admin");
});

// -----------Product delete from db for admin-----------
app.post("/productdelete", function (req, res) {
  var filter = {
    _id: parseInt(req.body.item_id),
  };
  mongodb.connect(url, function (err, db) {
    var select = db.db(DBname);
    select.collection("product").deleteOne(filter, function (error, resp) {
      if (error) {
        throw error;
      } else {
        db.close();
      }
    });
  });
  res.redirect("admin");
});

// -------POST request to add Cart item into DB--------
app.post("/emailcart", function (req, res) {
  var _id = req.body.id + emailId;
  var unique = req.body.id;
  var itemName = req.body.itemName;
  var rupees = req.body.rupees;
  var source = req.body.source;
  var descr = req.body.descr;
  var quantity = req.body.quantity;
  var obj = { _id, unique, emailId, itemName, rupees, source, descr, quantity };
  databaseInsert("emailcart", obj);
  res.end();
});

// -------POST request to delete Cart item from DB--------
app.post("/del", function (req, res) {
  var filter = {
    _id: parseInt(req.body.item_id) + emailId,
  };
  mongodb.connect(url, function (err, db) {
    var select = db.db(DBname);
    select.collection("emailcart").deleteOne(filter, function (error, resp) {
      if (error) {
        throw error;
      } else {
        db.close();
      }
    });
  });
  res.end();
});

// ------------function for insert into DB---------
function databaseInsert(collect, obj) {
  mongodb.connect(url, function (err, db) {
    var select = db.db(DBname);
    select.collection(collect).insertOne(obj, function (error, res) {
      if (error) {
        throw error;
      } else {
        db.close();
      }
    });
  });
}

// ---------function to check next ID of product item for add into DB for Admin------
findId();
var ID;
function findId() {
  mongodb.connect(url, function (err, db) {
    var select = db.db(DBname);
    select
      .collection("product")
      .find()
      .sort({ _id: -1 })
      .limit(1)
      .toArray(function (error, res) {
        if (error) {
          throw error;
        } else {
          if (res.length === 0) {
            ID = 0;
          } else {
            ID = res[0]._id;
          }
          db.close();
        }
      });
  });
}
