true              &&(function polyfill() {
	const relList = document.createElement("link").relList;
	if (relList && relList.supports && relList.supports("modulepreload")) return;
	for (const link of document.querySelectorAll("link[rel=\"modulepreload\"]")) processPreload(link);
	new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type !== "childList") continue;
			for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
		}
	}).observe(document, {
		childList: true,
		subtree: true
	});
	function getFetchOpts(link) {
		const fetchOpts = {};
		if (link.integrity) fetchOpts.integrity = link.integrity;
		if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
		if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
		else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
		else fetchOpts.credentials = "same-origin";
		return fetchOpts;
	}
	function processPreload(link) {
		if (link.ep) return;
		link.ep = true;
		const fetchOpts = getFetchOpts(link);
		fetch(link.href, fetchOpts);
	}
}());

const createElement = ({
  tag,
  className,
  textContent,
  attributes
}) => {
  const element = document.createElement(tag);
  if (className) {
    element.className = className.join(" ");
  }
  if (textContent) {
    element.textContent = textContent;
  }
  if (attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }
  return element;
};

function createPopup(options) {
  const {
    overlayClass,
    containerClass,
    headingContent,
    imageSrc,
    imageAlt,
    animationDuration,
    messageContent
  } = options;
  const overlay = createElement({ tag: "div", className: [overlayClass] });
  const container = createElement({ tag: "div", className: [containerClass] });
  const heading = createElement({ tag: "h2", textContent: headingContent });
  const content = createElement({ tag: "p" });
  const image = createElement({
    tag: "img",
    attributes: { src: imageSrc, alt: imageAlt, width: "100", height: "100" }
  });
  container.append(heading, content, image);
  overlay.append(container);
  document.body.append(overlay);
  let timeout;
  function show(message) {
    if (!document.body.contains(overlay)) {
      document.body.append(overlay);
    }
    if (timeout) {
      clearTimeout(timeout);
    }
    content.textContent = messageContent ? messageContent(message) : message;
    const scrollTop = window.scrollY || window.pageYOffset;
    const viewportHeight = window.innerHeight;
    container.style.top = `${scrollTop + viewportHeight / 2}px`;
    requestAnimationFrame(() => {
      overlay.classList.add("visible");
    });
    timeout = setTimeout(() => {
      overlay.classList.remove("visible");
      content.textContent = "";
      timeout = void 0;
    }, animationDuration);
  }
  return { show };
}

const errorPopup = createPopup({
  overlayClass: "error-overlay",
  containerClass: "error",
  headingContent: "Error",
  imageSrc: "/error-icon.svg",
  imageAlt: "Error Icon",
  animationDuration: 2e3
});

const POPUP_MESSAGES = {
  carCreateFailed: (id, name) => id ? `Failed to create a new ${name ? ` (${name})` : ""} car.` : "Failed to create a new car",
  carUpdateFailed: () => "Failed to update the chosen car — try again.",
  carDeleteFailed: (id, name) => id ? `Failed to delete the ${name ? ` (${name})` : ""} car with ID ${id}.` : "Failed to delete the chosen car",
  appLoadFailed: () => "Failed to load the app",
  viewChangeFailed: () => "Failed to change the view",
  navigationFailed: () => "Failed to navigate to the selected view",
  garageLoadFailed: () => "Failed to load the garage",
  winnersLoadFailed: () => "Failed to load the winners",
  winnerCreateFailed: (name) => name ? `Failed to create winner ${name}.` : "Failed to create winner",
  winnerUpdateFailed: (name) => name ? `Failed to create winner ${name}.` : "Failed to create winner",
  randomCarsFailed: () => "Failed to create 100 random cars",
  carResetFailed: (id, name) => id ? `Failed to reset the ${name ? ` (${name})` : ""} car with ID ${id}.` : "Failed to reset the chosen car",
  carStartFailed: (id, name) => id ? `Failed to start the ${name ? ` (${name})` : ""} car with ID ${id}.` : "Failed to start the chosen car",
  carDriveFailed: (id, name) => id ? `The ${name ? ` (${name})` : ""} car (ID ${id}) has been stopped suddenly. It's engine was broken down.` : "Car with has been stopped suddenly. It's engine was broken down.",
  generalError: "Something went wrong"
};

const appState = {
  view: "garage",
  garagePage: 1,
  winnersPage: 1,
  perPage: 7,
  winnersPerPage: 10,
  garage: [],
  winners: [],
  winnersSort: {
    sorting: "wins",
    order: "descending"
  },
  createForm: {
    name: "",
    color: "#000000"
  },
  updateForm: {
    id: void 0,
    name: "",
    color: "#000000",
    isDisabled: true
  }
};

