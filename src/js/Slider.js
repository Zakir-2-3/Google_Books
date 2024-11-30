import sliderImgOne from "../images/slider-img-1.jpg";
import sliderImgTwo from "../images/slider-img-2.jpg";
import sliderImgThree from "../images/slider-img-3.jpg";

export class Slider {
  constructor(sliderImgs, sliderToggleButtons) {
    this.sliderImgs = sliderImgs;
    this.sliderToggleButtons = sliderToggleButtons;
    this.currentSlide = 0;
    this.slideInterval = null;
    this.sliderImages = [
      { icon: sliderImgOne, alt: "slider-img-1" },
      { icon: sliderImgTwo, alt: "slider-img-2" },
      { icon: sliderImgThree, alt: "slider-img-3" },
    ];
  }

  startSlider() {
    // Если интервал уже существует, очистить его перед установкой нового
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }

    this.slideInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.sliderImgs.length;
      this.showSlide(this.currentSlide);
    }, 5000);
  }

  stopSlider() {
    // Очистить интервал при уничтожении слайдера или когда он больше не нужен
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = null;
    }
  }

  showSlide(index) {
    this.sliderImgs.forEach((slide, i) =>
      slide.classList.toggle("slider-container-img--active", i === index)
    );
    this.sliderToggleButtons.forEach((button, i) =>
      button.classList.toggle("slider-btn-dot--active", i === index)
    );
  }

  handleSliderButtons() {
    // Очищаем все обработчики событий перед добавлением новых
    this.sliderToggleButtons.forEach((button) => {
      button.removeEventListener("click", this.buttonClickHandler); // Удаление предыдущих обработчиков
    });

    this.sliderToggleButtons.forEach((button, index) => {
      const buttonClickHandler = () => {
        this.stopSlider(); // Останавливаем слайдер
        this.currentSlide = index;
        this.showSlide(this.currentSlide);
        this.startSlider();
      };

      button.addEventListener("click", buttonClickHandler);
    });
  }

  init() {
    this.sliderImgs.forEach((container, index) => {
      const { icon, alt } = this.sliderImages[index];
      const img = document.createElement("img");
      img.src = icon;
      img.alt = alt;
      container.appendChild(img);
    });

    this.showSlide(this.currentSlide);
    this.startSlider();
    this.handleSliderButtons();
  }

  destroy() {
    this.stopSlider(); // Останавливаем слайдер при уничтожении
    this.sliderToggleButtons.forEach((button) => {
      button.removeEventListener("click", this.buttonClickHandler); // Удаляем все обработчики
    });
  }
}
