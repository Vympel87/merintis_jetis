// ====== Swiper Initialization ======
    const swiper = new Swiper('.swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
      speed: 600,
      breakpoints: {
        768: {
          slidesPerView: 2
        }
      }
    });