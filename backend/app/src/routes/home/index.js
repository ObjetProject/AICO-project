"use strict";

const express = require("express");
const router = express.Router();

const ctrl = require("./home.ctrl");

// 루트
router.get("/", ctrl.home);

// 로그인
router.get("/login", ctrl.login);

// 모듈로 내보내기
module.exports = router;

