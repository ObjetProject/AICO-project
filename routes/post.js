const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const { Image, Post, Hashtag, Comment } = require("../models");
const { isLoggedIn } = require("./middlewares");
const User = require("../models/user");
const connection = require("../backend/db.js");

const router = express.Router();

try {
  fs.readdirSync("uploads");
} catch (error) {
  console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
  fs.mkdirSync("uploads");
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "uploads/");
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// POST /post/img
// 이미지를 업로드 받은 뒤 저장경로를 클라이언트로 응답
router.post("/img", isLoggedIn, upload.single("img"), (req, res) => {
  console.log("hhghghg");
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
});

// POST /post
// /img 라우터에서 이미지 업로드 했으면 이미지 주소 req.body.url로 전송
const upload2 = multer();

router.post("/", isLoggedIn, upload2.none(), async (req, res, next) => {
  try {
    console.log("URL from request:", req.body);

    const [image] = await Image.findAll({
      attributes: ["img_num", "img_path"],
      where: { img_path: req.body.url },
      order: [["img_num", "DESC"]],
      limit: 1,
    });

    const post = await Post.create({
      content: req.body.content,
      img: image.img_path,
      UserId: req.user.id,
    });
    console.log(post);
    console.log("오케이");

    const hashtags = req.body.content.match(/#[^\s#]+/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag) => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          });
        })
      );
      await post.addHashtags(result.map((r) => r[0]));
    }
    res.redirect("/share");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/:id/like", async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { id: req.params.id } });
    const liker = await post.getLiker({
      where: { id: req.user.dataValues.id },
    });

    if (liker.length > 0) {
      console.log("이미 좋아요를 누름");
      await post.removeLiker(req.user.dataValues.id);
      return res.send("Unliked");
    }
    console.log("좋아요를 누름");
    await post.addLiker(req.user.dataValues.id);
    res.send("Liked");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/:id/checklike", async (req, res, next) => {
  console.log(`followNumber: ${req.params.id}`);
  console.log(`useriddd: ${req.user.dataValues.id}`);

  const post = await Post.findOne({ where: { id: req.params.id } });
  const liker = await post.getLiker({
    where: { id: req.user.dataValues.id },
  });
  // console.log(`포포스트트: ${Post}`);
  // console.log(`이미지지지: ${Image}`);
  // console.log(`------------`);
  // console.log(`포포스트트: ${post}`);
  // console.log(`이미지지지: ${liker}`);
  try {
    if (liker.length > 0) {
      console.log("이미 좋아요를 누름");
      return res.send("Liked");
    }
    console.log("좋아요를 누름");
    res.send("Unliked");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/popupimg/:id/checklike", async (req, res, next) => {
  console.log(`followNumber: ${req.params.id}`);
  // console.log(`useriddd: ${req.user.dataValues.id}`);

  const post = await Post.findOne({ where: { id: req.params.id } });
  // const liker = await post.getLiker({
  //   where: { id: req.user.dataValues.id },
  // });

  try {
    console.log(`포포스트트: ${Post.id}`);
    console.log(`이미지지지: ${Image}`);
    console.log("좋아요를 누름ㅎㅎㅎ");
    console.log(`포포스: ${post}`);
    res.send("Unliked");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await Post.destroy({ where: { id: req.params.id, userId: req.user.id } });
    res.send("OK");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/comments", isLoggedIn, async (req, res, next) => {
  console.log("comment log : ", req.body);
  try {
    const { postId, content } = req.body;
    const comment = await Comment.create({
      PostId: postId,
      UserId: req.user.id,
      content,
    });
    console.log(comment);
    res.redirect("/share");
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete("/delete/comment/:id", async (req, res, next) => {
  try {
    await Comment.destroy({
      where: { id: req.params.id, userId: req.user.id },
    });
    res.send("OK");
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
