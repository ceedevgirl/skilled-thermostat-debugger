# Bugs.md

## Bug Report – File: main.js

## Bug 1: Room Selection Not Working Properly
- Line: 206
- Type: Logical Error
- Issue: Selected room doesn't update properly
- Identification: Console logging showed `this.value` returns the object instead of name
- Fix: Should use `option.value = room.name` when creating options

### 1. Temperature Out of Range
- Line: 39
- Type: Logical Error
- Issue: User can set temperature below 10 or above 32.
- Identification Method: Manual testing & console logs.
- Fix in Correct File: Added range check and error message display.

### 2. Incorrect Visual Update for Room Temperature
- Line: 145
- Type: Missing logic
- Issue: Wrong linear gradient update based on warm/cool temp.
- Fix: Swapped warmOverlay with coolOverlay.

### 3. Incomplete Feedback for AC On
- Line: 349
- Type: Conditional Logic Error
- Issue: Only cool feedback shown; warm feedback missing.
- Fix: Added `else if (temp >= 25)` block to show "Warming room to..."

### 4. No Event Delegation for Presets
- Line: 236
- Type: Event Handling
- Issue: Buttons don’t respond due to direct binding.
- Fix: Used event delegation via `.presets` container.

### 5. No Dynamic Room Modal
- Type: Missing Feature
- Fix: Added modal with form inputs; updates dropdown dynamically.

### 6. Missing AC Schedule
- Type:  Missing Feature
- Fix: Used `setTimeout` for start/stop AC at scheduled times.

### 7. Missing “Turn On All ACs” Button
- Type: Missing Feature
- Fix: Button now loops through all room cards and sets AC to “ON”.

