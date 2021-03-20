// ------------function to add name on the page------------

var req = new XMLHttpRequest();
req.open("GET", "/profile");
req.send();
req.addEventListener("load", function (event) {
  var out = event.target.responseText;
  document.getElementById("name").innerHTML =
    "Welcome " + out.toUpperCase() + " as Admin !";
});

var req = new XMLHttpRequest();
req.open("GET", "/p_pic");
req.send();
req.addEventListener("load", function (event) {
  var out = event.target.responseText;
  document.getElementById("p_pic").style.backgroundImage = "url(" + out + ")";
});

var del_text = document.getElementById("add_delete");
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

// -----------function for logout the user-------------
logout.addEventListener("click", function (event) {
  var request = new XMLHttpRequest();
  request.open("GET", "/logout");
  request.send();
  window.location.replace("/");
});

// --------------------------Delete Product-----------------------
this.addEventListener("click", function (event) {
  if (event.target.id === "delete") {
    toggleLoader(true);
    del_text.style.display = "block";
    var delItem = event.target.parentNode.parentNode.parentNode.parentNode;
    var delItemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
    delItem.remove();
    var obj = { item_id: delItemId };
    setTimeout(function () {
      var request = new XMLHttpRequest();
      request.open("POST", "/productdelete");
      request.setRequestHeader("Content-type", "application/json");
      request.send(JSON.stringify(obj));
      del_text.style.display = "none";
      toggleLoader(false);
    }, 1000);
    // window.location.reload();
  }
});

function pageReload() {
  window.location.reload();
}
