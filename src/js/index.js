import "../scss/style.scss";

import cartIcon from "../images/cart.svg";
import userIcon from "../images/user.svg";
import searchIcon from "../images/search.svg";
import coloredBlocksArrow from "../images/colored-blocks-arrow.svg";
import { Slider } from "./Slider.js";
import { Books } from "./Books.js";

// DOM elements
const sliderImgs = document.querySelectorAll(".slider-container-img"); // Картинки слайдера
const sliderToggleButtons = document.querySelectorAll(".slider-btn-dot"); // Кнопки слайдера
const listBooksInfo = document.querySelector(".list-books-info"); // Контейнер с книгами
const loadingSpinner = document.querySelector(".loading-spinner"); // Индикатор загрузки
const loadMoreBtn = document.querySelector(".list-books-info__btn-load"); // Кнопка "Загрузить еще"
const navLinks = document.querySelectorAll(".nav-link"); // Ссылки в header
const listCategories = document.querySelectorAll(
  ".list-books-categories__link"
); // Ссылки в категориях

//
const categoryMap = {
  Architecture: "Architecture",
  Business: "Business",
  "Art & Fashion": "Art",
  Biography: "Biography & Autobiography",
  "Craft & Hobbies": "Crafts & Hobbies",
  Drama: "Drama",
  Fiction: "Fiction",
  "Food & Drink": "Cooking",
  "Health & Wellbeing": "Health & Fitness",
  "History & Politics": "History",
  Humor: "Humor",
  Poetry: "Poetry",
  Psychology: "Psychology",
  Science: "Science",
  Technology: "Technology",
  "Travel & Maps": "Travel",
};

// Активный класс для навигации
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    document
      .querySelector(".nav-link--active")
      ?.classList.remove("nav-link--active"); // Убираем активный класс у активной ссылки
    link.classList.add("nav-link--active"); // Добавляем активный класс к новой ссылке
  });
});

// Slider initialization
const slider = new Slider(sliderImgs, sliderToggleButtons);
slider.init();

// Books initialization
const books = new Books(
  categoryMap,
  loadingSpinner,
  listBooksInfo,
  loadMoreBtn,
  listCategories
);

books.loadInitialBooks();

// Header icons
const headerIcons = [
  { icon: cartIcon, container: ".toolbar-cart-btn", alt: "cart-btn" },
  { icon: searchIcon, container: ".toolbar-search-btn", alt: "search-btn" },
  { icon: userIcon, container: ".toolbar-user-btn", alt: "user-btn" },
];

headerIcons.forEach(({ icon, container, alt }) => {
  const img = document.createElement("img");
  img.src = icon;
  img.alt = alt;
  document.querySelector(container).appendChild(img);
});

// Colored blocks arrow
const coloredBlocks = document.querySelectorAll(".colored-blocks-link");
coloredBlocks.forEach((block) => {
  const img = document.createElement("img");
  img.src = coloredBlocksArrow;
  img.alt = "arrow-icon";
  block.appendChild(img);
});
