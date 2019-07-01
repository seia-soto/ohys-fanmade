$(document).ready(function() {
  // show dropdown on hover
  $(".ui.dropdown").dropdown({
    on: "click"
  });

  $(".ui.accordion")
    .accordion()
  ;

  $(".ui.rating")
    .rating({
      maxRating: 5
    })
    .rating("disable")
  ;
});
