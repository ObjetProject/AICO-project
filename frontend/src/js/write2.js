window.onload = function () {
  // 파일 표시 기능
  let file = document.querySelector("#img");
  let show = document.querySelector("#choose_file");
  // let show = document.querySelector("#img-url");
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
    // const imageSrc = URL.createObjectURL(filename);
    // preview.src = img;

    // 화면 보이기, 추출한 파일명 삽입
    $(show).css("display", "block");
    $(deleteBtn).css("display", "block");
    // $(this).siblings(show).val(filename);
    show.value = filename;
  });
};

function historyInput(imgSrc) {
  alert(imgSrc);
  closeHistoryPopup();
  let show = document.querySelector("#choose_file");
  let deleteBtn = document.querySelector("#file_delete_btn");

  // 화면 보이기, 추출한 파일명 삽입
  $(show).css("display", "block");
  $(deleteBtn).css("display", "block");
  // $(this).siblings(show).val(filename);
  show.value = imgSrc;

  let previewImage = document.getElementById("img-preview");
  $(previewImage).css("display", "block");
  previewImage.src = imgSrc;
}

function readImage(input) {
  let previewImage = document.getElementById("img-preview");
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
  // let show = document.querySelector("#img-url");
  let deleteBtn = document.querySelector("#file_delete_btn");
  let previewImage = document.getElementById("img-preview");
  // previewImage.src = '';
  show.value = "";

  $(previewImage).css("display", "none");
  // $(deleteBtn).css('display', 'none');
}

function textareaSize() {
  let textarea = document.querySelector("#twit");
  let generateTxt = textarea.value;

  textarea.style.height = "auto";
  textarea.style.minHeight = `36px`;
  let height = textarea.scrollHeight; // 높이

  if (height > 300) {
    textarea.style.height = "300px";
    textarea.style.overflow = `auto`;
  } else if (generateTxt.split("\n").length > 1) {
    textarea.style.height = `${height + 5}px`;
    textarea.style.minHeight = `${height + 5}px`;
  } else {
    textarea.style.height = "auto";
  }
}

// function readURL(input) {
//   if (input.files && input.files[0]) {
//     var reader = new FileReader();
//     reader.onload = function(e) {
//       document.getElementById('preview').src = e.target.result;
//     };
//     reader.readAsDataURL(input.files[0]);
//   } else {
//     document.getElementById('preview').src = "";
//   }
// }

function showWrite() {
  let write = document.querySelector("#twit-form");
  if ($(write).css("display") == "none") {
    $(write).css("display", "flex");
  } else {
    $(write).css("display", "none");
  }
}

function showHistory() {
  let history = document.querySelector(".callHistory");
  if ($(history).css("display") == "none") {
    $(history).css("display", "flex");
  } else {
    // deleteAllImages();
    $(history).css("display", "none");
  }
}

async function fetchFourImages() {
  const response = await fetch("/history/images");
  const images = await response.json();
  return images;
}

// 이미지 목록을 받아와서 화면에 표시하는 함수
async function displayAllImages() {
  const images = await fetchFourImages();
  const container = document.getElementById("writeHistory");

  images.forEach((image, idx) => {
    // 이미지를 표시할 img 태그 생성
    const imgElement = document.createElement("img");
    // 이미지의 URL을 설정
    imgElement.src = image.img_path.replace(`#`, `%23`);

    imgElement.alt = `Image ${image.img_num}`;
    imgElement.classList.add("history_img");
    imgElement.onclick = function () {
      historyInput(imgElement.src);
    };

    // 이미지를 화면에 추가
    container.appendChild(imgElement);
  });
}

function closeHistoryPopup() {
  let popup = document.getElementById("history_pop");
  popup.style.display = "none";
}
