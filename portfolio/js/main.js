// slider

const slider = document.querySelector('.portfolio__slider-wrapper'); 
const sliderContainer = document.querySelector('.portfolio__slider'); 

let sliderShift = 0; 
let sliderStep = 0; 
let sliderSpeed = 5;
let maxSliderShift = 0;
let minSliderShift = 0;

const basicPadding = 20;

function setSlider() {
  const sliderWidth = slider.scrollWidth;
  const containerWidth = sliderContainer.getBoundingClientRect().width;
  
  sliderShift = (containerWidth - sliderWidth) / 2;
  slider.style.transform = `translateX(${sliderShift}px)`;

  if (sliderWidth <= containerWidth) {
    sliderStep = 0;
    slider.classList.add('disabled-slider');
    slider.style.justifyContent = 'center'; 
    document.querySelector('.hover-left').style.pointerEvents = 'none';
    document.querySelector('.hover-right').style.pointerEvents = 'none';
  } else {
    slider.classList.remove('disabled-slider');
    slider.style.justifyContent = 'flex-start'; 
    document.querySelector('.hover-left').style.pointerEvents = 'auto';
    document.querySelector('.hover-right').style.pointerEvents = 'auto';

    const contentContainer = document.querySelector('.container');
    const contentContainerWidth = contentContainer.getBoundingClientRect();
    const leftSliderPadding = contentContainerWidth.left;
    const rightSliderPadding = document.documentElement.clientWidth - contentContainerWidth.right;

    maxSliderShift = leftSliderPadding;                       
    minSliderShift = containerWidth - sliderWidth - rightSliderPadding; 
  }
}

function startSlider() { 
  if (sliderStep !== 0) { 
    sliderShift += sliderStep * sliderSpeed; 
      
    if (sliderShift > maxSliderShift) {
      sliderShift = maxSliderShift; 
    }
    if (sliderShift < minSliderShift) {
      sliderShift = minSliderShift; 
    }
      
    slider.style.transform = `translateX(${sliderShift}px)`; 
  } 
  requestAnimationFrame(startSlider); 
} 
   
document.querySelector('.hover-left').addEventListener('mouseenter', () => sliderStep = +1); 
document.querySelector('.hover-left').addEventListener('mouseleave', () => sliderStep = 0); 
document.querySelector('.hover-right').addEventListener('mouseenter', () => sliderStep = -1); 
document.querySelector('.hover-right').addEventListener('mouseleave', () => sliderStep = 0); 
        
window.addEventListener('load', () => {
  setSlider();
  startSlider();
});

window.addEventListener('resize', setSlider);


// mobile slider

let isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
const minSwipeDistance = 5;

if (isTouchDevice) {
  const leftArrow = document.querySelector('.hover-left');
  const rightArrow = document.querySelector('.hover-right');

  leftArrow.style.display = 'none';
  rightArrow.style.display = 'none';

  leftArrow.style.pointerEvents = 'none';
  rightArrow.style.pointerEvents = 'none'; 

  let startX = 0;
  let startY = 0;
  let currentShift = 0;
  let mobileSliderSpeed = 0;
  let lastSwipe = 0;
  let lastSwipeTime = 0;
  let isSwiping = false;
  let horizontalSwiping = false;
  
  sliderContainer.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) return;
    if (slider.classList.contains('disabled-slider')) return;
    slider.style.transition = "none"; 
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    currentShift = sliderShift;
    lastSwipe = startX;
    lastSwipeTime = Date.now();
    isSwiping = false;  
    horizontalSwiping = false;
  }, { passive: false});

  sliderContainer.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) return;
    if (slider.classList.contains('disabled-slider')) return; 
    const touch = e.touches[0];
    const deltaX = e.touches[0].clientX - startX;
    const deltaY = e.touches[0].clientY - startY;

    if (!isSwiping) {
    if (Math.abs(deltaX) > minSwipeDistance || Math.abs(deltaY) > minSwipeDistance) {
      isSwiping = true;
      horizontalSwiping = Math.abs(deltaX) > Math.abs(deltaY);
    } else { 
      return; 
    }
  }

    if (!horizontalSwiping) {
      return;
    }

    e.preventDefault();

    const swipeDistance = touch.clientX - lastSwipe;
    const swipeDuration = Date.now() - lastSwipeTime;
    mobileSliderSpeed = swipeDistance / swipeDuration; 
    lastSwipe = touch.clientX;
    lastSwipeTime = Date.now();

    sliderShift = currentShift + deltaX;

    const sliderWidth = slider.scrollWidth;
    const containerWidth = sliderContainer.getBoundingClientRect().width;
    const minSliderShift = containerWidth - sliderWidth;
    const maxSliderShift = 0;

    if (sliderShift > maxSliderShift) sliderShift = maxSliderShift;
    if (sliderShift < minSliderShift) sliderShift = minSliderShift;

    slider.style.transform = `translateX(${sliderShift}px)`;
  }, { passive: false });

  sliderContainer.addEventListener('touchend', (e) => {
    if (e.touches.length > 0) return; 
    if (!horizontalSwiping) { 
      return;
    }
    
    let slideMomentum = mobileSliderSpeed * 220;
    sliderShift += slideMomentum;

    const sliderWidth = slider.scrollWidth;
    const containerWidth = sliderContainer.getBoundingClientRect().width;
    const minSliderShift = containerWidth - sliderWidth;
    const maxSliderShift = 0;

    if (sliderShift > maxSliderShift) {
     sliderShift = maxSliderShift;
      slider.style.transition = "transform 0.5s cubic-bezier(0.2, 1.5, 0.4, 1)";
    } else if (sliderShift < minSliderShift) {
      sliderShift = minSliderShift;
      slider.style.transition = "transform 0.5s cubic-bezier(0.2, 1.5, 0.4, 1)";
    } else {
      slider.style.transition = "transform 0.3s ease-out";
    }
    
    isSwiping = false;
    horizontalSwiping = false;

    slider.style.transform = `translateX(${sliderShift}px)`; 
  }, { passive: true });
}