function createEventState() {
  const subscribers = {};
  return {
    on(event, handler) {
      subscribers[event] = subscribers[event] ?? [];
      subscribers[event].push(handler);
    },
    emit(event, payload) {
      const handlers = subscribers[event];
      if (handlers) {
        handlers.forEach((handler) => {
          handler(payload);
        });
      }
    },
    off(event, handler) {
      const handlers = subscribers[event];
      if (!handlers) {
        return;
      }
      if (!handler) {
        handlers.length = 0;
        return;
      }
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  };
}
const eventState = createEventState();

const carState = {
  cars: [],
  totalCount: 0,
  winner: void 0,
  isRacing: false,
  garageSessionId: 0,
  set(cars, totalCount) {
    this.cars = cars.map((car) => ({
      ...car,
      currentPosition: 0,
      isDriving: false,
      trackDistance: 0
    }));
    if (totalCount !== void 0) {
      this.totalCount = totalCount;
    }
  },
  add(car) {
    this.cars.push({
      ...car,
      currentPosition: 0,
      isDriving: false,
      trackDistance: 0
    });
    this.totalCount += 1;
  },
  update(updatedCar) {
    const index = this.cars.findIndex((car) => car.id === updatedCar.id);
    if (index !== -1) {
      const saved = this.cars[index];
      this.cars[index] = {
        ...updatedCar,
        currentPosition: saved.currentPosition,
        isDriving: saved.isDriving,
        trackDistance: saved.trackDistance
      };
    }
  },
  remove(id) {
    this.cars = this.cars.filter((car) => car.id !== id);
    this.totalCount -= 1;
  },
  getById(id) {
    return this.cars.find((c) => c.id === id);
  },
  getAllOnCurrentPage() {
    const start = (appState.garagePage - 1) * appState.perPage;
    const end = start + appState.perPage;
    return this.cars.slice(start, end);
  }
};

const carStore = /* @__PURE__ */ new Map();
function addCarStore(carId, ui) {
  carStore.set(carId, ui);
}
function getCarStore(carId) {
  return carStore.get(carId);
}
function removeCarStore(carId) {
  carStore.delete(carId);
}
function setCarAnimationId(carId, animationId) {
  const car = carStore.get(carId);
  if (!car) {
    return;
  }
  car.animationId = animationId;
}

const audioPLayer = (() => {
  const sounds = {
    race: new Audio("/sounds/race.mp3"),
    brake: new Audio("/sounds/brake.mp3"),
    button: new Audio("/sounds/button.mp3")
  };
  sounds.race.loop = true;
  sounds.race.volume = 0.3;
  sounds.brake.volume = 0.3;
  sounds.button.volume = 0.5;
  const activeSounds = /* @__PURE__ */ new Set();
  const STORAGE_KEY = "audio";
  const saved = localStorage.getItem(STORAGE_KEY);
  let isMuted = saved ? saved === "true" : false;
  function updateMute() {
    Object.values(sounds).forEach((sound) => {
      sound.muted = isMuted;
    });
  }
  updateMute();
  function toggleMute() {
    isMuted = !isMuted;
    localStorage.setItem(STORAGE_KEY, isMuted.toString());
    updateMute();
  }
  function playSound(id) {
    if (isMuted) {
      return;
    }
    const sound = sounds[id];
    sound.currentTime = 0;
    void sound.play();
    activeSounds.add(id);
  }
  function stopSound(id) {
    const sound = sounds[id];
    sound.pause();
    sound.currentTime = 0;
    activeSounds.delete(id);
  }
  function stopAllSounds() {
    activeSounds.forEach((id) => {
      stopSound(id);
    });
  }
  function playOnce(id) {
    if (isMuted) {
      return;
    }
    const sound = sounds[id];
    sound.currentTime = 0;
    void sound.play();
  }
  function playRaceLoop() {
    if (isMuted) {
      return;
    }
    const raceSound = sounds.race;
    if (!raceSound.paused) {
      return;
    }
    raceSound.currentTime = 0;
    void raceSound.play();
    activeSounds.add("race");
  }
  function stopRaceLoop() {
    stopSound("race");
  }
  return {
    playSound,
    stopSound,
    stopAllSounds,
    toggleMute,
    get isMuted() {
      return isMuted;
    },
    playOnce,
    playRaceLoop,
    stopRaceLoop
  };
})();

function updateRaceSound() {
  const anyDriving = carState.cars.some((car) => car.isDriving);
  if (anyDriving) {
    audioPLayer.playRaceLoop();
  } else {
    audioPLayer.stopRaceLoop();
  }
}

const engineButtons = {};

function setEngineButtons(carId, startEnabled, stopEnabled) {
  const buttons = engineButtons[carId];
  buttons.startButton.disabled = !startEnabled;
  buttons.resetButton.disabled = !stopEnabled;
}

const garageButtons = {};
function setGarageButtons(raceEnabled, resetEnabled, generateEnabled) {
  if (garageButtons.race) {
    garageButtons.race.disabled = !raceEnabled;
  }
  if (garageButtons.reset) {
    garageButtons.reset.disabled = false;
  }
  if (garageButtons.generate) {
    garageButtons.generate.disabled = !generateEnabled;
  }
}
function setRaceButton() {
  if (!garageButtons.race) {
    return;
  }
  const hasDrivingCars = carState.cars.some((car) => car.isDriving);
  garageButtons.race.disabled = hasDrivingCars;
}

function stopCarAnimation(carId) {
  const car = carState.getById(carId);
  if (!car) {
    return;
  }
  const carElement = getCarStore(carId);
  if (carElement?.animationId !== void 0) {
    cancelAnimationFrame(carElement.animationId);
    carElement.animationId = void 0;
  }
  car.isDriving = false;
  setRaceButton();
  updateRaceSound();
  if (carElement) {
    carElement.trackLine.classList.remove("blink");
    if (!carState.isRacing) {
      setEngineButtons(carId, false, true);
    }
  }
}

function resetCarPosition(carId) {
  const carElement = getCarStore(carId);
  const car = carState.getById(carId);
  if (!carElement || !car) {
    return;
  }
  if (carElement.animationId !== void 0) {
    cancelAnimationFrame(carElement.animationId);
    carElement.animationId = void 0;
  }
  car.currentPosition = 0;
  car.isDriving = false;
  setRaceButton();
  updateRaceSound();
  carElement.svg.style.transform = "translateX(0)";
  carElement.track.classList.remove("blink");
  setEngineButtons(carId, true, false);
}
function resetAllCarsPositions() {
  setGarageButtons(true, true, true);
  carState.isRacing = false;
  carState.winner = void 0;
  carState.garageSessionId += 1;
  carState.cars.forEach((car) => {
    stopCarAnimation(car.id);
    car.currentPosition = 0;
    car.isDriving = false;
    updateRaceSound();
    const carElement = getCarStore(car.id);
    if (carElement) {
      carElement.svg.style.transform = "translateX(0)";
      carElement.track.classList.remove("blink");
      setEngineButtons(car.id, true, false);
    }
    setRaceButton();
  });
}

function createFooter() {
  const footer = createElement({ tag: "footer", className: ["footer"] });
  const github = createElement({ tag: "div", className: ["footer__github"] });
  const year = createElement({
    tag: "span",
    className: ["footer__year"],
    textContent: `© ${(/* @__PURE__ */ new Date()).getFullYear()}`
  });
  const image = createElement({
    tag: "div",
    className: ["footer__image"]
  });
  const githubLink = createElement({
    tag: "a",
    className: ["footer__link"],
    textContent: "rika-milew",
    attributes: {
      href: "https://github.com/rika-milew",
      target: "_blank",
      rel: "noopener noreferrer"
    }
  });
  github.append(image, githubLink);
  footer.append(github, year);
  document.body.append(footer);
}

function createCarFormElements(isUpdate) {
  const carForm = createElement({ tag: "form", className: ["car-form"] });
  const nameInput = createElement({
    tag: "input",
    attributes: { placeholder: "Car Name", type: "text" }
  });
  const colorInput = createElement({
    tag: "input",
    attributes: { type: "color", value: "#000000" }
  });
  nameInput.id = "car-name";
  colorInput.id = "car-color";
  const button = createElement({
    tag: "button",
    textContent: isUpdate ? "Update" : "Create",
    attributes: { type: "submit" }
  });
  carForm.append(nameInput, colorInput, button);
  return {
    carForm,
    nameInput,
    colorInput,
    button
  };
}

function createFormState(isUpdate, nameInput, colorInput, button) {
  function syncDisabledState() {
    if (!isUpdate) {
      return;
    }
    nameInput.disabled = appState.updateForm.isDisabled;
    colorInput.disabled = appState.updateForm.isDisabled;
    button.disabled = appState.updateForm.isDisabled;
  }
  if (isUpdate) {
    nameInput.value = appState.updateForm.name;
    colorInput.value = appState.updateForm.color;
  } else {
    nameInput.value = appState.createForm.name;
    colorInput.value = appState.createForm.color;
  }
  return { syncDisabledState };
}

function initFormEvents(isUpdate, nameInput, colorInput, button) {
  nameInput.addEventListener("input", () => {
    if (isUpdate) {
      appState.updateForm.name = nameInput.value;
    } else {
      appState.createForm.name = nameInput.value;
    }
  });
  colorInput.addEventListener("input", () => {
    if (isUpdate) {
      appState.updateForm.color = colorInput.value;
    } else {
      appState.createForm.color = colorInput.value;
    }
  });
  const { syncDisabledState } = createFormState(isUpdate, nameInput, colorInput, button);
  syncDisabledState();
  return { syncDisabledState };
}

function updateFormEvents(nameInput, colorInput, syncDisabledState) {
  eventState.on("updateform:fill", (payload) => {
    if (!payload) {
      return;
    }
    appState.updateForm = {
      id: payload.id,
      name: payload.name,
      color: payload.color,
      isDisabled: false
    };
    nameInput.value = payload.name;
    colorInput.value = payload.color;
    syncDisabledState();
  });
  eventState.on("car:deleted", (deletedId) => {
    if (deletedId === void 0) {
      return;
    }
    if (appState.updateForm.id === deletedId) {
      eventState.emit("updateform:reset");
    }
  });
  eventState.on("updateform:reset", () => {
    appState.updateForm = {
      id: void 0,
      name: "",
      color: "#000000",
      isDisabled: true
    };
    nameInput.value = "";
    colorInput.value = "#000000";
    syncDisabledState();
  });
}

function createButton(config) {
  const { text, className = "", disabled = false, type = "button" } = config;
  const defaultClasses = ["button"];
  const allClasses = className ? [...defaultClasses, className].join(" ") : defaultClasses.join(" ");
  const button = createElement({
    tag: "button",
    className: [allClasses],
    textContent: text,
    attributes: {
      type,
      ...disabled && { disabled: "true" }
    }
  });
  button.addEventListener("click", () => {
    audioPLayer.playOnce("button");
  });
  return button;
}

function createEngineButtons(car) {
  const startButton = createButton({
    text: "Start",
    className: "animation-button start-button"
  });
  startButton.addEventListener("click", () => {
    eventState.emit("car:start", { id: car.id });
  });
  const resetButton = createButton({
    text: "Reset",
    className: "animation-button stop-button"
  });
  resetButton.addEventListener("click", () => {
    eventState.emit("car:reset", { id: car.id });
  });
  engineButtons[car.id] = { startButton, resetButton };
  setEngineButtons(car.id, true, false);
  const container = createElement({ tag: "div", className: ["animation-buttons"] });
  container.append(startButton, resetButton);
  return container;
}

const carLeftWheel = `
  M74.2897 18.4421C78.04 18.4421 81.0811 21.4823 81.0811 25.2335C81.0811 
  25.5227 81.0574 25.8074 81.021 26.0865C80.6 29.434 77.7508 32.0231 74.2906 
  32.0231C70.7367 32.0231 67.8229 29.2913 67.5274 25.8119C67.5119 25.6218 
  67.4992 25.4281 67.4992 25.2326C67.4983 21.4823 70.5384 18.4421 74.2897 
  18.4421ZM77.689 22.6745L76.3049 24.0595C76.4122 24.2441 76.4968 24.4433 
  76.5513 24.6561H78.5029C78.4029 23.9176 78.1201 23.2429 77.689 22.6745ZM78.512 
  25.8319H76.545C76.4895 26.0411 76.4077 26.2393 76.2985 26.4212L77.6863 27.808C78.1164 27.2442 
  78.4056 26.5694 78.512 25.8319ZM74.8771 29.4522C75.6128 29.3495 76.2813 29.0612 76.8469 
  28.6347L75.4664 27.2533C75.2846 27.3597 75.0854 27.4379 74.8771 27.4925V29.4522ZM74.8771 
  22.9746C75.0909 23.031 75.2909 23.1146 75.4773 23.2247L76.8605 21.8415C76.2922 21.4095 75.6174 21.124 
  74.8771 21.0212V22.9746ZM73.7013 21.0194C72.961 21.1221 72.2854 21.4095 71.7179 21.8406L73.1002 
  23.2238C73.2857 23.1137 73.4876 23.0301 73.7004 22.9737L73.7013 21.0194ZM73.7013 
  29.4504V27.4934C73.4921 27.4379 73.2948 27.3606 73.1129 27.2533L71.7315 28.6347C72.2972 
  29.0612 72.9665 29.3476 73.7013 29.4504ZM70.8894 27.8144L72.2817 26.4203C72.1726 26.2375 
  72.0844 26.042 72.0289 25.8328H70.0773C70.181 26.5676 70.4584 27.2478 70.8894 
  27.8144ZM72.0262 24.6561C72.0817 24.4433 72.1653 24.2441 72.2726 24.0595L70.8867 
  22.6745C70.4584 23.2429 70.1756 23.9176 70.0737 24.657H72.0262V24.6561Z
  `;
const carRightWheel = `
  M17.8991 18.4421C21.6494 18.4421 24.6904 21.4823 24.6904 25.2335C24.6904 25.5227 24.6668 
  25.8074 24.6304 26.0865C24.2094 29.434 21.3602 32.0231 17.9009 32.0231C14.3469 32.0231 
  11.4332 29.2913 11.1368 25.8119C11.1213 25.6218 11.1086 25.4281 11.1086 25.2326C11.1068 21.4823 
  14.1478 18.4421 17.8991 18.4421ZM21.2984 22.6745L19.9152 24.0595C20.0225 24.2441 20.1071 24.4433 
  20.1616 24.6561H22.1132C22.0123 23.9176 21.7294 23.2429 21.2984 22.6745ZM22.1205 
  25.8319H20.1534C20.098 26.0411 20.0161 26.2393 19.907 26.4212L21.2938 27.808C21.7258 
  27.2442 22.0159 26.5694 22.1205 25.8319ZM18.4865 29.4522C19.2222 29.3495 19.8906 
  29.0612 20.4563 28.6347L19.0758 27.2533C18.8939 27.3597 18.6948 27.4379 18.4865 
  27.4925V29.4522ZM18.4865 22.9746C18.7002 23.031 18.9003 23.1146 19.0867 23.2247L20.4699 
  21.8415C19.9015 21.4095 19.2277 21.124 18.4865 21.0212V22.9746ZM17.3098 21.0194C16.5695 21.1221 15.8938 
  21.4095 15.3264 21.8406L16.7096 23.2238C16.8951 23.1137 17.097 23.0282 17.3098 
  22.9737V21.0194ZM17.3098 29.4504V27.4934C17.1006 27.4379 16.9033 27.3606 16.7214 
  27.2533L15.34 28.6347C15.9056 29.0612 16.5759 29.3476 17.3098 29.4504ZM14.4988 
  27.8144L15.8911 26.4221C15.782 26.2384 15.6929 26.0438 15.6383 25.8337H13.6867C13.7904 
  26.5676 14.0668 27.2478 14.4988 27.8144ZM15.6356 24.6561C15.691 24.4433 15.7738 
  24.2441 15.882 24.0595L14.497 22.6745C14.0678 23.2429 13.7858 23.9176 13.6831 24.657H15.6356V24.6561Z
  `;
const carMain = `
  M1.59145 14.9265V9.90116C1.59145 9.09271 2.17892 8.40793 2.97737 8.28335C4.89347 7.98324 
  8.29008 7.41669 9.81605 6.94653C12.0041 6.27176 20.4578 2.69237 23.3852 2.02032C26.3134 
  1.34828 39.5161 -2.24021 52.1612 2.14309C54.3011 2.88425 63.927 7.4858 69.5871 9.87843C71.2541 
  9.9148 87.7533 13.3541 88.6317 15.7113C89.5102 18.0694 89.7858 19.2134 89.9476 19.8118C90.1095 
  20.4102 89.9476 23.2739 88.7218 25.2682C87.4723 25.9748 85.0669 26.4495 82.286 26.7678C82.3178 
  26.5977 82.3523 26.4304 82.3742 26.2585C82.4224 25.8911 82.4451 25.5555 82.4451 25.2354C82.4451 
  20.7385 78.7875 17.079 74.2896 17.079C69.7917 17.079 66.1341 20.7375 66.1341 25.2354C66.1341 
  25.4664 66.1496 25.6956 66.1669 25.9211C66.2096 26.4258 66.3006 26.916 66.4324 27.388C66.4261 
  27.388 66.4106 27.388 66.4106 27.388L25.9278 26.5732C25.946 26.4686 25.9697 26.3649 25.9833 
  26.2585C26.0315 25.8929 26.0543 25.5564 26.0543 25.2354C26.0543 20.7385 22.3967 17.08 
  17.8988 17.08C13.4009 17.08 9.74239 20.7375 9.74239 25.2354C9.74239 25.2527 9.7442 25.2673 
  9.74511 25.2836L9.57233 25.2691L2.6509 23.9659C2.6509 23.9659 2.90902e-06 22.5545 
  2.90902e-06 18.6714C-0.000906489 16.0814 1.59145 14.9265 1.59145 14.9265ZM41.7496 
  10.1622L56.8683 10.625C56.59 8.35974 57.9314 7.85138 57.9314 7.85138C51.9212 2.3959 
  39.808 2.21129 39.808 2.21129L41.7496 10.1622ZM24.782 9.47011L38.5594 9.93299L37.3108 
  2.2122C30.1902 2.11944 26.1225 3.69089 26.1225 3.69089L24.0881 6.97381L24.782 
  9.47011ZM17.0148 9.42282H20.8534L24.6911 4.15286C21.8119 5.2987 19.5075 6.42817 
  18.1352 7.14205C17.3022 7.57492 16.8475 8.49978 17.0148 9.42282Z
  `;

const API_URL = "http://127.0.0.1:3000";
const CARS_QUANTITY = 100;
const FINISH_OFFSET = 5;
const SPEED_MULTIPLIER = 450;
const WIDTH_DIVIDER = 2;
const MILLISECONDS = 1e3;
const GARAGE_CAR_WIDTH = 90;
const GARAGE_CAR_HEIGHT = 33;
const SCREEN_WIDTH_768 = 768;
const SCREEN_WIDTH_595 = 595;
const SCREEN_WIDTH_499 = 499;
const SORTING_ICONS = {
  ascending: "↑",
  descending: "↓",
  none: ""
};

function createCarImage(initialColor, width = GARAGE_CAR_WIDTH, height = GARAGE_CAR_HEIGHT) {
  const svgType = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgType, "svg");
  svg.setAttribute("width", String(width));
  svg.setAttribute("height", String(height));
  svg.setAttribute("viewBox", "0 0 90 33");
  svg.setAttribute("fill", initialColor);
  const rightWheel = document.createElementNS(svgType, "path");
  rightWheel.setAttribute("d", carRightWheel);
  rightWheel.setAttribute("fill", initialColor);
  const leftWheel = document.createElementNS(svgType, "path");
  leftWheel.setAttribute("d", carMain);
  leftWheel.setAttribute("fill", initialColor);
  const carBody = document.createElementNS(svgType, "path");
  carBody.setAttribute("d", carLeftWheel);
  carBody.setAttribute("fill", initialColor);
  svg.append(rightWheel, leftWheel, carBody);
  return {
    element: svg,
    setColor: (color) => {
      carBody.setAttribute("fill", color);
    }
  };
}

