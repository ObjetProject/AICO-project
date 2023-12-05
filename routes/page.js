const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const { Post, User, Hashtag, Comment } = require("../models");
const { Configuration, OpenAIApi } = require("openai");
const fs = require("fs");
const AWS = require("aws-sdk");
require("dotenv").config();
const connection = require("../backend/db");
const cors = require("cors");

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = req.user?.Followers?.length || 0;
  res.locals.followingCount = req.user?.Followings?.length || 0;
  res.locals.followingIdList = req.user?.Followings?.map((f) => f.id) || [];
  next();
});

router.use(cors());
router.use(express.json());

// router.get('/', (req, res) => { //메인(기본) 페이지
//     res.render('main');
// });

// router.get('/profile', isLoggedIn, (req, res) => { //페이지 - 프로필 profile
//   res.render('profile', { title: '내 정보' , user: req.user});
// });
router.get("/loggedIn/user", (req, res) => {
  const user = req.user;
  res.json({ user });
});

router.get("/signup", isNotLoggedIn, (req, res) => {
  //회원가입 페이지
  res.render("signup", { title: "회원가입" });
});

router.get("/login", (req, res, next) => {
  if (req.isAuthenticated()) {
    // 이미 로그인한 경우
    res.redirect("/mypage");
  } else {
    // 로그인하지 않은 경우
    res.render("login");
  }
});

// router.get('/login', isNotLoggedIn, (req, res, next) => { //로그인 페이지 로그인 안했을 때
//   res.render('login');
// });
// router.get('/login', isLoggedIn, (req, res, next) => { //로그인 페이지 로그인 앴을 때
//    res.redirect('/mypage');
//  });

router.get("/", async (req, res, next) => {
  //페이지
  try {
    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ["id", "nick"],
      },
      other: [["createdAt", "DESC"]],
    });
    // const twits = [];
    res.render("main", {
      title: "main",
      twits: posts,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/generate", isLoggedIn, (req, res) => {
  //생성페이지
  res.render("generate");
});

