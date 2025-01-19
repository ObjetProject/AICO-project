// 회원가입 유효성 검사
const MESSAGE = {
  idError: 'id는 5 ~ 12자 이내여야 합니다.',
  pwError: '비밀번호는 숫자와 문자 포함 형태의 6~12자리 이내로 입력해주세요.',
  cpwError:'비밀번호가 일치하지 않습니다.',
  blankError: '모든 항목을 입력해주세요.',
  existID: '이미 존재하는 ID입니다.',
  successSignup: '정상적으로 회원가입 되었습니다.'
}

const PATTERN = {
  idPattern: /^[A-Za-z0-9@]{5,12}$/,
  pwPattern: /^[A-Za-z0-9]{4,12}$/,
}

function checkSignUp() {
  let id = $('#id').val();
  let pw = $("#pw").val();
  let cpw = $("#cpw").val();

  if (id.length == 0 || pw.length == 0 || cpw.length == 0) {
    alert(MESSAGE.blankError);
    return false;
  } else if (!PATTERN.idPattern.test(id)) {
    alert(MESSAGE.idError);
    return false;
  } else if (!PATTERN.pwPattern.test(pw)) {
    alert(MESSAGE.pwError);
    return false;
  } else if (pw !== cpw) {
    alert(MESSAGE.cpwError);
    return false;
  } else {
      $.ajax({
        url : "/backend/db.js",
        type : "POST",
        data : {
          user_id : id,
          password : pw
        },
        success : function (data) {
          if (data === "중복ID"){
            alert(MESSAGE.existID);
            return false;
          }
          else if (data === "성공") {
            alert(MESSAGE.successSignup);
          }
        }
      })
  };

  return true;
};
