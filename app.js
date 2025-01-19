// const express = require('express');
// const index = require("./backend/router/index");
// const app = express();
// const port = 3000;

//css 파일 연동, 이미지 자료 사용 경로 _ 이건 수정하지 말아주세요.
// app.use(express.static('frontend/src'));
// app.use(express.static('frontend/assets/images'));
// app.use(express.static('frontend/assets/icon'));

// // 경로 설정을 위해(/login, /main..)
// app.use("/",index);

// app.listen(port, () => {
//   console.log(`서버 실행중.`);
// });

// module.exports = app;

const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const nunjucks = require("nunjucks");
const dotenv = require("dotenv");
const passport = require("passport");

dotenv.config();
const pageRouter = require("./routes/page"); //페이지라우터
const authRouter = require("./routes/auth"); //페이지라우터
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");
const { sequelize } = require("./models");
const passportConfig = require("./passport");
const cors = require("cors");

const app = express();
passportConfig(); //패스포트 설정
app.set("port", process.env.PORT || 8003);
app.set("view engine", "html");
nunjucks.configure("./frontend/src/html", {
  express: app,
  watch: true,
});

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use("/img", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
//css 파일 연동, 이미지 자료 사용 경로 _ 이건 수정하지 말아주세요.
app.use(express.static("frontend/src"));
app.use(express.static("frontend/assets/images"));
app.use(express.static("frontend/assets/icon"));

app.use("/", pageRouter); //페이지 - page.js
app.use("/auth", authRouter); //페이지 - auth.js
app.use("/post", postRouter);
app.use("/user", userRouter);

app.use((req, res, next) => {
  const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기중");
});

// 내장 기능 json 제공 기능을 추가
app.use(express.json());
// url인코딩 기능을 추가한다. extended:false면 내장 쿼리 스트링 모듈을 사용한다.
app.use(express.urlencoded({ extended: false }));
