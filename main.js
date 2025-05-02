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

