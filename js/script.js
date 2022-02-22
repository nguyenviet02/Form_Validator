//* Tạo 1 object để lưu các rule
let objectRules = {};

//* Tạo biến để lưu mật khẩu nhập vào
var pw = "";

//* Hàm tìm phần tử
function findEle(input, ele) {
  while (input.parentNode) {
    if (input.parentElement.matches(ele)) {
      return input.parentNode;
    }
    input = input.parentNode;
  }
}

//* Tạo hàm kiểm tra, trả về thông báo lỗi
//<> function validate start
function validate(form, inputEle, rule) {
  //* Lấy phần tử cha form-group
  var formGroup = findEle(inputEle, form.formEle_class);
  //* Lấy các rule từ selector
  var rules = objectRules[rule.selector];
  //* Lặp qua các rule, nếu lỗi thì break r lấy error message
  for (var i = 0; i < rules.length; i++) {
    switch (inputEle.type) {
      case "radio":
      case "checkbox":
        errorMessage = rules[i](
          formEle.querySelector(rule.selector + ":checked")
        );
        break;
      default:
        errorMessage = rules[i](inputEle.value);
    }
    if (errorMessage) {
      break;
    }
  }
  //* Xuất thông báo lỗi
  if (errorMessage) {
    inputEle.classList.add('error');
    formGroup.querySelector(form.form_message).innerText = errorMessage;
  }
  else {
    inputEle.classList.remove('error');
    formGroup.querySelector(form.form_message).innerText = "";
  }
  return !errorMessage;
}
//<> function validate end

//* Hàm lấy mật khẩu để so sánh khi nhập lại
function getPass() {
  let pass = document.getElementById("password");
  pass.addEventListener("input", () => {
    pw = pass.value;
  })
}

//* Khởi tạo hàm Validator để validate form

//<> function Validator start 
function Validator(form) {
  formEle = document.querySelector(form.id);
  formEle.addEventListener('submit', (e) => {
    e.preventDefault();

    //* Check Form có hợp lệ không
    var isFormValid = true;
    form.rules.forEach(function (rule) {
      var inputEle = formEle.querySelector(rule.selector);
      var isSuccess = validate(form, inputEle, rule);
      if (!isSuccess) {
        isFormValid = false;
      }
    });
    if (isFormValid) {

      //* Nếu sử dụng submit với getData
      if (typeof form.getData === 'function') {
        var dataBox = formEle.querySelectorAll('[name]');
        var AllData = Array.from(dataBox).reduce(function (datas, input) {
          switch (input.type) {
            case 'radio':
              if (input.checked) {
                datas[input.name] = input.value;
              }
              break;
            case 'checkbox':
              if (!input.checked) {
                return datas;
              }
              if (!Array.isArray(datas[input.name])) {
                datas[input.name] = [];
              }
              datas[input.name].push(input.value);
              break;
            case 'file':
              datas[input.name] = input.files;
              break;
            default:
              datas[input.name] = input.value;
          }
          return datas;
        }, {})
        form.getData(AllData);

      }
      //* Sử dụng submit mặc định của trình duyệt
      else {
        formEle.submit();
      }
    }
    else {
      console.log("Fail");
    }
  })

  if (formEle) {
    form.rules.forEach(function (rule) {
      var inputEles = formEle.querySelectorAll(rule.selector);
      Array.from(inputEles).forEach(function (inputEle) {

        //* Xóa thông báo lỗi khi nhập
        inputEle.oninput = function () {
          inputEle.closest(form.formEle_class).querySelector(form.form_message).innerText = "";
          inputEle.classList.remove('error');
        }

        //* Kiểm tra input khi blur
        inputEle.onblur = function () {
          validate(form, inputEle, rule);
        }
      })

      //* Tạo objectRules
      if (Array.isArray(objectRules[rule.selector])) {
        objectRules[rule.selector].push(rule.check);
      }
      else {
        objectRules[rule.selector] = [rule.check];
      }

    });
  }
}
//<> function Validator end


//! Khu vực các rule

//<> Rule isRequired start
Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    check: function (value) {
      return value ? undefined : message || 'You must fill this field';
    }
  }
}
//<> Rule isRequired end

//<> Rule isUserName start
Validator.isUsername = function (selector, message) {
  return {
    selector: selector,
    check: function (value) {
      const regexUserName = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}$/gm;
      if (!value.match(regexUserName)) {
        return message || 'Username is invalid';
      }
      return undefined;
    }
  }
}
//<> Rule isUserName end

//<> Rule isEmail start
Validator.isEmail = function (selector, message) {
  return {
    selector: selector,
    check: function (value) {
      const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (!value.match(regexEmail)) {
        return message || "Email is  invalid !";
      }
      else {
        return undefined;
      }
    }
  }
}
//<> Rule isEmail end

//<> Rule isPassword start
Validator.isPassword = function (selector, message) {
  return {
    selector: selector,
    check: function (value) {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,}$/;

      if (!regex.test(value)) {
        return message || "Password is  invalid !";
      }
      else {
        return undefined;
      }
    }
  }
}
//<> Rule isPassword end

//<> Rule check repassword start
Validator.samePassword = function (selector, message) {
  //* Lấy password để so sánh
  getPass();
  return {
    selector: selector,
    check: function (value) {

      if (value != pw) {
        return message || "Re-Passwword is not same as password";
      }
      else {
        return undefined;
      }
    }
  }
}
//<> Rule check repassword end

//<> Rule check phone number start
Validator.isPhone = function (selector, message) {
  return {
    selector: selector,
    check: function (value) {
      const regex = /((09|03| 07|08|05)+([0-9]{8})\b)/g;

      if (!regex.test(value)) {
        return message || "Phone number is not valid";
      } else {
        return undefined;
      }
    }
  }
}
//<> Rule check phone number end



//<> Validator start
Validator({
  id: "#form_1",
  formEle_class: ".form-group",
  form_message: ".form-message",
  rules: [
    Validator.isRequired("#first_name", "First name is required"),
    Validator.isRequired("#last_name", "Last name is required"),
    Validator.isRequired("#username", "Please enter your username"),
    Validator.isUsername("#username", "Login name must have at least 4 characters, including uppercase, lowercase and number"),
    Validator.isRequired("#email"),
    Validator.isEmail("#email"),
    Validator.isRequired("#password"),
    Validator.isPassword("#password", "Password must contain at least 8 characters, including uppercase, lowercase, numbers, special characters"),
    Validator.samePassword("#re-password"),
    Validator.isRequired("#phone"),
    Validator.isPhone("#phone"),
    Validator.isRequired('input[name="gender"]'),
    Validator.isRequired("#province"),
  ],
  getData: function (data) {
    console.log(data);
  }
});
//<> Validator end

