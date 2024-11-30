import noImage from "../images/no-img.png";
import { Storage } from "./Storage.js";

export class Books {
  constructor(
    categoryMap,
    loadingSpinner,
    listBooksInfo,
    loadMoreBtn,
    listCategories
  ) {
    this.activeCategory = Storage.getActiveCategory();
    this.startIndex = 0;
    this.booksToShow = 6;
    this.booksData = [];
    this.starsData = [];
    this.reviewsData = [];
    this.itemAddedStates = [];
    this.categoryMap = categoryMap;
    this.loadingSpinner = loadingSpinner;
    this.listBooksInfo = listBooksInfo;
    this.loadMoreBtn = loadMoreBtn;
    this.listCategories = listCategories;
    this.addCategoryClickHandlers();
  }

  async fetchBooksByCategory() {
    const categoryParam =
      this.categoryMap[this.activeCategory] || this.activeCategory;
    const keyUrl = "AIzaSyBKp23cWU7A-NJEuLId-MZA5Y7xKA2XkHo";
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(
      categoryParam
    )}&key=${keyUrl}&printType=books&startIndex=${
      this.startIndex
    }&maxResults=10`;

    try {
      this.loadingSpinner.style.display = "block";
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Error loading data");

      const data = await response.json();
      if (!data.items || data.items.length === 0)
        throw new Error("Data not found");

      this.booksData = this.booksData.concat(data.items); // Добавляем новые книги к текущим
    } catch (error) {
      console.error("Error:", error);
    } finally {
      this.loadingSpinner.style.display = "none";
    }
  }

  displayBooks() {
    const booksToDisplay = this.booksData.slice(
      this.startIndex,
      this.startIndex + 10
    );

    booksToDisplay.forEach((book, index) => {
      const cardHtml = this.createBookCard(book, index);
      this.listBooksInfo.insertAdjacentHTML("beforeend", cardHtml); // Добавляем карточки книг

      const lastBookCard = this.listBooksInfo.lastElementChild;

      if (lastBookCard) {
        const stars = lastBookCard.querySelectorAll(".c-icon");
        if (stars) {
          this.activateRandomStars(stars, index); // Активируем звезды
        }

        const reviewElement = lastBookCard.querySelector(
          ".card-book-info__reviews-count"
        );
        if (reviewElement) {
          this.updateReviewCount(reviewElement, index); // Обновляем количество отзывов
          this.addBuyButtonHandlers();
        }
      }
    });
    this.loadMoreBtn.style.display = "block";
  }

  restoreActiveCategory() {
    const savedCategory = Storage.getActiveCategory();
    if (savedCategory) {
      this.activeCategory = savedCategory;
    } else {
      this.activeCategory = "Architecture"; // Категория по умолчанию
      Storage.saveActiveCategory(this.activeCategory); // Сохраняем категорию по умолчанию
    }

    if (this.listCategories && this.listCategories.length > 0) {
      document
        .querySelector(".list-books-categories__link--active")
        ?.classList.remove("list-books-categories__link--active");

      const activeLink = Array.from(this.listCategories).find(
        (link) => link.textContent.trim() === this.activeCategory
      );

      if (activeLink) {
        activeLink.classList.add("list-books-categories__link--active");
      }
    } else {
      console.error("Categories not found");
    }
  }

  addCategoryClickHandlers() {
    this.listCategories.forEach((link) => {
      link.addEventListener("click", async () => {
        const newCategory = link.textContent.trim();

        if (newCategory === this.activeCategory) return; // Если активная категория не изменилась

        this.activeCategory = newCategory; // Обновляем активную категорию
        Storage.saveActiveCategory(newCategory); // Сохраняем выбранную категорию в локальное хранилище

        this.startIndex = 0; // Обнуляем индекс для новой категории
        this.booksData = []; // Очищаем данные книг

        this.loadingSpinner.style.display = "block";
        this.loadMoreBtn.style.display = "none";

        this.listBooksInfo
          .querySelectorAll(".card-book")
          .forEach((card) => card.remove());

        // Удаляем текущую активную категорию
        document
          .querySelector(".list-books-categories__link--active")
          ?.classList.remove("list-books-categories__link--active");

        // Добавляем активной выбранную категорию
        link.classList.add("list-books-categories__link--active");

        try {
          await this.fetchBooksByCategory(); // Загружаем книги по новой категории
          this.displayBooks();
        } catch (error) {
          console.log("Error loading category:", error);
        } finally {
          this.loadingSpinner.style.display = "none";
          this.loadMoreBtn.style.display = "block";
        }
      });
    });
  }

  activateRandomStars(stars, index) {
    stars.forEach((star) => {
      if (star) {
        star.classList.remove("active-star");
      }
    });

    let randomActiveStar =
      this.starsData[index] !== undefined
        ? this.starsData[index]
        : Math.floor(Math.random() * 5) + 1;

    if (this.starsData[index] === undefined) {
      this.starsData[index] = randomActiveStar;
    }

    for (let i = 0; i < randomActiveStar; i++) {
      if (stars[i]) {
        stars[i].classList.add("active-star");
      }
    }
  }

  updateReviewCount(reviewElement, index) {
    let randomNumber =
      this.reviewsData[index] !== undefined
        ? this.reviewsData[index]
        : Math.floor(Math.random() * (10000000 - 10000 + 1)) + 10000;

    if (this.reviewsData[index] === undefined) {
      this.reviewsData[index] = randomNumber;
    }

    let formattedNumber;

    if (randomNumber >= 1000000) {
      formattedNumber = (randomNumber / 1000000).toFixed(1);
      formattedNumber = formattedNumber.endsWith(".0")
        ? Math.floor(randomNumber / 1000000) + "M"
        : formattedNumber.replace(".", ",") + "M";
    } else {
      formattedNumber = (randomNumber / 1000).toFixed(1);
      formattedNumber = formattedNumber.endsWith(".0")
        ? Math.floor(randomNumber / 1000) + "K"
        : formattedNumber.replace(".", ",") + "K";
    }

    if (reviewElement) {
      reviewElement.textContent = `${formattedNumber} review`;
    }
  }

  addBuyButtonHandlers() {
    const buyBtn = document.querySelectorAll(".card-book-info__btn");

    buyBtn.forEach((button, index) => {
      if (!button.dataset.handlerAdded) {
        const booksInCart = Storage.getBooksFromLocalStorage();
        const bookInCart = booksInCart.find(
          (book) => book.id === this.booksData[index].id
        );

        if (bookInCart) {
          button.textContent = "IN THE CART";
          button.classList.add("card-book-info__btn_active");
          this.itemAddedStates[index] = true;
        }

        button.addEventListener("click", () => {
          const bookData = {
            id: this.booksData[index].id,
            title: this.booksData[index].volumeInfo.title,
            authors: this.booksData[index].volumeInfo.authors || [],
            image:
              this.booksData[index].volumeInfo.imageLinks?.thumbnail || noImage,
            description:
              this.booksData[index].volumeInfo.description ||
              "Description not found",
            price: this.booksData[index].saleInfo.retailPrice
              ? `${this.booksData[index].saleInfo.retailPrice.currencyCode} ${this.booksData[index].saleInfo.retailPrice.amount}`
              : "Price not found",
            category: this.activeCategory,
          };

          const booksInCart = Storage.getBooksFromLocalStorage();
          const indexInCart = booksInCart.findIndex(
            (book) => book.id === bookData.id
          );

          if (indexInCart === -1) {
            booksInCart.push(bookData);
            button.textContent = "IN THE CART";
            button.classList.add("card-book-info__btn_active");
            this.itemAddedStates[index] = true;
          } else {
            booksInCart.splice(indexInCart, 1);
            button.textContent = "BUY NOW";
            button.classList.remove("card-book-info__btn_active");
            this.itemAddedStates[index] = false;
          }

          Storage.updateLocalStorage(booksInCart);
          this.updateCartCount();
        });

        button.dataset.handlerAdded = true;
      }
    });
  }

  updateCartCount() {
    const booksInCart = Storage.getBooksFromLocalStorage();
    const totalItemsCount = booksInCart.length;
    const cartCount = document.querySelector(".cart-count");

    cartCount.style.display = totalItemsCount > 0 ? "block" : "none";
    cartCount.textContent = totalItemsCount;
  }

  createBookCard(item, index) {
    const author = item.volumeInfo.authors
      ? item.volumeInfo.authors.join(", ")
      : "Author not found";
    const title = item.volumeInfo.title || "Title not found";
    const description = item.volumeInfo.description || "Description not found";
    const image = item.volumeInfo.imageLinks?.thumbnail
      ? item.volumeInfo.imageLinks.thumbnail.replace("http://", "https://")
      : noImage;
    const priceInfo = item.saleInfo.retailPrice;
    const price = priceInfo
      ? `${priceInfo.currencyCode} ${priceInfo.amount}`
      : "Price not found";

    return `
      <div class="card-book">
        <div class="card-book-img">
          <img src="${noImage}" alt="${
      image === noImage ? "no-img" : "book-img"
    }" data-src="${image}" onload="this.src = this.getAttribute('data-src')" onerror="this.src='${noImage}'">
        </div>
        <div class="card-book-info">
          <p class="card-book-info__author">${author}</p>
          <h3 class="card-book-info__title">${title}</h3>
          <span class="card-book-info__reviews">
            <svg width="0" height="0" xmlns="http://www.w3.org/2000/svg">
              <symbol xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" id="star">
                <path d="M31.547 12a.848.848 0 00-.677-.577l-9.427-1.376-4.224-8.532a.847.847 0 00-1.516 0l-4.218 8.534-9.427 1.355a.847.847 0 00-.467 1.467l6.823 6.664-1.612 9.375a.847.847 0 001.23.893l8.428-4.434 8.432 4.432a.847.847 0 001.229-.894l-1.615-9.373 6.822-6.665a.845.845 0 00.214-.869z"/>
              </symbol>
            </svg>
            <svg class="c-icon" width="12" height="12"><use xlink:href="#star"></use></svg>
            <svg class="c-icon" width="12" height="12"><use xlink:href="#star"></use></svg>
            <svg class="c-icon" width="12" height="12"><use xlink:href="#star"></use></svg>
            <svg class="c-icon" width="12" height="12"><use xlink:href="#star"></use></svg>
            <svg class="c-icon" width="12" height="12"><use xlink:href="#star"></use></svg>
            <p class="card-book-info__reviews-count"></p>
          </span>
          <p class="card-book-info__description">${description}</p>
          <p class="card-book-info__price">${price}</p>
          <button class="card-book-info__btn">BUY NOW</button>
        </div>
      </div>
    `;
  }

  addLoadMoreHandler() {
    this.loadMoreBtn.addEventListener("click", async () => {
      this.startIndex += 10; // Увеличиваем индекс для подгрузки следующих книг
      const newBooks = await this.fetchBooksByCategory(); // Загружаем следующие книги
      this.displayBooks();
    });
  }

  async loadInitialBooks() {
    this.restoreActiveCategory();
    await this.fetchBooksByCategory();
    this.displayBooks();
    this.addLoadMoreHandler();
    this.updateCartCount();
  }
}
