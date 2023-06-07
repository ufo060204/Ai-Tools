"use strict";

// swiper
var swiper = new Swiper('.swiper', {
  // Optional parameters
  // direction: 'vertical',
  loop: true,
  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
    clickable: true
  } // Navigation arrows
  // navigation: {
  //   nextEl: '.swiper-button-next',
  //   prevEl: '.swiper-button-prev',
  // },
  // And if we need scrollbar
  // scrollbar: {
  //   el: '.swiper-scrollbar',
  // },

}); // animate

var timeline = gsap.timeline({
  repeat: -1,
  repeatDelay: 1
});
timeline.from('.deco3', {
  yPercent: 100,
  duration: 2
});
timeline.from('.deco2', {
  yPercent: 100,
  duration: 1
}, "<0.8");
timeline.from('.deco1', {
  yPercent: 100,
  duration: 0.8
}, "<0.5");
timeline.to('.deco3', {
  yPercent: -100,
  duration: 0.5
});
timeline.to('.deco2', {
  yPercent: -100,
  duration: 1
}, "<");
timeline.to('.deco1', {
  yPercent: -100,
  duration: 2
}, "<");
//# sourceMappingURL=all.js.map
