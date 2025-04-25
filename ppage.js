
// Function to update the parking slots
function updateParkingSlots() {
    const slots = document.querySelectorAll('.slot');

    slots.forEach(slot => {
        // Skip aisle slots (every 6th slot: 6, 16, 26)
        const slotNumber = parseInt(slot.getAttribute('data-slot'));
        if (slotNumber % 10 === 6) {
            return; // Skip aisle slots
        }

        // Randomly set the slot as available or unavailable
        const isAvailable = Math.random() > 0.5; // 50% chance
        slot.classList.remove('available', 'unavailable');
        slot.classList.add(isAvailable ? 'available' : 'unavailable');
    });
}

// Initial update
updateParkingSlots();

// Update every 5 seconds (5000 milliseconds)
setInterval(updateParkingSlots, 2000);
