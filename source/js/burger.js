document.querySelector(".header__btn-open").addEventListener("click", function() {
  document.querySelector(".header__nav").classList.add("header__nav--active");
})
document.querySelector(".header__toggle").addEventListener("click", function() {
  document.querySelector(".header__nav").classList.remove("header__nav--active");
})
