function closePopup() {
  location.reload(true);
}

function showPopup(imgsrc, user, content, postId) {
  let popup = document.getElementById("popup");
  let clickedImg = document.getElementById("post_img");
  let popupUser = document.getElementById("post_popup_userid");
  let cardTxt = document.getElementById("popupTxt");
  let style = document.getElementById("generate_style");
  let popupHeart = document.querySelector(".popup_heart");

  popupHeart.id = `${postId}_heart`;
  axios
    .post(`/post/${popupHeart.id}/checklike`)
    .then((res) => {
      if (res.data === "Liked") {
        popupHeart.src = "http://localhost:8003/like_btn.svg";
      } else if (res.data === "Unliked") {
        popupHeart.src = "http://localhost:8003/white_heart.svg";
      }
    })
    .catch((err) => {
      console.error(err);
    });

  style.innerHTML = ``;

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

    style.innerHTML = `#${printTags.join(` #`)}`;
  }

  let myid = document.querySelector(`.login_user`).innerHTML;

  let hiddenPostIdInput = document.querySelector(
    ".write_img_post_box input[name='postId']"
  );
  if (hiddenPostIdInput) {
    hiddenPostIdInput.value = postId;
  }

  let commentsList = document.querySelector(".post_box");
  commentsList.innerHTML = "";

  let comments = postsComments[postId];
  if (comments) {
    comments.forEach((comment) => {
      let li = document.createElement("li");
      li.className = "post";

      if (comment.User.nick === myid) {
        li.innerHTML = `
        <div class="post_writer_icon_name">
          <img class="post_icon" src="profile_circle.svg" />
          <div class="post_name">${comment.User.nick}</div>
          <img class="delete_comments" src="close_btn.svg" onclick="deleteComment(${comment.UserId},${comment.id})" />
        </div>
        <p class="img_post_txt">${comment.content}</p>`;
      } else {
        li.innerHTML = `
        <div class="post_writer_icon_name">
          <img class="post_icon" src="profile_circle.svg" />
          <div class="post_name">${comment.User.nick}</div>
        </div>
        <p class="img_post_txt">${comment.content}</p>`;
      }

      commentsList.appendChild(li);
    });
  }

  popupUser.innerHTML = user;
  cardTxt.innerHTML = content;
  clickedImg.src = imgsrc;
  popup.style.display = "block";

  $("html, body").animate({ scrollTop: 0 }, 400);
}

function deleteComment(userId, commentId) {
  if (confirm("댓글을 삭제하겠습니까?")) {
    axios
      .delete(`/post/delete/comment/${commentId}`)
      .then((res) => {
        location.reload();
      })
      .catch((err) => {
        console.error(err);
      });
  }
}
