function closePopup() {
  let popup = document.getElementById("popup_bg");
  popup.style.display = "none";
}

function showPopup(imgsrc, imgNum) {
  let popup = document.getElementById("popup_bg");
  let clickImg = document.getElementById("clicked_img");
  let imgTxt = document.getElementById("img_generating_txt");
  // alert(imgNum);
  // let popupHeart = document.getElementsByClassName("popup_heart");
  // popupHeart.id = `${imgNum}_heart`;
  // alert(popupHeart.id);
  // axios
  //   .post(`/post/popupimg/${popupHeart.id}/checklike`)
  //   .then((res) => {
  //     if (res.data === "Liked") {
  //       popupHeart.src = "http://localhost:8003/like_btn.svg";
  //     } else if (res.data === "Unliked") {
  //       popupHeart.src = "http://localhost:8003/white_heart.svg";
  //     }
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //   });

  // popupHeart.onclick = function () {
  //   changeHeart(popupHeart.id);
  // };

  // popupHeart.addEventListener("click", function () {
  //   popupHeart.onclick = changeHeart(`${popupHeart.id}`);
  // });

  var arSplitUrl = imgsrc.split("/");
  var nArLength = arSplitUrl.length;
  var arFileName = arSplitUrl[nArLength - 1];
  var arSplitFileName = arFileName.split(".");
  var sFileName = decodeURIComponent(arSplitFileName[0]);

  var gTotalTxt = sFileName.split("_");
  var gTxt = gTotalTxt[1].split("[");

  if (gTxt.length > 1) {
    var gTagFirst = gTxt[1].split(`{"value":`).join("");
    var tags = gTagFirst.replace(/}/g, "");
    tags = tags.replace(/]/g, "");
    tags = tags.replace(/"/g, "");
    var printTags = tags.split(`,`);

    imgTxt.innerHTML = `${gTxt[0]}<br>#${printTags.join(` #`)}`;
  } else {
    imgTxt.innerHTML = `${gTxt[0]}`;
  }
  clickImg.src = imgsrc;

  popup.style.display = "block";

  // 화면 스크롤을 맨 위로 이동
  $("html, body").animate({ scrollTop: 0 }, 400);
}

function copyTxt() {
  let text = document.getElementById("img_generating_txt").textContent;

  const textArea = document.createElement("textarea");
  document.body.appendChild(textArea);
  textArea.value = text;
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
  alert(`복사되었습니다.`);
}

function changeHeart(imgId) {
  let heart = document.getElementById(imgId);

  if (heart == "http://localhost:8003/white_heart.svg") {
    document.getElementById(imgId).src = "http://localhost:8003/like_btn.svg";
  } else {
    document.getElementById(imgId).src =
      "http://localhost:8003/white_heart.svg";
  }

  // const twitId = imgId;
  // alert(twitId);

  // axios
  //   .post(`/post/${twitId}/like`)
  //   .then((res) => {
  //     if (res.data === "Liked") {
  //       heart.src = "http://localhost:8003/like_btn.svg";
  //     } else if (res.data === "Unliked") {
  //       heart.src = "http://localhost:8003/white_heart.svg";
  //     }
  //   })
  //   .catch((err) => {
  //     console.error(err);
  //   });
}

async function toDataURL(url) {
  const blob = await fetch(url).then((res) => res.blob());
  return URL.createObjectURL(blob);
}
