"use strict";

// swiper
var swiper = new Swiper('.swiper', {
  // Optional parameters
  // direction: 'vertical',
  // loop: true,
  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
    clickable: true
  },
  // 斷點設定
  slidesPerView: 1,
  spaceBetween: 24,
  breakpoints: {
    576: {
      slidesPerView: 2,
      slidesPerGroup: 2
    },
    768: {
      slidesPerView: 3,
      slidesPerGroup: 3
    }
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
}, "<"); // custom-collapse icon 切換

var customCollapseIcon = document.querySelector('.custom-collapse-icon');
customCollapseIcon.addEventListener('click', function () {
  customCollapseIcon.textContent === 'close' ? customCollapseIcon.textContent = 'menu' : customCollapseIcon.textContent = 'close';
}); // Api 串接
// 資料串接

var apiPath = 'https://2023-engineer-camp.zeabur.app';
var workData = [];
var pageData = {};
var data = {
  type: '',
  sort: 0,
  page: 1,
  search: ''
};

function getData(_ref) {
  var type = _ref.type,
      sort = _ref.sort,
      page = _ref.page,
      search = _ref.search;
  var apiUrl = "".concat(apiPath, "/api/v1/works?sort=").concat(sort, "&page=").concat(page, "&").concat(type ? "type=".concat(type, "&") : '').concat(search ? "search=".concat(search) : '');
  axios.get(apiUrl).then(function (res) {
    workData = res.data.ai_works.data;
    pageData = res.data.ai_works.page;
    renderWork();
    renderPage();
  });
}

getData(data); // AI工具作品 畫面渲染

var aiToolList = document.querySelector('.ai-tool-list');

function renderWork() {
  var work = '';
  workData.forEach(function (item) {
    work +=
    /*html*/
    "\n    <li class=\"col\">\n      <div class=\"card ai-tool-img border overflow-hidden h-100\">\n        <div class=\"overflow-hidden\">\n          <img class=\"card-img-top\" src=\"".concat(item.imageUrl, "\"\n            alt=\"ai\">\n        </div>\n        <div class=\"card-body d-flex flex-column p-0\">\n          <div class=\"flex-grow-1 px-8 py-5 border-bottom\">\n            <h3 class=\"mb-3 text-bk-100 fs-9 fw-bolder\">").concat(item.title, "</h3>\n            <p class=\"text-bk-80 fs-11 mb-0\">\n              ").concat(item.description, "\n            </p>\n          </div>\n          <div class=\"d-flex justify-content-between align-items-center px-8 py-5 border-bottom\">\n            <p class=\"text-bk-100 fs-10 mb-0 fw-bold\">AI \u6A21\u578B</p>\n            <p class=\"text-bk-100 fs-10 mb-0\">").concat(item.model, "</p>\n          </div>\n          <div class=\"d-flex justify-content-between align-items-center px-8 py-5\">\n            <p class=\"text-bk-100 fs-10 mb-0\">#").concat(item.type, "</p>\n            <a href=\"").concat(item.link, "\" target=\"_blank\">\n              <img src=\"https://github.com/hexschool/2022-web-layout-training/blob/main/2023web-camp/icons/share.png?raw=true\"\n                alt=\"share\">\n            </a>\n          </div>\n        </div>\n      </div>\n    </li>\n    ");
  });
  aiToolList.innerHTML = work;
} // pagination 畫面渲染


var pagination = document.querySelector('.pagination');

function renderPage() {
  var pageStr = '';

  if (pageData.has_pre) {
    pageStr +=
    /*html*/
    "\n    <li class=\"page-item me-1\">\n      <a class=\"page-Link page-Previous custom-pagination\" href=\"#\" aria-label=\"Previous\">\n        <span class=\"material-icons fs-10\">\n          keyboard_arrow_left\n        </span>\n      </a>\n    </li>\n    ";
  }

  for (var i = 1; i <= pageData.total_pages; i += 1) {
    pageStr +=
    /*html*/
    "\n    <li class=\"page-item ".concat(Number(pageData.current_page) === i ? 'active' : '', " me-1\">\n      <a class=\"page-link ").concat(Number(pageData.current_page) === i ? 'disabled' : '', " custom-pagination\" href=\"#\" data-page=\"").concat(i, "\">\n        ").concat(i, "\n      </a>\n    </li>\n    ");
  }

  if (pageData.has_next) {
    pageStr +=
    /*html*/
    "\n    <li class=\"page-item\">\n      <a class=\"page-Link page-Next custom-pagination\" href=\"#\" aria-label=\"Next\">\n        <span class=\"material-icons fs-10\">\n          keyboard_arrow_right\n        </span>\n      </a>\n    </li>\n    ";
  }

  pagination.innerHTML = pageStr;
  changePage(pageData);
} // pagination 分頁切換


function changePage(pageData) {
  var pageLink = document.querySelectorAll('a.page-link');
  var pagePrevious = document.querySelector('.page-Previous');
  var pageNext = document.querySelector('.page-Next');
  var pageId = '';
  pageLink.forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      pageId = e.target.dataset.page;
      data.page = Number(pageId);
      getData(data);
    });
  });

  if (pageData.has_next) {
    pageNext.addEventListener('click', function (e) {
      e.preventDefault();
      data.page = Number(pageData.current_page) + 1;
      getData(data);
    });
  }

  if (pageData.has_pre) pagePrevious.addEventListener('click', function (e) {
    e.preventDefault();
    data.page = Number(pageData.current_page) - 1;
    getData(data);
  });
} // 切換作品類型


var filterBtn = document.querySelectorAll('.filter-btn');
var btnFilter = document.querySelector('.btn-filter');
filterBtn.forEach(function (item) {
  item.addEventListener('click', function (e) {
    e.preventDefault(); // 移除所有按鈕的 'active' class

    filterBtn.forEach(function (item) {
      item.classList.remove('active');
    }); // 為當前點擊按鈕加上 'active' class

    item.classList.add('active'); // 更新按鈕上顯示的文字

    btnFilter.textContent = item.textContent;

    if (item.textContent === '所有類型') {
      data.type = '';
    } else {
      data.type = item.textContent;
    }

    getData(data);
  });
}); // 切換作品排序

var newFirst = document.querySelector('.new-first');
var oldFirst = document.querySelector('.old-first');
var btnSort = document.querySelector('.btn-sort'); // 由新到舊 => sort = 0

newFirst.addEventListener('click', function (e) {
  e.preventDefault();
  data.sort = 0;
  getData(data);
  btnSort.textContent = '由新到舊';
}); // 由舊到新 => sort = 1

oldFirst.addEventListener('click', function (e) {
  e.preventDefault();
  data.sort = 1;
  getData(data);
  btnSort.textContent = '由舊到新';
}); // 搜尋

var search = document.querySelector('.search');
search.addEventListener('keydown', function (e) {
  if (e.keyCode === 13) {
    data.search = search.value;
    data.page = 1;
    getData(data);
  }
});
//# sourceMappingURL=all.js.map
