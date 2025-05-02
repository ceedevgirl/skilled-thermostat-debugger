import { createRoom } from '../js/functions.js';

describe('Room functionality', () => {
  let room;

  beforeEach(() => {
    room = createRoom({
      name: "Test Room",
      currTemp: 25,
      coldPreset: 20,
      warmPreset: 28,
      image: "test.jpg",
      startTime: "08:00",
      endTime: "18:00"
    });
  });

  test('should create a room with correct initial values', () => {
    expect(room.name).toBe("Test Room");
    expect(room.currTemp).toBe(25);
    expect(room.airConditionerOn).toBe(false);
  });

  test('should increase temperature', () => {
    room.increaseTemp();
    expect(room.currTemp).toBe(26);
  });

  test('should decrease temperature', () => {
    room.decreaseTemp();
    expect(room.currTemp).toBe(24);
  });

  test('should toggle air conditioner', () => {
    room.toggleAircon();
    expect(room.airConditionerOn).toBe(true);
    room.toggleAircon();
    expect(room.airConditionerOn).toBe(false);
  });

  test('should set current temperature', () => {
    room.setCurrTemp(22);
    expect(room.currTemp).toBe(22);
  });

  test('should set cold preset', () => {
    room.setColdPreset(18);
    expect(room.coldPreset).toBe(18);
  });

  test('should set warm preset', () => {
    room.setWarmPreset(30);
    expect(room.warmPreset).toBe(30);
  });
});