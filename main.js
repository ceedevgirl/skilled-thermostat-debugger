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


//Renders the time bar and labels for a room.
function displayTime(room) {
  return `
    <div class="time-display">
      <span class="time start-time" data-room="${room.name}">${room.startTime}</span>
      <div class="bars">${generateBars(room)}</div>
      <span class="time end-time" data-room="${room.name}">${room.endTime}</span>
    </div>
  `;
}

// Renders the control panel for all rooms.
function generateRooms() {
  const container = document.querySelector(".rooms-control");
  container.innerHTML = rooms
    .map(
      (room) => `
      <div class="room-control" id="${room.name}">
        <div class="top">
          <h3 class="room-name">${room.name} - ${room.currTemp}°</h3>
          <div class="room-actions">
            <button class="switch">
              <ion-icon name="power-outline" class="${room.airConditionerOn ? "powerOn" : ""}"></ion-icon>
            </button>
          </div>
        </div>

        ${displayTime(room)}

        <div class="status-wrapper" style="display: ${room.airConditionerOn ? "flex" : "none"}">
          <span class="room-status">
            ${room.currTemp < 25 ? "Cooling room to:" : "Warming room to:"} ${room.currTemp}°
          </span>
          <button class="remove-room" title="Remove Room">
            <ion-icon name="trash-outline"></ion-icon>
          </button>
        </div>
      </div>
    `
    )
    .join("");
}
