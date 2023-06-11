// swiper
const swiper = new Swiper('.swiper', {
  // Optional parameters
  // direction: 'vertical',
  // loop: true,

  // If we need pagination
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  // 斷點設定
  slidesPerView: 1,
  spaceBetween: 24,
  breakpoints: {
    576: {
      slidesPerView: 2,
      slidesPerGroup: 2,
    },
    768: {
      slidesPerView: 3,
      slidesPerGroup: 3,
    },
  }
  // Navigation arrows
  // navigation: {
  //   nextEl: '.swiper-button-next',
  //   prevEl: '.swiper-button-prev',
  // },

  // And if we need scrollbar
  // scrollbar: {
  //   el: '.swiper-scrollbar',
    
  // },
});

// animate
const timeline = gsap.timeline({repeat: -1, repeatDelay: 1})

timeline.from('.deco3', {yPercent:  100, duration:2})
timeline.from('.deco2', {yPercent:  100, duration:1},"<0.8")
timeline.from('.deco1', {yPercent:  100, duration:0.8},"<0.5")
timeline.to('.deco3', {yPercent:  -100, duration:0.5})
timeline.to('.deco2', {yPercent:  -100, duration:1},"<")
timeline.to('.deco1', {yPercent:  -100, duration:2},"<")

// custom-collapse icon 切換
const customCollapseIcon = document.querySelector('.custom-collapse-icon')
customCollapseIcon.addEventListener('click', () => {
  customCollapseIcon.textContent === 'close' ? customCollapseIcon.textContent = 'menu' : customCollapseIcon.textContent = 'close' 
})

// Api 串接
// 資料串接
const apiPath = 'https://2023-engineer-camp.zeabur.app'

let workData = []
let pageData =  {}

const data = {
  type: '',
  sort: 0,
  page: 1,
  search: ''
}

function getData({type, sort, page, search}) {
  const apiUrl = `${apiPath}/api/v1/works?sort=${sort}&page=${page}&${type ? `type=${type}&` : ''}${search ? `search=${search}` : ''}`
  axios.get(apiUrl)
    .then((res) => {
      workData = res.data.ai_works.data;
      pageData = res.data.ai_works.page;

      renderWork()
      renderPage()
    })
}

getData(data);

// AI工具作品 畫面渲染
const aiToolList = document.querySelector('.ai-tool-list');

function renderWork() {
  let work = ''

  workData.forEach((item) => {
    work += /*html*/
    `
    <li class="col">
      <div class="card ai-tool-img border overflow-hidden h-100">
        <div class="overflow-hidden">
          <img class="card-img-top" src="${item.imageUrl}"
            alt="ai">
        </div>
        <div class="card-body d-flex flex-column p-0">
          <div class="flex-grow-1 px-8 py-5 border-bottom">
            <h3 class="mb-3 text-bk-100 fs-9 fw-bolder">${item.title}</h3>
            <p class="text-bk-80 fs-11 mb-0">
              ${item.description}
            </p>
          </div>
          <div class="d-flex justify-content-between align-items-center px-8 py-5 border-bottom">
            <p class="text-bk-100 fs-10 mb-0 fw-bold">AI 模型</p>
            <p class="text-bk-100 fs-10 mb-0">${item.model}</p>
          </div>
          <div class="d-flex justify-content-between align-items-center px-8 py-5">
            <p class="text-bk-100 fs-10 mb-0">#${item.type}</p>
            <a href="${item.link}" target="_blank">
              <img src="https://github.com/hexschool/2022-web-layout-training/blob/main/2023web-camp/icons/share.png?raw=true"
                alt="share">
            </a>
          </div>
        </div>
      </div>
    </li>
    `
  })

  aiToolList.innerHTML = work
}

// pagination 畫面渲染
const pagination = document.querySelector('.pagination')

function renderPage() {
  let pageStr = ''
  
  if (pageData.has_pre) {
    pageStr += /*html*/
    `
    <li class="page-item me-1">
      <a class="page-Link page-Previous custom-pagination" href="#" aria-label="Previous">
        <span class="material-icons fs-10">
          keyboard_arrow_left
        </span>
      </a>
    </li>
    `
  }
  for (let i = 1; i <= pageData.total_pages; i += 1) {
    pageStr += /*html*/
    `
    <li class="page-item ${Number(pageData.current_page) === i ? 'active' : ''} me-1">
      <a class="page-link ${Number(pageData.current_page) === i ? 'disabled' : ''} custom-pagination" href="#" data-page="${i}">
        ${i}
      </a>
    </li>
    `
  }
  if (pageData.has_next) {
    pageStr += /*html*/
    `
    <li class="page-item">
      <a class="page-Link page-Next custom-pagination" href="#" aria-label="Next">
        <span class="material-icons fs-10">
          keyboard_arrow_right
        </span>
      </a>
    </li>
    `
  }
  pagination.innerHTML = pageStr

  changePage(pageData)
}

// pagination 分頁切換
function changePage(pageData) {
  const pageLink = document.querySelectorAll('a.page-link')
  const pagePrevious = document.querySelector('.page-Previous')
  const pageNext = document.querySelector('.page-Next')
  let pageId = ''

  pageLink.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.preventDefault()
      pageId = e.target.dataset.page
      data.page = Number(pageId)

      getData(data)
    })
  })
  if(pageData.has_next) {
    pageNext.addEventListener('click', (e) => {
      e.preventDefault()
      data.page = Number(pageData.current_page) + 1
      getData(data)
    })
  }
  if(pageData.has_pre)
  pagePrevious.addEventListener('click', (e) => {
    e.preventDefault()
    data.page = Number(pageData.current_page) - 1
    getData(data)
  })
}

// 切換作品類型
const filterBtn = document.querySelectorAll('.filter-btn')
const btnFilter = document.querySelector('.btn-filter')
filterBtn.forEach((item) => {
  item.addEventListener('click' , (e) => {
    e.preventDefault()
    // 移除所有按鈕的 'active' class
    filterBtn.forEach((item) => {
      item.classList.remove('active')
    })
    // 為當前點擊按鈕加上 'active' class
    item.classList.add('active')

    // 更新按鈕上顯示的文字
    btnFilter.textContent = item.textContent

    if(item.textContent === '所有類型') {
      data.type = ''
      
    }else {
      data.type = item.textContent
    }
    getData(data)
  })
})

// 切換作品排序
const newFirst = document.querySelector('.new-first')
const oldFirst = document.querySelector('.old-first')
const btnSort = document.querySelector('.btn-sort')

// 由新到舊 => sort = 0
newFirst.addEventListener('click', (e) => {
  e.preventDefault()
  data.sort = 0
  getData(data)
  btnSort.textContent = '由新到舊'
})
// 由舊到新 => sort = 1
oldFirst.addEventListener('click', (e) => {
  e.preventDefault()
  data.sort = 1
  getData(data)
  btnSort.textContent = '由舊到新'
})

// 搜尋
const search = document.querySelector('.search')
search.addEventListener('keydown', (e) => {
  if(e.keyCode === 13) {
    data.search = search.value
    data.page = 1
    getData(data)
  }
})