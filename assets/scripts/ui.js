$(document).ready(function() {
  // fix main menu to page on passing
  $(".main.menu").visibility({
    type: "fixed"
  });
  $(".overlay").visibility({
    type: "fixed",
    offset: 80
  });

  // lazy load images
  $(".image").visibility({
    type: "image",
    transition: "vertical flip in",
    duration: 500
  });

  // show dropdown on hover
  $(".ui.dropdown").dropdown({
    on: "click"
  });
});
