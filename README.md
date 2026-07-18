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
