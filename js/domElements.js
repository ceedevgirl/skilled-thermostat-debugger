import { createRoom, rooms, warmOverlay, coolOverlay, calculatePointPosition, generateBars } from './functions.js';

// DOM references
const svgPoint = document.querySelector(".point");
const roomSelect = document.getElementById("rooms");
const currentTemp = document.getElementById("temp");
const coolBtn = document.getElementById("cool");
const warmBtn = document.getElementById("warm");
const inputsDiv = document.querySelector(".inputs");

let selectedRoom = rooms[0].name;

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

/**
 * Renders the time bar and labels for a room.
 */
function displayTime(room) {
  return `
    <div class="time-display">
      <span class="time start-time" data-room="${room.name}">${room.startTime}</span>
      <div class="bars">${generateBars(room)}</div>
      <span class="time end-time" data-room="${room.name}">${room.endTime}</span>
    </div>
  `;
}

/**
 * Renders the control panel for all rooms.
 */
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

// Event Listeners
roomSelect.addEventListener("change", (e) => {
  setSelectedRoom(e.target.value);
});

document.getElementById("increase").addEventListener("click", () => {
  const room = rooms.find((r) => r.name === selectedRoom);
  if (room.currTemp < 32) room.increaseTemp();
  setIndicatorPoint(room.currTemp);
  updateTemperatureUI(room.currTemp);
  setRoomBackground(room);
  generateRooms();
  coolBtn.classList.remove("active");
  warmBtn.classList.remove("active");
});

document.getElementById("reduce").addEventListener("click", () => {
  const room = rooms.find((r) => r.name === selectedRoom);
  if (room.currTemp > 10) room.decreaseTemp();
  setIndicatorPoint(room.currTemp);
  updateTemperatureUI(room.currTemp);
  setRoomBackground(room);
  generateRooms();
  coolBtn.classList.remove("active");
  warmBtn.classList.remove("active");
});

document.querySelector(".default-settings").addEventListener("click", (e) => {
  const room = rooms.find((r) => r.name === selectedRoom);
  coolBtn.classList.remove("active");
  warmBtn.classList.remove("active");

  if (e.target.closest("#cool")) {
    room.setCurrTemp(room.coldPreset);
    coolBtn.classList.add("active");
  }

  if (e.target.closest("#warm")) {
    room.setCurrTemp(room.warmPreset);
    warmBtn.classList.add("active");
  }

  setIndicatorPoint(room.currTemp);
  updateTemperatureUI(room.currTemp);
  setRoomBackground(room);
});

document.getElementById("newPreset").addEventListener("click", () => togglePresetInputs(true));
document.getElementById("close").addEventListener("click", () => togglePresetInputs(false));

document.getElementById("save").addEventListener("click", () => {
  const coolInput = document.getElementById("coolInput");
  const warmInput = document.getElementById("warmInput");
  const errorSpan = document.querySelector(".error");

  const cool = parseInt(coolInput.value);
  const warm = parseInt(warmInput.value);

  errorSpan.style.display = "none";
  errorSpan.innerText = "";

  if (!cool || !warm) {
    errorSpan.style.display = "block";
    errorSpan.innerText = "Please enter both temperatures.";
    return;
  }

  if (cool < 10 || cool > 25) {
    errorSpan.style.display = "block";
    errorSpan.innerText = "Cool preset must be between 10° and 24°";
    return;
  }

  if (warm < 25 || warm > 32) {
    errorSpan.style.display = "block";
    errorSpan.innerText = "Warm preset must be between 25° and 32°";
    return;
  }

  const room = rooms.find((r) => r.name === selectedRoom);
  room.setColdPreset(cool);
  room.setWarmPreset(warm);
  coolInput.value = "";
  warmInput.value = "";
  togglePresetInputs(false);
});

document.querySelector(".rooms-control").addEventListener("click", (e) => {
  const parent = e.target.closest(".room-control");
  if (!parent) return;
  const room = rooms.find((r) => r.name === parent.id);
  
  if (e.target.closest(".switch")) {
    room.toggleAircon();
    generateRooms();
  }

  if (e.target.closest(".room-name")) {
    setSelectedRoom(room.name);
  }

  if (e.target.closest(".remove-room")) {
    const roomName = parent.id;
    const confirmed = confirm(`Are you sure you want to remove ${roomName}?`);
    if (confirmed) {
      const index = rooms.findIndex((r) => r.name === roomName);
      if (index !== -1) {
        rooms.splice(index, 1);
        populateRoomDropdown();
        generateRooms();
  
        // Reset to first room if current is deleted
        if (selectedRoom === roomName) {
          selectedRoom = rooms[0]?.name || "";
          if (selectedRoom) {
            setSelectedRoom(selectedRoom);
          } else {
            document.querySelector(".room").style.backgroundImage = "";
            updateTemperatureUI("-");
          }
        }
      }
    }
  }
});

// Time edit modal functionality
const createTimeEditModal = (roomName, timeType, currentTime) => {
  const modal = document.createElement('div');
  modal.className = 'time-edit-modal';
  modal.innerHTML = `
    <div class="time-edit-container">
      <h3>Edit ${timeType} Time for ${roomName}</h3>
      <input type="time" id="time-edit-input" value="${currentTime}">
      <div class="time-edit-buttons">
        <button class="cancel-time-btn">Cancel</button>
        <button class="save-time-btn">Save</button>
      </div>
    </div>
  `;
  return modal;
};

