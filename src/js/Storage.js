export class Storage {
  static getBooksFromLocalStorage() {
    const books = localStorage.getItem("booksInCart");
    return books ? JSON.parse(books) : [];
  }

  static updateLocalStorage(books) {
    localStorage.setItem("booksInCart", JSON.stringify(books));
  }

  static getActiveCategory() {
    return localStorage.getItem("activeCategory") || "Architecture";
  }

  static saveActiveCategory(category) {
    localStorage.setItem("activeCategory", category);
  }
}
