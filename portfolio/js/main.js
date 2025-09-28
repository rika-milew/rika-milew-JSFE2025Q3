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



