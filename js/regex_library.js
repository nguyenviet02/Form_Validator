// Validate email custom
// Ví dụ: abcd@DT123456.actvn.edu.vn
function checkEmail(input){
  const regexEmail = /\w+@DT\d{6}.actvn.edu.vn/;
  const email = username.value;
  if (!email.match(regexEmail))
  {
      show("Email ko hợp lệ")
  }
}

//Validate all email 
function validateEmail(email) {
  const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!email.match(regexEmail)) {
    return false;
  }
  console.log("hhh");
}

//The password should contain at least one digit, at least one lower case, and at least one upper case and at least 8 characters

function validatePassword() {
  var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,}$/;
  var txt = document.getElementById("password");
  if (!regex.test(txt.value)) {
      alert("The password should contain at least one digit, at least one lower case, and at least one upper case and at least 8 characters");
      return false;
  } else {
      return true;
  }
}

// Validate Phone Number 

function validateTel() {
  var regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
  var txt = document.getElementById("tel");
  if (!regex.test(txt.value)) {
      alert("Your phone number is not incorrect format");
      return false;
  } else {
      return true;
  }
}

// Validate Name
// (?=.*\d) =>  Có ít nhất 1 số
//(?=.*[a-z]) => Có ít nhất 1 chữ thường ,....
function checkProductName(){ 
  var name = document.querySelector("#name")
  const regexProductName = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\s).{4,}$/gm;
  if (!name.value.match(regexProductName))
  {
      alert("Name Invalid")
      return false
  }
  return true
}