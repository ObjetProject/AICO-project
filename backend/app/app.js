"use strict";

// 모듈
const express = require("express");
const app = express();

// 라우팅
const home = require("./src/routes/home"); // 홈은 현재 경로의 루트/홈 폴더에 있음

// 앱 세팅 화면 뷰를 관리할 폴더
app.set("views", "./src/views");
app.set("view engine", "ejs");

// app.js 위치 안에 있는 src 폴더의 public을 정적 폴더로 추가
//헤더에 스크립트로 연결한 js로 접근할 수 있도록 돕는 미들웨어 등록
app.use(express.static(`${__dirname}/src/public`)); 

// 미들웨어를 등록 
app.use("/", home); // 루트 경로로 들어오면 홈을 보내줌

module.exports = app;

