function changeHeart(tag) {
  const twitId = tag.id;

  axios
    .post(`/post/${twitId}/like`)
    .then((res) => {
      if (res.data === "Liked") {
        tag.src = "http://localhost:8003/like_btn.svg";
      } else if (res.data === "Unliked") {
        tag.src = "http://localhost:8003/white_heart.svg";
      }
    })
    .catch((err) => {
      console.error(err);
    });
}

document.querySelectorAll(".like").forEach(function (tag) {
  tag.addEventListener("click", function () {
    changeHeart(tag);
  });
});

function imgDownload(imageURL, fileName) {
  var img = new Image();
  img.crossOrigin = "Anonymous";
  img.id = "getshot";
  img.src = imageURL;
  document.body.appendChild(img);

  var a = document.createElement("a");
  a.href = getshot.src;
  a.download = fileName;
  a.click();
  document.body.removeChild(img);
}
