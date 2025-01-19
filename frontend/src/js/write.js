window.onload = function () {
  // 파일 표시 기능
  let file = document.querySelector("#img_file");
  let show = document.querySelector("#choose_file");
  let deleteBtn = document.querySelector("#file_delete_btn");

  file.addEventListener("change", function () {
    if (window.FileReader) {
      // modern browser
      var filename = $(this)[0].files[0].name;
      readImage($(this)[0]);
    } else {
      // old IE
      var filename = $(this).val().split("/").pop().split("\\").pop(); // 파일명만 추출
      readImage($(this)[0]);
    }

    // 화면 보이기, 추출한 파일명 삽입
    $(show).css("display", "block");
    $(deleteBtn).css("display", "block");
    $(this).siblings(show).val(filename);
  });
};

function readImage(input) {
  let previewImage = document.getElementById("preview");
  $(previewImage).css("display", "block");

  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      previewImage.src = e.target.result;
    };
    // reader가 이미지 읽도록 하기
    reader.readAsDataURL(input.files[0]);
  }
}

function deleteFile() {
  let show = document.querySelector("#choose_file");
  let deleteBtn = document.querySelector("#file_delete_btn");
  let previewImage = document.getElementById("preview");
  show.value = "";

  $(previewImage).css("display", "none");
}

function textareaSize() {
  let textarea = document.querySelector("#post_txt");
  let generateTxt = textarea.value;

  textarea.style.height = "auto";
  textarea.style.minHeight = `36px`;
  let height = textarea.scrollHeight; // 높이

  if (generateTxt.split("\n").length > 1) {
    textarea.style.height = `${height + 5}px`;
    textarea.style.minHeight = `${height + 5}px`;
  } else {
    textarea.style.height = "auto";
  }
}
