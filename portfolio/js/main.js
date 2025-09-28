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
