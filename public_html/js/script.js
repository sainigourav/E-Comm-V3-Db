// ------------function to add name on the page------------

var req = new XMLHttpRequest();
req.open("GET", "/profile");
req.send();
req.addEventListener("load", function (event) {
  var out = event.target.responseText;
  document.getElementById("name").innerHTML =
    "Welcome " + out.toUpperCase() + " !";
});

var req = new XMLHttpRequest();
req.open("GET", "/p_pic");
req.send();
req.addEventListener("load", function (event) {
  var out = event.target.responseText;
  document.getElementById("p_pic").style.backgroundImage = "url(" + out + ")";
});

var success = document.getElementById("add_success");
var logout = document.getElementById("logout");
const loader = document.getElementById("loader-container");
const toggleLoader = (val) => {
  if (val == true) {
    loader.style.display = "block";
  } else if (val == false) {
    loader.style.display = "none";
  }
};
toggleLoader(true);
window.onload = function () {
  toggleLoader(false);
};

// --------------------------Add to Cart-----------------------

this.addEventListener("click", function (event) {
  if (event.target.id === "cart_btn") {
    toggleLoader(true);
    success.style.display = "block";
    var cardId = event.target.parentNode.parentNode.parentNode.parentNode.id;
    var obj = { item_id: cardId };
    setTimeout(function () {
      var request = new XMLHttpRequest();
      request.open("POST", "/singleproduct");
      request.setRequestHeader("Content-type", "application/json");
      request.send(JSON.stringify(obj));
      request.addEventListener("load", function (event) {
        var output = JSON.parse(event.target.responseText);
        if (output === null) return;

        var request = new XMLHttpRequest();
        request.open("POST", "/emailcart");
        request.setRequestHeader("Content-type", "application/json");
        var newCart = {
          id: output[0]._id,
          itemName: output[0].itemName,
          rupees: output[0].rupees,
          source: output[0].source,
          descr: output[0].descr,
          quantity: 1,
        };
        request.send(JSON.stringify(newCart));
      });
      success.style.display = "none";
      toggleLoader(false);
    }, 1000);
  }
});

// -----------function for logout the user-------------
logout.addEventListener("click", function (event) {
  var request = new XMLHttpRequest();
  request.open("GET", "/logout");
  request.send();
  window.location.replace("/");
});