function createFlagImage() {
  return createElement({
    tag: "img",
    className: ["race__finish"],
    attributes: {
      src: "/finish.svg",
      alt: "Finish"
    }
  });
}

function createCarElement(car) {
  const carItem = createElement({ tag: "div", className: ["car"] });
  const carButtons = createCarButtons(car);
  const engineButtons = createEngineButtons(car);
  const { element: carSvg, setColor } = createCarImage(car.color);
  eventState.on("updateform:color", (payload) => {
    if (!payload) {
      return;
    }
    const { id, color } = payload;
    if (id === car.id) {
      setColor(color);
    }
  });
  const carTrack = createElement({
    tag: "div",
    className: ["car__track"]
  });
  const trackLine = createElement({
    tag: "div",
    className: ["car__track-line"]
  });
  const finishFlag = createFlagImage();
  addCarStore(car.id, {
    container: carItem,
    svg: carSvg,
    track: carTrack,
    trackLine,
    finish: finishFlag
  });
  carTrack.append(trackLine, carSvg, finishFlag);
  carItem.append(carButtons, engineButtons, carTrack);
  return carItem;
}
function createCarButtons(car) {
  const selectButton = createButton({
    text: "Select",
    className: "car-button"
  });
  const removeButton = createButton({
    text: "Remove",
    className: "car-button"
  });
  const carName = createElement({
    tag: "p",
    className: ["car__name"],
    textContent: car.name
  });
  selectButton.addEventListener("click", () => {
    eventState.emit("updateform:fill", { id: car.id, name: car.name, color: car.color });
  });
  removeButton.addEventListener("click", () => {
    eventState.emit("car:delete", { id: car.id });
  });
  const container = createElement({ tag: "div", className: ["car-buttons"] });
  container.append(selectButton, removeButton, carName);
  return container;
}

