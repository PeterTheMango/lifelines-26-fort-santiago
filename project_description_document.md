I cannot directly create a downloadable file (like `.md` or `.pdf`) for you to click and save.

However, I have placed the full **Project Description Document** into a code block below. You can easily export this yourself by following these steps:

1. Click the **"Copy"** button in the top right corner of the code block.
2. Open your text editor (VS Code, Notepad, TextEdit, etc.).
3. Paste the content.
4. Save the file as `CrisisBuild_PDD.md`.

```markdown
# Project Description Document (PDD)

**Project Name:** CrisisBuild: Offline Sustainable Reconstruction Platform
**Version:** 1.0
**Status:** Proposal / Pre-Development

---

## 1. Executive Summary
**CrisisBuild** is a deployable hardware and software ecosystem designed to empower communities in crisis-affected areas to rebuild using locally available resources. By combining offline Generative AI, long-range IoT Mesh networking, and "Local-First" software architecture, the system provides engineering expertise and inventory management without relying on the cloud, internet connectivity, or stable grid power.

The core innovation is the **"Scavenged Engineering"** engine: a Retrieval-Augmented Generation (RAG) AI that ingests real-time inventory data (rubble, timber, scrap) from field sensors and cross-references it with an offline library of engineering manuals to generate actionable, safety-compliant construction plans.

---

## 2. Problem Statement
In the immediate aftermath of natural disasters or conflicts, three critical failures occur:
1.  **Supply Chain Collapse:** Traditional construction materials (cement, steel) are unavailable.
2.  **Information Blackout:** Internet and cellular networks fail, cutting off access to engineering expertise.
3.  **Resource Inefficiency:** Potentially useful debris and raw materials exist but are difficult to quantify and utilize effectively.

Current solutions rely on expensive satellite uplinks or wait for external supply drops. There is no existing tool that optimizes *what is already there*.

---

## 3. Solution Architecture

### 3.1 High-Level Overview
The system operates as a **Local-First Infrastructure**. It does not require a central server or internet. It creates its own digital ecosystem in the field.

### 3.2 Hardware Components
The system is divided into two classes of devices:

#### **A. The "Brain" (Command Hub)**
* **Core Compute:** NVIDIA Jetson Orin Nano Super (67 TOPS)
    * *Function:* Runs the Large Language Model (LLM), Vector Database, and Web Server.
    * *Storage:* 1TB NVMe SSD (High reliability, fast database access).
* **Connectivity:**
    * **LoRa Gateway:** Heltec V3 via USB (Sidecar architecture) for receiving sensor data.
    * **Local Wi-Fi:** Intel AX210 (Access point for user devices).
* **Power Management:**
    * **Rugged Power Hub:** Custom conditioning unit connecting scavenged 12V car batteries or generators to a 19V stable output via DC-DC Boost Converters.

#### **B. The "Nervous System" (Sensor Nodes)**
* **Device:** ESP32 Microcontroller + LoRa SX1262 Radio.
* **Sensors:** Ultrasonic (Volume/Distance) and Load Cells (Weight).
* **Topology:** Self-healing Mesh Network (Meshtastic protocol).
* **Function:** Automatically broadcasts inventory levels (e.g., "Water Tank 2: 40% full") to the Brain.
* **Power:** 18650 Li-ion cells (Solar rechargeable).

### 3.3 Software Stack
* **Frontend:** Next.js (React) Progressive Web App (PWA).
* **Backend:** Python (FastAPI).
* **Database:**
    * **Structured:** SQLite (Inventory tracking).
    * **Unstructured:** ChromaDB/FAISS (Vector store for engineering manuals).
* **AI Engine:**
    * **Inference:** TensorRT-LLM (Optimized for Jetson GPU).
    * **Model:** Llama 3 (8B) or Phi-3 (Mini) quantized for edge performance.
* **Operating System:** Linux (Ubuntu-based custom image).

---

## 4. Key Features & Functionality

### 4.1 "State of the World" Inventory
Real-time tracking of material quantities.
* **Automated:** IoT sensors update levels of liquids (water/fuel) and piles (rubble/aggregate) every 10 minutes.
* **Manual:** Users can use the mobile app camera to "Scan" and log scavenged items manually.

### 4.2 The AI Architect (Offline RAG)
A context-aware generative system that synthesizes three inputs:
1.  **User Goal:** "Build a shelter for 6 people."
2.  **Inventory Context:** "We have 40 tires, unlimited earth, and 200 glass bottles."
3.  **Knowledge Base:** Retrievals from "Earthship Construction Guide" and "UNHCR Shelter Standards."

**Output:** A step-by-step, illustrated guide tailored specifically to the materials on hand (e.g., "Tire-rammed earth wall").

### 4.3 Network Health Dashboard
A geospatial view of the mesh network, allowing technicians to visualize signal strength (RSSI), identify offline nodes, and predict coverage gaps in the camp.

---

## 5. Deployment & Sustainability

### 5.1 Power Strategy
The system is designed for **Energy Scavenging**.
* **Input Agnostic:** Accepts any DC source from 10V to 24V.
* **Protection:** Double-conversion architecture (Source -> Battery -> Regulator -> Device) prevents dirty generator power from damaging the AI hardware.

### 5.2 Business Model & Pricing
The project adopts a "CapEx Heavy, OpEx Zero" model suitable for humanitarian aid budgets.

| Tier | Hardware | Target User | Estimated Price |
| :--- | :--- | :--- | :--- |
| **Scout Kit** | Raspberry Pi 5 + 3 Sensors | Small Mobile Teams | **$499** |
| **Command Hub** | Jetson Orin Nano + 10 Sensors | Base Camps / Field Hospitals | **$1,299** |
| **Open Source** | Software & Schematics | DIY / Makers | **Free** |

### 5.3 Cost Analysis (Command Hub)
* **Brain Unit BOM:** ~$389 (Jetson, SSD, Wi-Fi, LoRa, Case)
* **Sensor Node BOM:** ~$23 per unit.
* **Power Hub BOM:** ~$40.

---

## 6. Development Roadmap

### Phase 1: Prototype (Months 1-3)
* Develop the **"Sidecar" LoRa Python script** to read Meshtastic packets on Linux.
* Build the Next.js Dashboard UI mockups.
* Train/Fine-tune the RAG pipeline on a specific dataset (e.g., "Earthbag Construction").

### Phase 2: Hardware Integration (Months 4-6)
* Integrate the Jetson Orin Nano Super.
* Optimize the Llama 3 model using TensorRT-LLM for <3 second latency.
* Fabricate the "Rugged Power Hub" prototype.

### Phase 3: Field Testing (Months 7-9)
* Deploy a pilot network (1 Brain + 5 Nodes) in a controlled off-grid environment.
* Test stress resilience (heat, dust, power cycling).

---

## 7. Conclusion
CrisisBuild is not just a tool; it is a **resilience engine**. By treating local debris as a resource and local computation as a necessity, it breaks the dependency on external aid chains. It provides the two things crisis zones need most: **Information and Hope**.

```
