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
   * Generates visual time bars based on the room's active AC hours.
   */
  function generateBars(room) {
    const totalBars = 32;
    const timeToMinutes = (time) => {
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    };
  
    const startMinutes = timeToMinutes(room.startTime);
    const endMinutes = timeToMinutes(room.endTime);
    const isOvernight = endMinutes <= startMinutes;
    const minutesPerBar = 1440 / totalBars;
  
    let barsHTML = '';
    for (let i = 0; i < totalBars; i++) {
      const barMinute = i * minutesPerBar;
      const isActive = isOvernight
        ? barMinute >= startMinutes || barMinute < endMinutes
        : barMinute >= startMinutes && barMinute < endMinutes;
      barsHTML += `<span class="bar${isActive ? " active" : ""}"></span>`;
    }
    return barsHTML;
  }
  
  export { createRoom, rooms, warmOverlay, coolOverlay, calculatePointPosition, generateBars };