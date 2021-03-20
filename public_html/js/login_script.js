var d_div = document.getElementById("demoId");
var error = document.getElementById("demo");

// -----------------function to check all values before redirect to main page ----------
function Validator() {
  var email = document.getElementById("email").value;
  var pass = document.getElementById("pass").value;
  var role = document.getElementById("select").value;
  if (email == "" || pass == "" || role == "") {
    d_div.style.display = "block";
    error.innerHTML = "All field are mandatory!! ";
    return false;
  } else {
    if (exist(email, pass, role) == true) return true;
    else return false;
  }
}

// ----------function to check email exist or not in database or file --------
function exist(email, pass, role) {
  if (role == "Admin") {
    var request = new XMLHttpRequest();
    request.open("GET", "/loginadmin");
    request.send();
    request.addEventListener("load", function (event) {
      var output = JSON.parse(event.target.responseText);
      if (output === null) {
        d_div.style.display = "block";
        error.innerHTML = "User doesn't exist Please SignUp!!";
        return false;
      } else {
        for (var i = 0; i < output.length; i++) {
          if (
            output[i].email !== email &&
            output[i].password !== pass &&
            i == output.length - 1
          ) {
            d_div.style.display = "block";
            error.innerHTML = "User doesn't exist Please SignUp!!";
            return false;
          } else if (output[i].email == email && output[i].password != pass) {
            d_div.style.display = "block";
            error.innerHTML = "Incorrect Password";
            return false;
          } else if (output[i].email != email && output[i].password == pass) {
            d_div.style.display = "block";
            error.innerHTML = "Incorrect Email address";
            return false;
          } else if (output[i].email == email && output[i].password == pass) {
            d_div.style.display = "none";
            var request = new XMLHttpRequest();
            var result = {
              email: email,
              pass: pass,
              name: output[i].fullname,
              pic: output[i].profile_pic,
              role: output[i].role,
            };
            request.open("POST", "/successadmin");
            request.setRequestHeader("Content-type", "application/json");
            request.send(JSON.stringify(result));
            window.location.replace("/admin");
            return true;
          }
        }
      }
    });
  } else if (role == "Customer") {
    var request = new XMLHttpRequest();
    request.open("GET", "/logincustomer");
    request.send();
    request.addEventListener("load", function (event) {
      var output = JSON.parse(event.target.responseText);
      if (output === null) {
        d_div.style.display = "block";
        error.innerHTML = "User doesn't exist Please SignUp!!";
        return false;
      } else {
        for (var i = 0; i < output.length; i++) {
          if (
            output[i].email !== email &&
            output[i].password !== pass &&
            i == output.length - 1
          ) {
            d_div.style.display = "block";
            error.innerHTML = "User doesn't exist Please SignUp!!";
            return false;
          } else if (output[i].email == email && output[i].password != pass) {
            d_div.style.display = "block";
            error.innerHTML = "Incorrect Password";
            return false;
          } else if (output[i].email != email && output[i].password == pass) {
            d_div.style.display = "block";
            error.innerHTML = "Incorrect Email address";
            return false;
          } else if (output[i].email == email && output[i].password == pass) {
            d_div.style.display = "none";
            var request = new XMLHttpRequest();
            var result = {
              email: email,
              pass: pass,
              name: output[i].fullname,
              pic: output[i].profile_pic,
              role: output[i].role,
            };
            request.open("POST", "/successcustomer");
            request.setRequestHeader("Content-type", "application/json");
            request.send(JSON.stringify(result));
            window.location.replace("/main");
            return true;
          }
        }
      }
    });
  }
}