document.querySelector(".rooms-control").addEventListener("click", (e) => {
  if (!e.target.classList.contains("time")) return;

  const timeElement = e.target;
  const roomId = timeElement.dataset.room;
  const isStartTime = timeElement.classList.contains("start-time");
  const room = rooms.find((r) => r.name === roomId);
  
  if (!room) return;
  
  // Get current time value
  const currentTime = isStartTime ? room.startTime : room.endTime;
  const timeType = isStartTime ? "Start" : "End";
  
  // Create and add modal to DOM
  const modal = createTimeEditModal(room.name, timeType, currentTime);
  document.body.appendChild(modal);
  
  // Focus the input
  const timeInput = modal.querySelector('#time-edit-input');
  timeInput.focus();
  
  // Event handlers
  const saveBtn = modal.querySelector('.save-time-btn');
  const cancelBtn = modal.querySelector('.cancel-time-btn');
  
  saveBtn.addEventListener('click', () => {
    const newTime = timeInput.value;
    if (newTime) {
      // Update the room object
      if (isStartTime) {
        room.startTime = newTime;
      } else {
        room.endTime = newTime;
      }
      
      // Regenerate room UI
      generateRooms();
    }
    document.body.removeChild(modal);
  });
  
  cancelBtn.addEventListener('click', () => {
    document.body.removeChild(modal);
  });
  
  // Also close if clicking outside the modal content
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      document.body.removeChild(modal);
    }
  });
});

// Add Room functionality
document.getElementById("addRoomToggle").addEventListener("click", () => {
  const dropdown = document.getElementById("roomDropdown");
  dropdown.classList.toggle("hidden");
  
  if (!dropdown.classList.contains("hidden")) {
    document.getElementById("roomNameInput").focus();
  }
});

document.getElementById("cancelAddRoom").addEventListener("click", () => {
  document.getElementById("roomDropdown").classList.add("hidden");
  document.getElementById("roomNameInput").value = "";
  document.getElementById("roomTempInput").value = "";
  document.getElementById("roomImageInput").value = "";
});

document.getElementById("addRoomBtn").addEventListener("click", () => {
  const name = document.getElementById("roomNameInput").value;
  const temp = parseInt(document.getElementById("roomTempInput").value);
  const image = document.getElementById("roomImageInput").value;

  if (!name || isNaN(temp) || !image) {
    alert("Please fill in all fields.");
    return;
  }

  const newRoom = createRoom({
    name,
    currTemp: temp,
    coldPreset: 20,
    warmPreset: 28,
    image,
    startTime: "16:30",
    endTime: "20:00",
  });

  rooms.push(newRoom);
  populateRoomDropdown();
  generateRooms();
  
  // Clear inputs and hide dropdown
  document.getElementById("roomNameInput").value = "";
  document.getElementById("roomTempInput").value = "";
  document.getElementById("roomImageInput").value = "";
  document.getElementById("roomDropdown").classList.add("hidden");
});

// Turn On All ACs button
document.getElementById("turnOnAll").addEventListener("click", () => {
  const button = document.getElementById("turnOnAll");
  button.classList.add("pulse");
  
  rooms.forEach((room) => {
    room.airConditionerOn = true;
  });
  
  generateRooms();
  showToast("All air conditioners turned on");
  
  setTimeout(() => {
    button.classList.remove("pulse");
  }, 1500);
});

// Toast notification function
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  
  toast.textContent = message;
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Close the dropdown when clicking outside
document.addEventListener('click', (e) => {
  const dropdown = document.getElementById('roomDropdown');
  const addRoomToggle = document.getElementById('addRoomToggle');
  
  if (!dropdown.contains(e.target) && e.target !== addRoomToggle && !addRoomToggle.contains(e.target)) {
    dropdown.classList.add('hidden');
  }
});

// Initialize UI
populateRoomDropdown();
setSelectedRoom(selectedRoom);
generateRooms();

// Add CSS for the time edit styles
const timeEditStyles = document.createElement("style");
timeEditStyles.textContent = `
  .time {
    cursor: pointer;
    user-select: none;
  }
  
  .time-edit-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .time-edit-container {
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    width: 300px;
  }
  
  .time-edit-container h3 {
    margin-top: 0;
    margin-bottom: 15px;
  }
  
  .time-edit-container input {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .time-edit-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
  }
  
  .time-edit-buttons button {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .save-time-btn {
    background: #4CAF50;
    color: white;
  }
  
  .cancel-time-btn {
    background: #f44336;
    color: white;
  }
`;
document.head.appendChild(timeEditStyles);

// Toast styles
const toastStyles = document.createElement('style');
toastStyles.textContent = `
  .toast {
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--text-primary);
    color: white;
    padding: 12px 24px;
    border-radius: 30px;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s, visibility 0.3s;
    z-index: 1000;
  }
  
  .toast.show {
    opacity: 1;
    visibility: visible;
  }
`;
document.head.appendChild(toastStyles);