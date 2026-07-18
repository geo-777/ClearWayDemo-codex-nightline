# 🚦 ClearWay

> **Clear the road before the siren reaches you.**

ClearWay is a proof-of-concept that demonstrates how connected vehicles can receive early warnings about approaching emergency vehicles such as ambulances, fire engines, and police vehicles.

Instead of relying solely on sirens, nearby vehicles receive advance alerts containing the emergency vehicle's estimated arrival time and distance, giving drivers more time to react safely.

> **Current Status:** Prototype / Simulation

---

# The Problem

Emergency vehicles frequently lose valuable time because traffic cannot react quickly enough.

Drivers often hear a siren but have no idea:

- Where the emergency vehicle is
- Which direction it is coming from
- How close it is
- Whether they actually need to move

Those few seconds of confusion can delay emergency response.

---

# The Idea

ClearWay demonstrates how connected vehicles could communicate with emergency services.

As an emergency vehicle updates its location, the backend identifies nearby vehicles and sends them information such as:

- 🚨 Emergency Alert
- 📍 Distance
- ⏱ Estimated Time of Arrival (ETA)

Instead of reacting only after hearing a siren, drivers can prepare in advance.

---

# Current Prototype

This project is currently a **simulation** of how the system would work in a real-world deployment.

Instead of using live GPS data from actual vehicles, two web applications simulate movement by sending coordinates to the backend.

The backend performs the calculations and determines which vehicles should receive alerts.

---

# How It Works

ClearWay is organized as a simple end-to-end demo that mimics how connected vehicles could receive early warning alerts from emergency services.

## 1. Frontend simulation loop

The demo starts with a selected scenario such as a converging route, a diverging route, or a stationary route. Each scenario contains a predefined list of latitude and longitude waypoints for both the ambulance and the vehicle.

On the frontend, the simulation hook advances through those waypoints once per second. At each tick, it:

- reads the current waypoint and the next waypoint,
- computes a heading from the current location to the next one,
- updates the visible position of the simulated vehicle or ambulance,
- sends the latest location data to the backend.

This creates the effect of a moving emergency unit and a moving vehicle in near real time.

## 2. Data exchange between the UI and the server

The ambulance panel and vehicle panel each send position updates to the backend through the API client. The ambulance sends:

- its identifier,
- current latitude and longitude,
- its estimated speed,
- its current heading.

The vehicle sends:

- its identifier,
- current latitude and longitude,
- its current heading.

These updates are posted to Express routes such as `/ambulance/location` and `/vehicle/location`.

## 3. Backend state management

Once the backend receives data, it stores the latest known state in memory. The in-memory store keeps track of active ambulances and the latest vehicle positions. When a vehicle update arrives, the backend retrieves the current list of active ambulances and evaluates whether any of them should trigger an alert.

## 4. Alert detection and calculation logic

The alert calculation happens in the detection module. For every active ambulance, the backend checks whether the update is still fresh enough to be considered relevant. It ignores ambulance updates that are older than a short time threshold, because stale data would produce unreliable alerts.

The backend then performs a series of checks:

- it calculates the real-world distance between the ambulance and the vehicle using the haversine formula,
- it rejects ambulances that are farther than the configured proximity threshold,
- it checks whether the ambulance is moving fast enough to be considered an active emergency response unit,
- it compares the ambulance's heading with the direction from the ambulance to the vehicle to see whether it is actually approaching that vehicle.

If the ambulance passes those checks, the backend estimates the time to arrival by dividing the distance by the ambulance speed. That value becomes the ETA. The alert severity is then assigned based on the ETA:

- a short ETA means a high-severity alert,
- a medium ETA means a medium-severity alert,
- a longer ETA means a low-severity alert.

The backend selects the most urgent matching ambulance and returns an alert response containing the alert status, distance, ETA, and severity.

## 5. Visualization in the frontend

The frontend uses the alert response to update the live dashboard. The map shows the ambulance and vehicle markers, while a circle around the vehicle indicates the warning zone. The circle changes color depending on the alert severity so the user can quickly understand how urgent the situation is.

In short, the project simulates a full warning flow: route-based movement on the frontend, location updates over HTTP, backend filtering and geometry-based calculations, and a visual alert shown to the driver.

---

# Features Implemented

### Backend

- Express.js server
- REST API endpoints
- In-memory data storage
- Distance calculation
- ETA estimation
- Nearby vehicle detection
- Alert generation logic

### Frontend

#### 🚑 Emergency Vehicle Simulator

- Simulated movement controls
- Sends location updates to the backend

#### 🚗 Vehicle Simulator

- Simulated vehicle movement
- Receives alerts from the backend
- Displays:
  - Alert status
  - Distance
  - ETA

---

# Tech Stack

- Node.js
- Express.js
- JavaScript
- HTML
- CSS
- Vite

---

# Current Limitations

This is an early prototype, and there are still a few known issues.

Current limitations include:

- Uses simulated coordinates instead of real GPS
- No database (all data is stored in memory)
- Basic frontend intended for demonstration
- Some bugs and edge cases are still being worked on
- Uses HTTP polling instead of WebSockets for real-time updates

---

# Future Improvements

- WebSocket-based real-time communication
- Live GPS integration
- Interactive maps
- Route prediction
- Vehicle direction detection
- Traffic signal integration
- Authentication
- Persistent database
- Fleet dashboard
- Mobile application

---

# Why It Matters

Although this project is only a simulation today, the underlying idea can be integrated into:

- Connected vehicle systems
- Smart city infrastructure
- Fleet management platforms
- Navigation applications
- Emergency response networks

The goal is to provide drivers with actionable information **before** an emergency vehicle reaches them, reducing reaction time and helping create a faster, safer path through traffic.

---

# Project Status

🚧 Prototype under active development.

The backend logic is functional for demonstrating the core concept, while the frontend serves as a simulation of how the complete system could operate in a real-world environment. There are still bugs to resolve and features to refine, but the primary objective of validating the concept has been achieved.

---