router.get("/share", isLoggedIn, async (req, res, next) => {
  //페이지 - 로그인
  try {
    const posts = await Post.findAll({
      include: [
        {
          //작성자 가져옴
          model: User,
          attributes: ["id", "nick"],
        },
        {
          //좋아요 누른 사람 가져옴
          model: User,
          attributes: ["id", "nick"],
          as: "Liker", //as로 구분함
        },
        {
          model: Comment, // 댓글 데이터 추가
          include: [
            {
              model: User,
              attributes: ["nick"], // 댓글 작성자 닉네임 포함
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    const postsWithIsLiked = posts.map((post) => ({
      ...post.get({ plain: true }),
      isLiked: post.Liker.some((user) => user.id === req.user.id),
    }));
    console.log("page.js /share :", postsWithIsLiked);
    console.log("post : ", posts);
    res.render("share2", {
      twitsJSON: JSON.stringify(postsWithIsLiked), // JSON.stringify를 사용하여 문자열로 변환
      twits: posts,
      user: req.user,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/hashtag", async (req, res, next) => {
  const query = req.query.hashtag;
  if (!query) {
    return res.redirect("/share");
  }
  try {
    const hashtag = await Hashtag.findOne({ where: { title: query } });
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({ include: [{ model: User }] });
    }

    return res.render("share2", {
      title: `${query}`,
      twits: posts,
      user: req.user,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.get("/mypage", isLoggedIn, async (req, res) => {
  //페이지 - 로그인
  try {
    const posts = await Post.findAll({
      include: [
        {
          //작성자 가져옴
          model: User,
          attributes: ["id", "nick"],
        },
        {
          //좋아요 누른 사람 가져옴
          model: User,
          attributes: ["id", "nick"],
          as: "Liker", //as로 구분함
        },
      ],
      other: [["createdAt", "DESC"]],
    });
    // const twits = [];
    res.render("mypage", {
      twits: posts,
      user: req.user,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/post", (req, res) => {
  //댓글 및 게시글 입력 화면
  res.render("post");
});

router.get("/imgclick", (req, res) => {
  //이미지 클릭 화면
  res.render("img_click");
});

router.get("/write", (req, res) => {
  //글쓰기 페이지
  res.render("write");
});

router.get("/history", (req, res) => {
  //history 페이지
  res.render("history");
});

router.get("/likes", (req, res) => {
  //likes 페이지
  res.render("likes");
});

router.get("/mypost", (req, res) => {
  //mypost 페이지
  res.render("mypost");
});

router.get("/comment", (req, res) => {
  //comment 페이지
  res.render("comment");
});

router.get("/account", (req, res) => {
  //account 페이지
  res.render("account");
});

router.get("/about", (req, res) => {
  //about 페이지
  res.render("about");
});

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const generateImage = async (combinedPrompt, req) => {
  console.log("Checking req:", req);
  const response = await openai.createImage({
    prompt: combinedPrompt,
    n: 1,
    size: "512x512",
    response_format: "b64_json",
  });
  console.log(response);
  console.log("combinedPrompt: ", combinedPrompt);
  console.log("response data: ", response.data);

  const imageUrl = response.data.data[0].b64_json;

  const timestamp = Date.now().toString();
  const randomString = Math.random().toString(36).substring(2, 15);
  const uniqueId = `${combinedPrompt}_${timestamp}_${randomString}`;
  const objectPrefix = "image_";
  const objectKey = `${objectPrefix}${uniqueId}.png`;

  const params = {
    Bucket: "aico-content",
    Key: objectKey,
    Body: Buffer.from(imageUrl, "base64"),
    ContentEncoding: "base64",
    ContentType: "image/png",
  };

  await s3.upload(params).promise();

  const s3ObjectUrl = `https://aico-content.s3.amazonaws.com/${objectKey}`;
  const img_user = req.user.id;

  const query =
    "INSERT INTO image (img_user, img_name, img_date, img_path) VALUES (?, ?, NOW(), ?)";
  const values = [img_user, combinedPrompt, s3ObjectUrl];

  connection.connect((err) => {
    if (err) throw err;

    connection.query(query, values, (err, result) => {
      if (err) throw err;

      console.log("Image inserted:", result);
      //connection.end();
    });
  });

  /*
    const s3Url = s3.getSignedUrl('getObject', params);
    console.log("url: ", s3Url);
    */
  return imageUrl;
};

router.post("/generate", isLoggedIn, async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log("router prompt: ", prompt);
    const image = await generateImage(prompt, req);
    //console.log("image: ",image);
    //const imageUrl = await uploadToImgur(image);

    res.send({ image });
  } catch (error) {
    console.error("Image generation failed:", error);
    console.error("response data error: ", error.response.data);
    console.error("response status error: ", error.response.status);
    res.status(500).json({ error: "Image generation failed" });
  }
});

router.get("/main/images", (req, res) => {
  connection.query(
    "SELECT img_path, img_num FROM image ORDER BY img_num DESC",
    (error, results) => {
      if (error) {
        console.error("Error fetching images: " + error.stack);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      res.json(results);
    }
  );
});

router.get("/history/four/images", (req, res) => {
  const userId = req.user.id;

  connection.query(
    "SELECT img_path, img_num FROM image WHERE img_user = ? ORDER BY img_num DESC LIMIT 4",
    [userId],
    (error, results) => {
      if (error) {
        console.error("Error fetching images: " + error.stack);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      res.json(results);
    }
  );
});

router.get("/history/images", (req, res) => {
  const userId = req.user.id;

  connection.query(
    "SELECT img_num, img_path FROM image WHERE img_user = ? ORDER BY img_num DESC",
    [userId],
    (error, results) => {
      if (error) {
        console.error("Error fetching images: " + error.stack);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      res.json(results);
    }
  );
});

router.get("/posts/four/images", (req, res) => {
  const userId = req.user.id;

  connection.query(
    "SELECT image.img_path, image.img_num FROM posts JOIN image ON posts.img = image.img_path WHERE posts.UserId = ? ORDER BY posts.id DESC LIMIT 4",
    [userId],
    (error, results) => {
      if (error) {
        console.error("Error fetching images: " + error.stack);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      res.json(results);
    }
  );
});

router.get("/posts/images", (req, res) => {
  const userId = req.user.id;

  connection.query(
    "SELECT image.img_path, image.img_num FROM posts JOIN image ON posts.img = image.img_path WHERE posts.UserId = ? ORDER BY posts.id DESC",
    [userId],
    (error, results) => {
      if (error) {
        console.error("Error fetching images: " + error.stack);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      res.json(results);
    }
  );
});

router.get("/like/four/images", (req, res) => {
  const userId = req.user.id;

  connection.query(
    "SELECT image.img_path, image.img_num FROM posts JOIN `Like` ON posts.id = `Like`.PostId JOIN image ON posts.img = image.img_path WHERE `Like`.UserId = ? ORDER BY posts.id DESC LIMIT 4",
    [userId],
    (error, results) => {
      if (error) {
        console.error("Error fetching images: " + error.stack);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      res.json(results);
    }
  );
});

router.get("/like/images", (req, res) => {
  const userId = req.user.id;

  connection.query(
    "SELECT image.img_path, image.img_num FROM posts JOIN `Like` ON posts.id = `Like`.PostId JOIN image ON posts.img = image.img_path WHERE `Like`.UserId = ? ORDER BY posts.id DESC",
    [userId],
    (error, results) => {
      if (error) {
        console.error("Error fetching images: " + error.stack);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      res.json(results);
    }
  );
});

router.get("/comments/four/images", (req, res) => {
  const userId = req.user.id;

  connection.query(
    "SELECT image.img_path, image.img_num FROM posts JOIN comments ON posts.id = comments.PostId JOIN image ON posts.img = image.img_path WHERE comments.UserId = ? ORDER BY comments.id DESC LIMIT 4",
    [userId],
    (error, results) => {
      if (error) {
        console.error("Error fetching images: " + error.stack);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      res.json(results);
    }
  );
});

router.get("/comments/images", (req, res) => {
  const userId = req.user.id;

  connection.query(
    "SELECT image.img_path, image.img_num FROM posts JOIN comments ON posts.id = comments.PostId JOIN image ON posts.img = image.img_path WHERE comments.UserId = ? ORDER BY comments.id DESC",
    [userId],
    (error, results) => {
      if (error) {
        console.error("Error fetching images: " + error.stack);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      res.json(results);
    }
  );
});

module.exports = router;
