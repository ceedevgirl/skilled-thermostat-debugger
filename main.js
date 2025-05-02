// Room Factory Function
function createRoom({ name, currTemp, coldPreset, warmPreset, image, startTime, endTime }) {
  return {
    name,
    currTemp,
    coldPreset,
    warmPreset,
    image,
    airConditionerOn: false,
    startTime,
    endTime,

    setCurrTemp(temp) {
      this.currTemp = temp;
    },
    setColdPreset(temp) {
      this.coldPreset = temp;
    },
    setWarmPreset(temp) {
      this.warmPreset = temp;
    },
    increaseTemp() {
      this.currTemp++;
    },
    decreaseTemp() {
      this.currTemp--;
    },
    toggleAircon() {
      this.airConditionerOn = !this.airConditionerOn;
    },
  };
}

// Rooms array
const rooms = [
  createRoom({ name: "Living Room", currTemp: 32, coldPreset: 20, warmPreset: 32, image: "./assets/living-room.jpg", startTime: "16:30", endTime: "20:00" }),
  createRoom({ name: "Kitchen", currTemp: 29, coldPreset: 20, warmPreset: 32, image: "./assets/kitchen.jpg", startTime: "16:30", endTime: "20:00" }),
  createRoom({ name: "Bathroom", currTemp: 30, coldPreset: 20, warmPreset: 32, image: "./assets/bathroom.jpg", startTime: "16:30", endTime: "20:00" }),
  createRoom({ name: "Bedroom", currTemp: 31, coldPreset: 20, warmPreset: 32, image: "./assets/bedroom.jpg", startTime: "16:30", endTime: "20:00" }),
];
    

// Constants
const warmOverlay = `linear-gradient(to bottom, rgba(141, 158, 247, 0.2), rgba(194, 197, 215, 0.1))`;
const coolOverlay = `linear-gradient(to bottom, rgba(236, 96, 98, 0.2), rgba(248, 210, 211, 0.13))`;

//dom-references
const svgPoint = document.querySelector(".point");
const roomSelect = document.getElementById("rooms");
const currentTemp = document.getElementById("temp");
const coolBtn = document.getElementById("cool");
const warmBtn = document.getElementById("warm");
const inputsDiv = document.querySelector(".inputs");

let selectedRoom = rooms[0].name;


/**
 * Calculates the X and Y translation for the temperature dial indicator.
 */
function calculatePointPosition(currTemp) {
  const normalized = (currTemp - 10) / 22;
  const angle = normalized * 180 + 86;
  const radians = (angle * Math.PI) / 180;
  const radius = 116;
  return {
    translateX: radius * Math.cos(radians),
    translateY: radius * Math.sin(radians),
  };
}

/**
 * Moves the SVG indicator on the temperature dial to match the current temperature.
 */
function setIndicatorPoint(temp) {
  const { translateX, translateY } = calculatePointPosition(temp);
  svgPoint.style.transform = `translate(${translateX}px, ${translateY}px)`;
}

/**
 * Updates the temperature text display in the UI.
 */
function updateTemperatureUI(temp) {
  currentTemp.textContent = `${temp}°`;
  document.querySelector(".currentTemp").innerText = `${temp}°`;
}

/**
 * Changes the room background based on the current temperature.
 */
function setRoomBackground(room) {
  const overlay = room.currTemp < 25 ? warmOverlay : coolOverlay;
  document.querySelector(".room").style.backgroundImage = `${overlay}, url('${room.image}')`;
}


/**
 * Sets the selected room based on dropdown choice and updates the UI.
 */
function setSelectedRoom(name) {
  const room = rooms.find((r) => r.name === name);
  if (!room) return;
  selectedRoom = room.name;
  setIndicatorPoint(room.currTemp);
  updateTemperatureUI(room.currTemp);
  setRoomBackground(room);
  document.querySelector(".room-name").innerText = room.name;

  // Reset preset button states
  coolBtn.classList.remove("active");
  warmBtn.classList.remove("active");

  if (room.currTemp === room.coldPreset) {
    coolBtn.classList.add("active");
  } else if (room.currTemp === room.warmPreset) {
    warmBtn.classList.add("active");
  }
}

/**
 * Show or hide the custom preset input form.
 */
function togglePresetInputs(show) {
  inputsDiv.classList.toggle("hidden", !show);
}

/**
 * Populates the dropdown menu with available rooms.
 */
function populateRoomDropdown() {
  roomSelect.innerHTML = "";
  rooms.forEach((room) => {
    const option = document.createElement("option");
    option.value = room.name;
    option.textContent = room.name;
    roomSelect.appendChild(option);
  });
}