async function fetchData(url, options) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      return void 0;
    }
    const text = await response.text();
    const data = JSON.parse(text || "{}");
    return data;
  } catch (error) {
    console.error(`Error processing ${url}:`, error);
    return void 0;
  }
}

async function createCar(name, color) {
  const url = `${API_URL}/garage`;
  return fetchData(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, color })
  });
}

const carBrands = [
  {
    brand: "Toyota",
    models: [
      "Corolla",
      "Camry",
      "RAV4",
      "Prius",
      "Yaris",
      "Highlander",
      "Supra",
      "Land Cruiser",
      "C-HR",
      "Hilux"
    ]
  },
  {
    brand: "Ford",
    models: [
      "Focus",
      "Mustang",
      "Explorer",
      "F-150",
      "Fiesta",
      "Edge",
      "Escape",
      "Bronco",
      "Ranger",
      "Fusion"
    ]
  },
  {
    brand: "Renault",
    models: [
      "Clio",
      "Megane",
      "Captur",
      "Kadjar",
      "Duster",
      "Talisman",
      "Koleos",
      "Logan",
      "Sandero",
      "Fluence"
    ]
  },
  {
    brand: "Audi",
    models: ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q5"]
  },
  {
    brand: "Volkswagen",
    models: [
      "Golf",
      "Passat",
      "Polo",
      "Tiguan",
      "Touareg",
      "Arteon",
      "Sharan",
      "Jetta",
      "Beetle",
      "Touran"
    ]
  },
  {
    brand: "Chevrolet",
    models: [
      "Aveo",
      "Cruze",
      "Malibu",
      "Impala",
      "Camaro",
      "Corvette",
      "Equinox",
      "Tahoe",
      "Traverse",
      "Trailblazer"
    ]
  },
  {
    brand: "Lada",
    models: [
      "Granta",
      "Vesta",
      "Xray",
      "Largus",
      "Niva",
      "Kalina",
      "Priora",
      "2104",
      "2105",
      "2107"
    ]
  },
  {
    brand: "Subaru",
    models: [
      "Impreza",
      "Legacy",
      "Outback",
      "Forester",
      "XV",
      "BRZ",
      "WRX",
      "Levorg",
      "Ascent",
      "Crosstrek"
    ]
  },
  {
    brand: "Nissan",
    models: [
      "Micra",
      "Note",
      "Juke",
      "Qashqai",
      "X-Trail",
      "Leaf",
      "GT-R",
      "Pathfinder",
      "Altima",
      "Maxima"
    ]
  },
  {
    brand: "Geely",
    models: [
      "Coolray",
      "Atlas",
      "Emgrand",
      "Monjaro",
      "Tugella",
      "Okavango",
      "Vision",
      "E8",
      "Preface",
      "EX5"
    ]
  },
  {
    brand: "Kia",
    models: [
      "Rio",
      "Cerato",
      "Sportage",
      "Seltos",
      "Sorento",
      "Stinger",
      "Carnival",
      "K5",
      "Soul",
      "EV6"
    ]
  },
  {
    brand: "Tesla",
    models: [
      "Model S",
      "Model 3",
      "Model X",
      "Model Y",
      "Cybertruck",
      "Roadster",
      "Cybercab",
      "Model S Plaid",
      "Model 3 Performance",
      "Model X Plaid"
    ]
  },
  {
    brand: "Porsche",
    models: [
      "911",
      "Cayenne",
      "Macan",
      "Panamera",
      "Taycan",
      "Cayman",
      "Boxster",
      "GT3",
      "Cayenne Coupe",
      "Carrera"
    ]
  },
  {
    brand: "Opel",
    models: [
      "Corsa",
      "Astra",
      "Insignia",
      "Frontera",
      "Crossland",
      "Mokka",
      "Zafira",
      "Combo",
      "Vivaro",
      "Kadett"
    ]
  },
  {
    brand: "Lexus",
    models: ["IS", "ES", "GS", "LS", "NX", "RX", "UX", "LC", "LX", "GX"]
  },
  {
    brand: "Dodge",
    models: [
      "Challenger",
      "Charger",
      "Durango",
      "Journey",
      "Grand Caravan",
      "Ram 1500",
      "Viper",
      "Dakota",
      "Nitro",
      "Caliber"
    ]
  },
  {
    brand: "Volvo",
    models: ["XC40", "XC60", "XC90", "S60", "S90", "V40", "V60", "V90", "C40", "Polestar 2"]
  },
  {
    brand: "BMW",
    models: ["X1", "X2", "X3", "X4", "X5", "X6", "X7", "Z4", "i3", "i8"]
  },
  {
    brand: "Mercedes",
    models: [
      "S500",
      "S600",
      "300SL",
      "E200",
      "E350",
      "V140",
      "Maybach",
      "G500",
      "GLC300",
      "GLS580"
    ]
  },
  {
    brand: "Honda",
    models: [
      "Civic",
      "Accord",
      "CR-V",
      "HR-V",
      "Fit",
      "Pilot",
      "Ridgeline",
      "Insight",
      "Jazz",
      "Odyssey"
    ]
  }
];

