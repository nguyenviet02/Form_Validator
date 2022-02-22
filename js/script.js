//* Tạo 1 object để lưu các rule
let objectRules = {};

//* Tạo biến để lưu mật khẩu nhập vào
var pw = "";

function findEle(input, ele) {
  while (input.parentNode) {
    if (input.parentElement.matches(ele)) {
      return input.parentNode;
    }
    input = input.parentNode;
  }
}

//* Tạo hàm kiểm tra, trả về thông báo lỗi
function validate(form, inputEle, rule) {
  //* Lấy phần tử cha form-group
  var formGroup = findEle(inputEle, ".form-group");
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
    formGroup.querySelector('.form-message').innerText = errorMessage;
  }
  else {
    inputEle.classList.remove('error');
    formGroup.querySelector('.form-message').innerText = "";
  }
  return !errorMessage;
}

function getPass() {
  let pass = document.getElementById("password");
  pass.addEventListener("input", () => {
    pw = pass.value;
  })
}

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
          inputEle.closest(".form-group").querySelector('.form-message').innerText = "";
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

Validator.isRequired = function (selector) {
  return {
    selector: selector,
    check: function (value) {
      return value ? undefined : 'Vui lòng nhập trường này';
    }
  }
}

Validator.isUsername = function (selector) {
  return {
    selector: selector,
    check: function (value) {
      const regexUserName = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{4,}$/gm;
      if (!value.match(regexUserName)) {
        return "Name should contain at least one digit, at least one lower case, and at least one upper case";
      }
      return "";
    }
  }
}

Validator.isEmail = function (selector) {
  return {
    selector: selector,
    check: function (value) {
      const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (!value.match(regexEmail)) {
        return "Email không hợp lệ";
      }
      else {
        return "";
      }
    }
  }
}

Validator.isPassword = function (selector) {
  return {
    selector: selector,
    check: function (value) {
      const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,}$/;

      if (!regex.test(value)) {
        return "The password should contain at least one digit, at least one lower case, and at least one upper case and at least 8 characters";
      }
      else {
        return "";
      }
    }
  }
}

Validator.samePassword = function (selector) {
  //* Lấy password để so sánh
  getPass();
  return {
    selector: selector,
    check: function (value) {

      if (value != pw) {
        return "Mật khẩu không khớp";
      }
      else {
        return "";
      }
    }
  }
}

Validator.isPhone = function (selector) {
  return {
    selector: selector,
    check: function (value) {
      const regex = /((09|03| 07|08|05)+([0-9]{8})\b)/g;

      if (!regex.test(value)) {
        return "Số điện thoại không hợp lệ !";
      } else {
        return "";
      }
    }
  }
}

Validator({
  id: "#form_1",
  formEle_class: ".form-group",
  rules: [
    Validator.isRequired("#username"),
    Validator.isUsername("#username"),
    Validator.isRequired("#email"),
    Validator.isEmail("#email"),
    Validator.isRequired("#password"),
    Validator.isPassword("#password"),
    Validator.samePassword("#re-password"),
    Validator.isRequired("#phone"),
    Validator.isPhone("#phone"),
    Validator.isRequired('input[name="gender"]'),
    Validator.isRequired("#province"),
  ],
  getData: function (data) {
    console.log(data);
  }
})

