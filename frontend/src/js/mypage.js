function hambuger() {
  var burger = $(".menu-trigger");
  var category_btn = $(".category_group");
  burger.each(function (index) {
    $(this).toggleClass("active-8");
    if (category_btn.css("display") == "none") {
      category_btn.css("display", "flex");
    } else {
      category_btn.css("display", "none");
    }
  });
}