function generateCarName() {
  const carBrand = carBrands[Math.floor(Math.random() * carBrands.length)];
  const model = carBrand.models[Math.floor(Math.random() * carBrand.models.length)];
  return `${carBrand.brand} ${model}`;
}

const MAX_COLOR = 16777215;
const HEX_RADIX = 16;
const HEX_LENGTH = 6;
function generateColor() {
  return `#${Math.floor(Math.random() * MAX_COLOR).toString(HEX_RADIX).padStart(HEX_LENGTH, "0")}`;
}

const CAR_QUANTITY = 100;
async function createRandomCars(quantity = CAR_QUANTITY) {
  const requests = [];
  const carNames = /* @__PURE__ */ new Set();
  for (let index = 0; index < quantity; index++) {
    let name;
    do {
      name = generateCarName();
    } while (carNames.has(name));
    carNames.add(name);
    const color = generateColor();
    requests.push(createCar(name, color));
  }
  const newCars = await Promise.all(requests);
  if (newCars.includes(void 0)) {
    errorPopup.show(POPUP_MESSAGES.randomCarsFailed());
  }
  return newCars.filter((car) => !!car);
}

const garageContainer = createElement({ tag: "div", className: ["garage-container"] });
const garageList = (() => {
  function render() {
    const start = (appState.garagePage - 1) * appState.perPage;
    const end = start + appState.perPage;
    const cars = carState.cars.slice(start, end);
    resetAllCarsPositions();
    garageContainer.replaceChildren();
    if (cars.length === 0) {
      renderEmpty();
      return;
    }
    cars.forEach((car) => {
      garageContainer.append(createCarElement(car));
    });
    eventState.emit("garage:pagination:update", {
      currentPage: appState.garagePage,
      totalCount: carState.totalCount
    });
  }
  function renderEmpty() {
    garageContainer.replaceChildren();
    const emptyGarage = createElement({
      tag: "p",
      className: ["garage-empty"],
      textContent: "Your garage is empty. Add a car to get started!"
    });
    garageContainer.append(emptyGarage);
    eventState.emit("garage:pagination:update", {
      currentPage: 1,
      totalCount: 0
    });
  }
  function setPage(page) {
    const maxPage = Math.ceil(carState.totalCount / appState.perPage);
    if (page < 1 || page > maxPage) {
      return;
    }
    appState.garagePage = page;
    render();
    eventState.emit("garage:pagination:update", {
      currentPage: appState.garagePage,
      totalCount: carState.totalCount
    });
  }
  eventState.on("garage:refresh", () => {
    render();
  });
  eventState.on("garage:generate", async (quantity) => {
    const newCars = await createRandomCars(quantity);
    newCars.forEach((car) => {
      carState.add(car);
    });
    eventState.emit("garage:refresh");
  });
  return { render, renderEmpty, setPage };
})();

function createCarForm({ isUpdate = false }) {
  const { carForm, nameInput, colorInput, button } = createCarFormElements(isUpdate);
  const { syncDisabledState } = initFormEvents(isUpdate, nameInput, colorInput, button);
  if (isUpdate) {
    updateFormEvents(nameInput, colorInput, syncDisabledState);
  }
  carForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!nameInput.value.trim()) {
      errorPopup.show("Please, enter car name");
      return;
    }
    if (isUpdate) {
      const id = appState.updateForm.id;
      if (!id) {
        return;
      }
      appState.updateForm.name = nameInput.value;
      appState.updateForm.color = colorInput.value;
      eventState.emit("car:update", {
        id,
        name: appState.updateForm.name,
        color: appState.updateForm.color
      });
      appState.updateForm = {
        id: void 0,
        name: "",
        color: "#000000",
        isDisabled: true
      };
      nameInput.value = "";
      colorInput.value = "#000000";
      garageList.render();
      appState.updateForm.isDisabled = true;
      syncDisabledState();
    } else {
      eventState.emit("car:create", {
        name: appState.createForm.name,
        color: appState.createForm.color
      });
      appState.createForm = {
        name: "",
        color: "#000000"
      };
      nameInput.value = "";
      colorInput.value = "#000000";
    }
  });
  return carForm;
}

async function changeEngineStatus(id, status) {
  const url = `${API_URL}/engine?id=${id}&status=${status}`;
  return fetchData(url, { method: "PATCH" });
}

function animateCar(carId, velocity, distance, onFinish) {
  const car = carState.getById(carId);
  if (!car) {
    return;
  }
  car.isDriving = true;
  updateRaceSound();
  const carElement = getCarStore(carId);
  if (!carElement) {
    return;
  }
  const { svg: carSvg, track, trackLine, finish } = carElement;
  const carWidth = carSvg.getBoundingClientRect().width;
  const distancePx = finish.getBoundingClientRect().left - track.getBoundingClientRect().left + carWidth / WIDTH_DIVIDER + FINISH_OFFSET;
  if (distancePx <= 0) {
    return;
  }
  const animationTime = distance / velocity;
  const raceTime = animationTime / SPEED_MULTIPLIER;
  const startTime = performance.now();
  trackLine.classList.add("blink");
  function startAnimation(time) {
    const passedTime = (time - startTime) / MILLISECONDS;
    const progress = Math.min(passedTime / raceTime, 1);
    carSvg.style.transform = `translateX(${distancePx * progress}px)`;
    if (passedTime / raceTime <= 1) {
      setCarAnimationId(carId, requestAnimationFrame(startAnimation));
    } else {
      stopCarAnimation(carId);
      if (onFinish) {
        onFinish(true, passedTime);
      }
    }
  }
  setCarAnimationId(carId, requestAnimationFrame(startAnimation));
}

const winnerPopup = createPopup({
  overlayClass: "winner-overlay",
  containerClass: "winner",
  headingContent: "🏁 Race Finished!",
  imageSrc: "/winner-cup.svg",
  imageAlt: "Winner Icon",
  animationDuration: 3500,
  messageContent: (name) => `The winner is ${name}!`
});

function resetCarState(carId) {
  const car = carState.getById(carId);
  if (!car) {
    return;
  }
  car.isDriving = false;
  setRaceButton();
  updateRaceSound();
  stopCarAnimation(carId);
  if (!carState.isRacing) {
    setEngineButtons(carId, false, true);
  }
}

function handleWinner(car, time) {
  eventState.emit("winner:add", {
    id: car.id,
    name: car.name,
    color: car.color,
    time,
    wins: 1
  });
}

function checkRaceEnd() {
  const carsOnPage = carState.getAllOnCurrentPage();
  const allStopped = carsOnPage.every((c) => !c.isDriving);
  if (allStopped && carState.isRacing) {
    carState.isRacing = false;
    setGarageButtons(true, true, true);
    carsOnPage.forEach((car) => {
      setEngineButtons(car.id, false, true);
    });
  }
}

