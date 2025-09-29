// slider

const slider = document.querySelector('.portfolio__slider-wrapper'); 
const sliderContainer = document.querySelector('.portfolio__slider'); 


let sliderShift = 0; 
let sliderStep = 0; 
let sliderSpeed = 8; 

function centerSlider() { 
  const sliderWidth = slider.scrollWidth; 
  const containerWidth = sliderContainer.getBoundingClientRect().width; 

  sliderShift = (containerWidth - sliderWidth) / 2;
  slider.style.transform = `translateX(${sliderShift}px)`;
}

  
function startSlider() { 
  if (sliderStep !== 0) { 
    sliderShift += sliderStep * sliderSpeed; 
    const sliderWidth = slider.scrollWidth; 
    const containerWidth = sliderContainer.getBoundingClientRect().width; 
    const minSliderShift = containerWidth - sliderWidth; 
    const maxSliderShift = 0; 
      
    if (sliderShift > maxSliderShift) sliderShift = maxSliderShift; 
    if (sliderShift < minSliderShift) sliderShift = minSliderShift; 
      
    slider.style.transform = `translateX(${sliderShift}px)`; 
  } 
  requestAnimationFrame(startSlider); 
} 
   

document.querySelector('.hover-left').addEventListener('mouseenter', () => sliderStep = +1); 
document.querySelector('.hover-left').addEventListener('mouseleave', () => sliderStep = 0); 
document.querySelector('.hover-right').addEventListener('mouseenter', () => sliderStep = -1); 
document.querySelector('.hover-right').addEventListener('mouseleave', () => sliderStep = 0); 
      
      
window.addEventListener('load', () => { 
  centerSlider(); 
  startSlider(); 
}); 
window.addEventListener('resize', centerSlider);


// mobile slider

const minSwipe = 10;
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (isTouchDevice) {
  let startX = 0;
  let currentShift = 0;
  let isSwiping = false;

  slider.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    currentShift = sliderShift;
    isSwiping = false;  
  }, { passive: true });

  slider.addEventListener('touchmove', (e) => {
    const deltaX = e.touches[0].clientX - startX;

    if (!isSwiping && Math.abs(deltaX) < minSwipe) return;
    
    isSwiping = true;
    e.preventDefault();

    sliderShift = currentShift + deltaX;

    const sliderWidth = slider.scrollWidth;
    const containerWidth = sliderContainer.getBoundingClientRect().width;
    const minSliderShift = containerWidth - sliderWidth;
    const maxSliderShift = 0;

    if (sliderShift > maxSliderShift) sliderShift = maxSliderShift;
    if (sliderShift < minSliderShift) sliderShift = minSliderShift;

    slider.style.transform = `translateX(${sliderShift}px)`;
  }, { passive: false });

  slider.addEventListener('touchend', () => {
    isSwiping = false;
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


// faq

const questions = document.querySelectorAll('.faq__question');
const answers = document.querySelectorAll('.faq__answer');


function showAnswer(index) {
  questions.forEach((question, i) => {
    const answer = question.querySelector('.faq__answer');
    if (i === index) {
      question.classList.add('shown');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    } else {
      question.classList.remove('shown');
      answer.style.maxHeight = 0;
    }
  });
  localStorage.setItem('openedAnswer', index);
}
  
questions.forEach((question, i) => {
  const faqQuestion = question.querySelector('.faq__question-block');
  faqQuestion.addEventListener('click', () => {
    const answer = question.querySelector('.faq__answer');
    if (question.classList.contains('shown')) {
      question.classList.remove('shown');
      answer.style.maxHeight = 0;
      localStorage.removeItem('openedAnswer');
    } else {
      showAnswer(i);
    }
  });
});

const savedFaq = localStorage.getItem('openedAnswer');

if (savedFaq !== null) {
  showAnswer(Number(savedFaq));
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