// burger menu

const burger = document.querySelector('.menu__burger');
const menuList = document.querySelector('.menu__list');
const menuLinks = document.querySelectorAll('.menu__link')
const body = document.body;

burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  menuList.classList.toggle('active');
  body.classList.toggle('no-scroll');
});

document.querySelectorAll('.menu__link').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');

    if (href && href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.slice(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }

    burger.classList.remove('active');
    menuList.classList.remove('active');
    body.classList.remove('no-scroll');
  });
});

function setMenu() {
  if (window.innerWidth > 768 && burger.classList.contains('active')) {
    burger.classList.remove('active');
    menuList.classList.remove('active');
    body.classList.remove('no-scroll');
  }
}

window.addEventListener('resize', setMenu);


// faq

const questions = document.querySelectorAll('.faq__question');
const answers = document.querySelectorAll('.faq__answer');
const plusIcon = `<svg class="faq__svg" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 4.25C12.4142 4.25 12.75 4.58579 12.75 5V11.25H19C19.4142 11.25 19.75 11.5858 19.75 12C19.75 12.4142 19.4142 12.75 19 12.75H12.75V19C12.75 19.4142 12.4142 19.75 12 19.75C11.5858 19.75 11.25 19.4142 11.25 19V12.75H5C4.58579 12.75 4.25 12.4142 4.25 12C4.25 11.5858 4.58579 11.25 5 11.25H11.25V5C11.25 4.58579 11.5858 4.25 12 4.25Z" fill="white"/>
</svg>`;
const minusIcon = `<svg class="faq__svg" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M19 11.25C19.4142 11.25 19.75 11.5858 19.75 12C19.75 12.4142 19.4142 12.75 19 12.75H5C4.58579 12.75 4.25 12.4142 4.25 12C4.25 11.5858 4.58579 11.25 5 11.25H19Z" fill="white"/>
</svg>`;

function showAnswer(index) {
  questions.forEach((question, i) => {
    const answer = question.querySelector('.faq__answer');
    const icon = question.querySelector('.faq__icon');
    if (i === index) {
      question.classList.add('shown');
      answer.style.maxHeight = answer.scrollHeight + 'px';
      icon.innerHTML = minusIcon;
    } else {
      question.classList.remove('shown');
      answer.style.maxHeight = 0;
      icon.innerHTML = plusIcon;
    }
  });
  sessionStorage.setItem('openedAnswer', index);
}

function closeFaqs() {
  questions.forEach((question) => {
    const answer = question.querySelector('.faq__answer');
    const icon = question.querySelector('.faq__icon');
    question.classList.remove('shown');
    answer.style.maxHeight = 0;
    icon.innerHTML = plusIcon;
  });
  sessionStorage.setItem('openedAnswer', '-1');
}
  
questions.forEach((question, i) => {
  const faqQuestion = question.querySelector('.faq__question-block');
  faqQuestion.addEventListener('click', () => {
    const answer = question.querySelector('.faq__answer');
    const icon = question.querySelector('.faq__icon');
    if (question.classList.contains('shown')) {
      closeFaqs();
    } else {
      showAnswer(i);
    }
  });
});

const savedFaq = sessionStorage.getItem('openedAnswer');

if (savedFaq !== null) {
  const savedIndex = parseInt(savedFaq);
  if (savedIndex === -1) {
    closeAllAnswers();
  } else if (savedIndex >= 0) {
    showAnswer(savedIndex);
  } else {
    showAnswer(0);
  }
} else {
  showAnswer(0);
}


// scroll button

const scrollButton = document.getElementById('scrollButton');
const aboutMeSection = document.getElementById('about-me');

scrollButton.addEventListener('click', () => {
  aboutMeSection.scrollIntoView({ behavior: 'smooth' });
});


// modal

let modalSection = document.getElementById("modalSection");
let modalWindow = document.getElementById("giftModalWindow");
let closeButton = document.getElementById("closeButton");

function openModal() {
  modalSection.classList.add("open");
  document.body.style.overflow = "hidden"; 
}

function closeModal() {
  modalSection.classList.remove("open");
  document.body.style.overflow = ""; 
}

closeButton.addEventListener("click", closeModal);
modalSection.addEventListener("click", (e) => {
  if (e.target === modalSection) {
    closeModal();
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const priceButtons = document.querySelectorAll('.price-card__button');
  
  priceButtons.forEach(button => {
    button.addEventListener("click", () => {
      openModal();
    });
  });
});