async function handleCarStart(carId) {
  const car = carState.getById(carId);
  if (!car || car.isDriving) {
    return;
  }
  car.isDriving = true;
  setRaceButton();
  updateRaceSound();
  const engineData = await changeEngineStatus(carId, "started");
  if (!engineData) {
    resetCarState(car.id);
    errorPopup.show(POPUP_MESSAGES.carStartFailed(carId, car.name));
    return;
  }
  animateCar(carId, engineData.velocity, engineData.distance, (succeeded, time) => {
    car.isDriving = false;
    setRaceButton();
    updateRaceSound();
    if (carState.isRacing) {
      if (succeeded && !carState.winner) {
        carState.winner = car;
        winnerPopup.show(car.name);
        const finishTime = time ?? engineData.distance / engineData.velocity / MILLISECONDS;
        handleWinner(car, finishTime);
      }
      checkRaceEnd();
      audioPLayer.playOnce("brake");
    }
  });
  if (!carState.isRacing) {
    setEngineButtons(carId, false, true);
  }
  const sessionId = carState.garageSessionId;
  const engineParams = await changeEngineStatus(carId, "drive");
  if (carState.garageSessionId !== sessionId) {
    return;
  }
  if (!engineParams) {
    checkRaceEnd();
    resetCarState(car.id);
    audioPLayer.playOnce("brake");
    errorPopup.show(
      `The ${car.name} car (ID ${carId}) has been stopped suddenly. It's engine was broken down.`
    );
    return;
  }
}

let isEngineControllerStarted = false;
function startEngineController() {
  if (isEngineControllerStarted) {
    return;
  }
  isEngineControllerStarted = true;
  eventState.on("car:start", async (payload) => {
    if (!payload) {
      return;
    }
    await handleCarStart(payload.id);
  });
  eventState.on("car:reset", async (payload) => {
    if (!payload) {
      return;
    }
    const carId = payload.id;
    const car = carState.getById(carId);
    stopCarAnimation(carId);
    const result = await changeEngineStatus(carId, "stopped");
    if (!result) {
      errorPopup.show(POPUP_MESSAGES.carResetFailed(carId, car?.name));
      return;
    }
    resetCarPosition(carId);
    setEngineButtons(carId, true, false);
  });
}

async function deleteCar(id) {
  const garageResponse = await fetchData(`${API_URL}/garage/${id}`, { method: "DELETE" });
  if (!garageResponse) {
    return false;
  }
  await fetchData(`${API_URL}/winners/${id}`, { method: "DELETE" });
  return true;
}

async function updateCar(id, name, color) {
  const url = `${API_URL}/garage/${id}`;
  const updatedCar = await fetchData(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, color })
  });
  return updatedCar;
}

let isControllerStarted = false;
function startGarageController() {
  if (isControllerStarted) {
    return;
  }
  isControllerStarted = true;
  eventState.on("car:create", async (payload) => {
    if (!payload) {
      return;
    }
    const created = await createCar(payload.name, payload.color);
    if (!created) {
      errorPopup.show(POPUP_MESSAGES.carCreateFailed());
      return;
    }
    carState.add(created);
    eventState.emit("updateform:reset");
    eventState.emit("garage:refresh");
  });
  eventState.on("car:update", async (payload) => {
    if (!payload) {
      return;
    }
    const updated = await updateCar(payload.id, payload.name, payload.color);
    if (!updated) {
      errorPopup.show(POPUP_MESSAGES.carUpdateFailed());
      return;
    }
    carState.update(updated);
    eventState.emit("garage:refresh");
    eventState.emit("winners:refresh");
  });
  eventState.on("car:delete", async (payload) => {
    if (!payload) {
      return;
    }
    const car = carState.getById(payload.id);
    const success = await deleteCar(payload.id);
    if (!success) {
      errorPopup.show(POPUP_MESSAGES.carDeleteFailed(payload.id, car?.name));
      return;
    }
    stopCarAnimation(payload.id);
    carState.remove(payload.id);
    removeCarStore(payload.id);
    const maxPage = Math.ceil(carState.totalCount / appState.perPage);
    if (appState.garagePage > maxPage) {
      appState.garagePage = maxPage > 0 ? maxPage : 1;
    }
    garageList.render();
    eventState.emit("car:deleted", payload.id);
  });
}

let isRaceControllerStarted = false;
function startRaceController() {
  if (isRaceControllerStarted) {
    return;
  }
  isRaceControllerStarted = true;
  eventState.on("garage:race", () => {
    resetAllCarsPositions();
    carState.winner = void 0;
    carState.isRacing = true;
    setGarageButtons(false, true, false);
    const carsOnPage = carState.getAllOnCurrentPage();
    carsOnPage.forEach((car) => {
      setEngineButtons(car.id, false, false);
      eventState.emit("car:start", { id: car.id });
    });
  });
  eventState.on("garage:reset", () => {
    carState.isRacing = false;
    setGarageButtons(true, true, true);
    carState.garageSessionId += 1;
    carState.winner = void 0;
    const carsOnPage = carState.getAllOnCurrentPage();
    carsOnPage.forEach((car) => {
      resetCarPosition(car.id);
    });
    carState.winner = void 0;
  });
}

async function createWinner(id, wins, time) {
  const url = `${API_URL}/winners`;
  const winner = await fetchData(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, wins, time })
  });
  return winner;
}

async function updateWinner(id, wins, time) {
  const url = `${API_URL}/winners/${id}`;
  const winner = await fetchData(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wins, time })
  });
  return winner;
}

const winnersState = {
  winners: {},
  totalWinners: 0,
  set(winners) {
    this.winners = {};
    winners.forEach((w) => {
      this.winners[w.id] = w;
    });
  },
  add(winner) {
    this.winners[winner.id] = winner;
    this.totalWinners += 1;
  },
  update(winner) {
    this.winners[winner.id] = winner;
  },
  remove(id) {
    this.winners = Object.fromEntries(
      Object.entries(this.winners).filter(([key]) => Number(key) !== id)
    );
    this.totalWinners -= 1;
  },
  getById(id) {
    return this.winners[id];
  }
};

function handleWinnerUpdate(payload) {
  if (!payload) {
    return;
  }
  const existing = winnersState.getById(payload.id);
  if (!existing) {
    return;
  }
  winnersState.update({
    ...existing,
    name: payload.name,
    color: payload.color
  });
  eventState.emit("winner:updated");
}

let isWinnersControllerStarted = false;
function startWinnersController() {
  if (isWinnersControllerStarted) {
    return;
  }
  isWinnersControllerStarted = true;
  eventState.on("winner:add", async (payload) => {
    if (!payload) {
      return;
    }
    const { id, name, color, time } = payload;
    const existing = winnersState.getById(id);
    if (existing) {
      const currentWins = existing.wins + 1;
      const bestTime = Math.min(existing.time, time);
      const updated = await updateWinner(id, currentWins, bestTime);
      if (!updated) {
        errorPopup.show(POPUP_MESSAGES.winnerUpdateFailed(name));
        return;
      }
      winnersState.update({
        ...updated,
        name,
        color,
        wins: updated.wins
      });
    } else {
      const created = await createWinner(id, 1, time);
      if (!created) {
        errorPopup.show(POPUP_MESSAGES.winnerCreateFailed(name));
        return;
      }
      winnersState.add({
        ...created,
        name,
        color
      });
    }
    eventState.emit("winner:updated");
  });
  eventState.on("car:delete", (payload) => {
    if (!payload) {
      return;
    }
    const carId = payload.id;
    if (winnersState.getById(carId)) {
      winnersState.remove(carId);
      eventState.emit("winner:updated");
    }
  });
  eventState.on("car:update", handleWinnerUpdate);
}

