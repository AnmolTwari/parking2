let maps = {};
let markers = {};

function initMaps() {
    // Empty callback for Google Maps API async loading
}

// Handles opening and closing the parking lot popups
function openPopup(box) {
    const parkingContainer = document.getElementById("parking-container");
    const isAlreadyActive = box.classList.contains("active");

    // Close all popups
    document.querySelectorAll(".clickable-box").forEach(el => {
        el.classList.remove("active");
        const popup = el.querySelector(".popup");
        if (popup) popup.style.display = "none";
    });

    if (!isAlreadyActive) {
        box.classList.add("active");
        const popup = box.querySelector(".popup");
        if (popup) popup.style.display = "block";
        parkingContainer.style.left = "25%";
    } else {
        parkingContainer.style.left = "50%";
    }

    const mapId = `map${box.id.slice(-1)}`;
    if (!maps[mapId]) {
        const mapContainer = document.getElementById(mapId);
        if (!mapContainer) {
            console.error(`Map container ${mapId} not found`);
            return;
        }

        const lotCoordinates = getLotCoordinates(box.id);
        const map = new google.maps.Map(mapContainer, {
            center: lotCoordinates,
            zoom: 17,
            mapTypeId: "satellite",
            disableDefaultUI: true,
        });

        const parkingSpots = getParkingSpots(box.id);
        markers[mapId] = parkingSpots.map(spot => {
            return new google.maps.Marker({
                position: spot.position,
                map: map,
                icon: {
                    url: spot.available
                        ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                        : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                    scaledSize: new google.maps.Size(20, 20),
                },
                title: spot.available ? "Available" : "Taken",
            });
        });

        maps[mapId] = map;
        google.maps.event.trigger(map, 'resize');
    }
}

function getLotCoordinates(boxId) {
    const coordinates = {
        box1: { lat: 37.7749, lng: -122.4194 },
        box2: { lat: 37.7750, lng: -122.4180 },
        box3: { lat: 37.7730, lng: -122.4170 },
        box4: { lat: 37.7720, lng: -122.4160 },
    };
    return coordinates[boxId];
}

function getParkingSpots(boxId) {
    const spots = {
        box1: [
            { position: { lat: 37.7749, lng: -122.4194 }, available: true },
            { position: { lat: 37.7748, lng: -122.4193 }, available: false },
            { position: { lat: 37.7750, lng: -122.4195 }, available: true },
            { position: { lat: 37.7747, lng: -122.4192 }, available: false },
        ],
        box2: [
            { position: { lat: 37.7750, lng: -122.4180 }, available: false },
            { position: { lat: 37.7749, lng: -122.4179 }, available: false },
            { position: { lat: 37.7751, lng: -122.4181 }, available: true },
        ],
        box3: [
            { position: { lat: 37.7730, lng: -122.4170 }, available: true },
            { position: { lat: 37.7731, lng: -122.4169 }, available: true },
            { position: { lat: 37.7729, lng: -122.4171 }, available: false },
        ],
        box4: [
            { position: { lat: 37.7720, lng: -122.4160 }, available: false },
            { position: { lat: 37.7719, lng: -122.4159 }, available: true },
            { position: { lat: 37.7721, lng: -122.4161 }, available: false },
        ],
    };
    return spots[boxId] || [];
}

// Updates the markers dynamically on the map
function updateMapMarkers(boxId, spots) {
    const mapId = `map${boxId.slice(-1)}`;
    if (maps[mapId] && markers[mapId]) {
        markers[mapId].forEach((marker, index) => {
            const spot = spots[index];
            marker.setIcon({
                url: spot.available
                    ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
                    : "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                scaledSize: new google.maps.Size(20, 20),
            });
            marker.setTitle(spot.available ? "Available" : "Taken");
        });

        // Update the popup content
        const popupContent = document.querySelector(`#${boxId} .popup-content`);
        if (popupContent) {
            const totalSpots = spots.length;
            const availableSpots = spots.filter(spot => spot.available).length;
            popupContent.innerHTML = popupContent.innerHTML.replace(
                /Available: \d+\/\d+ spaces/,
                `Available: ${availableSpots}/${totalSpots} spaces`
            );
        }
    }
}

// Simulate real-time availability every 5 seconds
setInterval(() => {
    Object.keys(maps).forEach(mapId => {
        const boxId = `box${mapId.slice(-1)}`;
        const spots = getParkingSpots(boxId).map(spot => ({
            ...spot,
            available: Math.random() > 0.5
        }));
        updateMapMarkers(boxId, spots);
    });
}, 5000);

// SEARCH BOX LOGIC
const searchButton = document.getElementById("search-btn");
const searchInput = document.getElementById("search-input");

searchButton.addEventListener("click", () => {
    const isVisible = searchInput.style.display === "inline-block";
    searchInput.style.display = isVisible ? "none" : "inline-block";
    if (!isVisible) searchInput.focus();
});

searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter" && searchInput.value.trim() === "") {
        searchInput.style.display = "none";
    }
});

document.addEventListener("click", (event) => {
    if (!searchButton.contains(event.target) && !searchInput.contains(event.target)) {
        searchInput.style.display = "none";
    }
});

// Redirect to external map location
function getRedirectUrl(boxId) {
    const urls = {
        // box1: "https://maps.app.goo.gl/cDpddasE7AdaaU9A6",
        box2: "https://maps.app.goo.gl/cDpddasE7AdaaU9A6",
        box3: "https://maps.app.goo.gl/cDpddasE7AdaaU9A6",
        box4: "https://maps.app.goo.gl/Yaaiix5GpVmwzoja8",
    };
    return urls[boxId] || "https://maps.google.com";
}

// Utility to stop event bubbling
function stopPropagation(event) {
    event.stopPropagation();
}

// Utility to open a URL in new tab
function navigateToUrl(event, url) {
    event.preventDefault();
    window.open(url, "_blank");
}
