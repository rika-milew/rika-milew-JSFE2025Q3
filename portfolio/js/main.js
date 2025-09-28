// slider

const slider = document.querySelector('.portfolio__slider-wrapper');
const sliderContainer = document.querySelector('.portfolio__slider');

let sliderShift = 0;       
let sliderStep = 0;       
let sliderSpeed = 4;     

function moveSlider() {
if (sliderStep !== 0) {
    sliderShift += sliderStep * sliderSpeed;

    const trackWidth = slider.scrollWidth;
    const viewWidth  = sliderContainer.clientWidth;

    const minShift = viewWidth - trackWidth; 
    const maxShift = 0;

    if (sliderShift > maxShift) sliderShift = maxShift;
    if (sliderShift < minShift) sliderShift = minShift;

    slider.style.transform = `translateX(${sliderShift}px)`;
  }
  requestAnimationFrame(moveSlider);

   
}

moveSlider();

document.querySelector('.hover-left').addEventListener('mouseenter', () => sliderStep = +1); 
document.querySelector('.hover-left').addEventListener('mouseleave', () => sliderStep = 0);
document.querySelector('.hover-right').addEventListener('mouseenter', () => sliderStep = -1);
document.querySelector('.hover-right').addEventListener('mouseleave', () => sliderStep = 0);