function createGarageButtons() {
  const container = createElement({ tag: "div", className: ["garage__buttons"] });
  const raceButton = createButton({
    text: "Race",
    className: "race-button"
  });
  const resetButton = createButton({
    text: "Reset",
    className: "race-button"
  });
  const generateButton = createButton({
    text: "Generate Cars",
    className: "race-button"
  });
  garageButtons.race = raceButton;
  garageButtons.reset = resetButton;
  garageButtons.generate = generateButton;
  container.append(raceButton, resetButton, generateButton);
  raceButton.addEventListener("click", () => {
    eventState.emit("garage:race");
  });
  resetButton.addEventListener("click", () => {
    eventState.emit("garage:reset");
  });
  generateButton.addEventListener("click", () => {
    eventState.emit("garage:generate", CARS_QUANTITY);
  });
  return container;
}

function implementPagination({ onPrev, onNext }) {
  const paginationContainer = createElement({ tag: "div", className: ["pagination"] });
  const previousButton = createElement({
    tag: "button",
    className: ["prev-button"],
    textContent: "Prev"
  });
  const nextButton = createElement({
    tag: "button",
    className: ["next-button"],
    textContent: "Next"
  });
  previousButton.addEventListener("click", onPrev);
  nextButton.addEventListener("click", onNext);
  paginationContainer.append(previousButton, nextButton);
  return { paginationContainer, previousButton, nextButton };
}

async function getCars() {
  const url = `${API_URL}/garage`;
  const cars = await fetchData(url);
  if (!cars) {
    return void 0;
  }
  const totalCountHeader = Number(await fetchData(url, { method: "HEAD" }));
  const totalCount = totalCountHeader > 0 ? totalCountHeader : cars.length;
  return { cars, totalCount };
}

let isDefault = false;
async function loadDefaultCars() {
  if (isDefault) {
    return;
  }
  const result = await getCars();
  if (!result) {
    errorPopup.show(POPUP_MESSAGES.garageLoadFailed());
    return;
  }
  const { cars, totalCount } = result;
  carState.set(cars, totalCount);
  isDefault = true;
}

function createPageInfo({
  title,
  page,
  total,
  totalText
}) {
  const container = createElement({ tag: "div", className: ["page-info"] });
  const content = createElement({ tag: "div", className: ["content"] });
  const heading = createElement({ tag: "h2", textContent: title });
  const pageInfo = createElement({ tag: "p", className: ["info"], textContent: `Page: ${page}` });
  const totalInfo = createElement({
    tag: "p",
    className: ["info"],
    textContent: `${totalText}: ${total}`
  });
  content.append(heading, pageInfo, totalInfo);
  container.append(heading, content);
  return { container, totalInfo, pageInfo };
}

const infoElements = createPageInfo({
  title: "Garage",
  page: appState.garagePage,
  total: carState.cars.length,
  totalText: "Total Cars"
});
eventState.on("garage:refresh", () => {
  infoElements.totalInfo.textContent = `Total Cars: ${carState.totalCount}`;
});
eventState.on("garage:pagination:update", (data) => {
  if (!data) {
    return;
  }
  const { currentPage, totalCount } = data;
  infoElements.totalInfo.textContent = `Total Cars: ${totalCount}`;
  infoElements.pageInfo.textContent = `Page: ${currentPage} / ${Math.ceil(totalCount / appState.perPage) || 1}`;
});

async function getWinners() {
  const url = `${API_URL}/winners`;
  const winners = await fetchData(url);
  if (!winners) {
    return void 0;
  }
  const totalWinners = winners.length;
  return { winners, totalWinners };
}

let areWinnersLoaded = false;
async function loadWinners() {
  if (areWinnersLoaded) {
    return;
  }
  areWinnersLoaded = true;
  const result = await getWinners();
  if (!result) {
    errorPopup.show(POPUP_MESSAGES.winnersLoadFailed());
    return;
  }
  const { winners } = result;
  const winnersData = winners.map((winner) => {
    const car = carState.getById(winner.id);
    return {
      id: winner.id,
      wins: winner.wins,
      time: winner.time,
      name: car?.name ?? "Car",
      color: car?.color ?? "#000000"
    };
  });
  winnersState.set(winnersData);
  winnersState.totalWinners = winnersData.length;
}

async function createGarage() {
  const main = createElement({ tag: "div", className: ["main"] });
  const container = createElement({ tag: "div", className: ["container"] });
  document.body.append(main);
  main.append(container);
  if (!container.contains(infoElements.container)) {
    container.append(infoElements.container);
  }
  const formsContainer = createElement({ tag: "div", className: ["form-container"] });
  container.append(formsContainer);
  const createForm = createCarForm({ isUpdate: false });
  const updateForm = createCarForm({ isUpdate: true});
  formsContainer.append(createForm, updateForm);
  const garageButtons = createGarageButtons();
  formsContainer.append(garageButtons);
  const { paginationContainer, previousButton, nextButton } = implementPagination({
    onPrev: () => {
      garageList.setPage(appState.garagePage - 1);
    },
    onNext: () => {
      garageList.setPage(appState.garagePage + 1);
    }
  });
  container.append(paginationContainer);
  await loadDefaultCars();
  await loadWinners();
  if (!container.contains(garageContainer)) {
    container.append(garageContainer);
  }
  startGarageController();
  startEngineController();
  startRaceController();
  startWinnersController();
  eventState.on("garage:pagination:update", () => {
    const { garagePage } = appState;
    const totalCount = carState.totalCount;
    const maxPage = Math.ceil(totalCount / appState.perPage);
    previousButton.disabled = garagePage === 1;
    nextButton.disabled = garagePage === maxPage || maxPage === 0;
  });
  eventState.emit("garage:refresh");
}

function createMuteButton() {
  const button = createElement({
    tag: "div",
    className: ["mute-button"]
  });
  if (audioPLayer.isMuted) {
    button.classList.add("mute-button_active");
  }
  button.addEventListener("click", () => {
    audioPLayer.toggleMute();
    button.classList.toggle("mute-button_active", audioPLayer.isMuted);
  });
  return button;
}

function createHeader$1() {
  const header = createElement({ tag: "header", className: ["header"] });
  const title = createElement({ tag: "h1", className: ["title"], textContent: "Async Race" });
  const settings = createElement({ tag: "div", className: ["settings"] });
  const muteButton = createMuteButton();
  const nav = createElement({ tag: "nav", className: ["nav"] });
  const garageNav = createButton({
    text: "To Garage",
    className: `garage-button ${appState.view === "garage" ? "active" : ""}`,
    disabled: appState.view === "garage"
  });
  garageNav.addEventListener("click", () => {
    eventState.emit("view:changed", "garage");
  });
  const winnersNav = createButton({
    text: "To Winners",
    className: `winners-button ${appState.view === "winners" ? "active" : ""}`,
    disabled: appState.view === "winners"
  });
  winnersNav.addEventListener("click", () => {
    eventState.emit("view:changed", "winners");
  });
  settings.append(nav, muteButton);
  header.append(title, settings);
  nav.append(garageNav, winnersNav);
  document.body.append(header);
}

function getWinnerCarSize() {
  const screenWidth = window.innerWidth;
  if (screenWidth > SCREEN_WIDTH_768) {
    return { width: 70, height: 26 };
  } else if (screenWidth > SCREEN_WIDTH_595) {
    return { width: 60, height: 22 };
  } else if (screenWidth > SCREEN_WIDTH_499) {
    return { width: 50, height: 18 };
  } else {
    return { width: 60, height: 22 };
  }
}

