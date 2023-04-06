"use strict";

const home = (req, res) => {
    res.render("home/index");
};

const login = (req, res) => {
    res.render("home/login");
};

// 컨트롤러 모듈 내보내기
module.exports = {
    home,
    login,
};