function createWinnersTable(winners) {
  const table = createElement({ tag: "div", className: ["winners-table"] });
  const headers = ["Position", "Car", "Name", "Wins", "Best Time (sec)"];
  table.append(createHeader(headers));
  winners.forEach((winner, index) => {
    table.append(createWinnerRow(winner, index));
  });
  return table;
}
function createHeader(headers) {
  const header = createElement({ tag: "div", className: ["winners-header"] });
  headers.forEach((text) => {
    const cell = createElement({
      tag: "div",
      className: ["winners-cell", "header-cell"],
      textContent: text
    });
    if (text === "Wins" || text === "Best Time (sec)") {
      const sorting = text === "Wins" ? "wins" : "time";
      const icon = createElement({
        tag: "span",
        className: ["sort-icon"],
        textContent: appState.winnersSort.sorting === sorting ? SORTING_ICONS[appState.winnersSort.order] : SORTING_ICONS.none
      });
      cell.append(icon);
      cell.addEventListener("click", () => {
        if (appState.winnersSort.sorting === sorting) {
          appState.winnersSort.order = appState.winnersSort.order === "ascending" ? "descending" : "ascending";
        } else {
          appState.winnersSort.sorting = sorting;
          appState.winnersSort.order = "ascending";
        }
        eventState.emit("winners:refresh");
      });
    }
    header.append(cell);
  });
  return header;
}
function createCarCell(color) {
  const carCell = createElement({ tag: "div", className: ["winners-cell", "car-cell"] });
  const carIcon = createElement({ tag: "div", className: ["car-icon"] });
  const { width, height } = getWinnerCarSize();
  const carSvg = createCarImage(color, width, height);
  carIcon.append(carSvg.element);
  carCell.append(carIcon);
  return carCell;
}
function createTextCell(text, label) {
  const cell = createElement({ tag: "div", className: ["winners-cell"], textContent: text });
  cell.dataset.label = label;
  return cell;
}
function createWinnerRow(winner, index) {
  const row = createElement({ tag: "div", className: ["winners-row"] });
  row.append(createTextCell(String(index + 1), "Position:"));
  row.append(createCarCell(winner.color));
  row.append(createTextCell(winner.name, "Name:"));
  row.append(createTextCell(String(winner.wins), "Wins:"));
  row.append(createTextCell(winner.time.toFixed(2), "Best Time (sec):"));
  return row;
}

function sortTable(winners) {
  const { sorting, order } = appState.winnersSort;
  return [...winners].toSorted((a, b) => {
    const difference = a[sorting] - b[sorting];
    return order === "ascending" ? difference : -difference;
  });
}

const winnersContainer = createElement({ tag: "div", className: ["garage-container"] });
const winnersList = (() => {
  function renderWinners() {
    const start = (appState.winnersPage - 1) * appState.winnersPerPage;
    const end = start + appState.winnersPerPage;
    let winners = Object.values(winnersState.winners);
    winners = sortTable(winners);
    const pageWinners = winners.slice(start, end);
    winnersContainer.replaceChildren();
    if (winners.length === 0) {
      renderEmpty();
      return;
    }
    winnersContainer.append(createWinnersTable(pageWinners));
    eventState.emit("winners:pagination:update", {
      currentPage: appState.winnersPage,
      totalCount: winnersState.totalWinners
    });
  }
  function renderEmpty() {
    winnersContainer.replaceChildren();
    winnersContainer.append(
      createElement({
        tag: "p",
        className: ["no-winners-message"],
        textContent: "No winners yet. Time to start a race!"
      })
    );
    eventState.emit("winners:pagination:update", {
      currentPage: 1,
      totalCount: 0
    });
  }
  function setWinnersPage(page) {
    const maxPage = Math.max(1, Math.ceil(winnersState.totalWinners / appState.winnersPerPage));
    if (page < 1 || page > maxPage) {
      return;
    }
    appState.winnersPage = page;
    renderWinners();
    eventState.emit("winners:pagination:update", {
      currentPage: appState.winnersPage,
      totalCount: winnersState.totalWinners
    });
  }
  eventState.on("winners:refresh", () => {
    renderWinners();
  });
  eventState.on("winner:add", renderWinners);
  eventState.on("winner:updated", renderWinners);
  eventState.on("winner:delete", renderWinners);
  window.addEventListener("resize", () => {
    renderWinners();
  });
  renderWinners();
  return { renderWinners, renderEmpty, setWinnersPage };
})();

function implementWinnersPagination({
  onPrev,
  onNext
}) {
  const paginationContainer = createElement({ tag: "div", className: ["pagination"] });
  const previousButton = createElement({
    tag: "button",
    className: ["prev-button"],
    textContent: "Prev"
  });
  const nextButton = createElement({
    tag: "button",
    className: ["next-button"],
    textContent: "Next"
  });
  previousButton.addEventListener("click", onPrev);
  nextButton.addEventListener("click", onNext);
  paginationContainer.append(previousButton, nextButton);
  return { paginationContainer, previousButton, nextButton };
}

const winnerInfoElements = createPageInfo({
  title: "Winners",
  page: appState.winnersPage,
  total: appState.winners.length,
  totalText: "Total Winners"
});
eventState.on("winners:refresh", () => {
  winnerInfoElements.totalInfo.textContent = `Total Winners: ${winnersState.totalWinners}`;
});
eventState.on("winners:pagination:update", (data) => {
  if (!data) {
    return;
  }
  const { currentPage, totalCount } = data;
  winnerInfoElements.totalInfo.textContent = `Total Winners: ${totalCount}`;
  const totalPages = Math.ceil(totalCount / appState.winnersPerPage) || 1;
  const pageText = `Page: ${currentPage} / ${totalPages}`;
  winnerInfoElements.pageInfo.textContent = pageText;
});

function createWinners() {
  const main = createElement({ tag: "div", className: ["main"] });
  const container = createElement({ tag: "div", className: ["container"] });
  document.body.append(main);
  main.append(container);
  if (!container.contains(winnerInfoElements.container)) {
    container.append(winnerInfoElements.container);
  }
  const { paginationContainer, previousButton, nextButton } = implementWinnersPagination({
    onPrev: () => {
      winnersList.setWinnersPage(appState.winnersPage - 1);
    },
    onNext: () => {
      winnersList.setWinnersPage(appState.winnersPage + 1);
    }
  });
  container.append(paginationContainer);
  if (!container.contains(winnersContainer)) {
    container.append(winnersContainer);
  }
  const tableContainer = createElement({ tag: "div", className: ["table-container"] });
  container.append(tableContainer);
  winnersList.renderWinners();
  eventState.on("winners:pagination:update", () => {
    const { winnersPage } = appState;
    const totalWinners = winnersState.totalWinners;
    const maxPage = Math.ceil(totalWinners / appState.winnersPerPage);
    previousButton.disabled = winnersPage === 1;
    nextButton.disabled = winnersPage === maxPage || maxPage === 0;
  });
  eventState.emit("winners:refresh");
}

async function createApp() {
  document.body.replaceChildren();
  createHeader$1();
  try {
    if (appState.view === "garage") {
      await createGarage();
    } else {
      resetAllCarsPositions();
      createWinners();
    }
  } catch {
    if (appState.view === "garage") {
      errorPopup.show(POPUP_MESSAGES.garageLoadFailed());
    } else {
      errorPopup.show(POPUP_MESSAGES.winnersLoadFailed());
    }
  }
  createFooter();
}

eventState.on("view:changed", async (view) => {
  if (!view) {
    return;
  }
  appState.view = view;
  try {
    await createApp();
  } catch {
    errorPopup.show(POPUP_MESSAGES.viewChangeFailed());
  }
});
try {
  await createApp();
} catch {
  errorPopup.show(POPUP_MESSAGES.appLoadFailed());
}
//# sourceMappingURL=main-CbHmOl6G.js.map
