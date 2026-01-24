# CrisisBuild: Offline Sustainable Reconstruction Platform
## Product Requirements Document

**Team:** Fort Santiago | Lifelines 2026 @ CMUQ
**Version:** 1.0
**Date:** 2026-01-24

---

## 1. The Problem

In the aftermath of disasters, three failures compound each other:
1. **Supply chains collapse** — traditional materials are unavailable
2. **Communications go dark** — no internet means no access to expertise
3. **Resources go to waste** — usable debris exists but can't be quantified or optimized

Existing solutions assume connectivity (satellite uplinks) or wait for external supply drops. No tool currently optimizes *what is already on the ground*.

## 2. The Impact Opportunity

- 160M+ people affected by natural disasters annually (IFRC)
- Average 72-hour gap before organized aid reaches affected areas
- Estimated 60-80% of post-disaster debris is potentially reusable (UN-Habitat)

CrisisBuild fills the gap between disaster and aid by turning local rubble into engineered shelter — guided by offline AI.

---

## 3. Solution Overview

CrisisBuild is a self-contained hardware + software ecosystem that creates its own digital infrastructure in the field. No internet. No grid power. No cloud.

**Core Innovation:** A "Scavenged Engineering" engine — an offline RAG AI that cross-references real-time material inventory with engineering manuals to generate construction plans from whatever is available.

## 4. System Architecture

### 4.1 Three-Layer Model

```
┌─────────────────────────────────────────────────┐
│  LAYER 3: User Interface (PWA Dashboard)        │
│  - Inventory views (logistics officer)          │
│  - AI Architect chat (construction technician)  │
│  - Network health map (field coordinator)       │
├─────────────────────────────────────────────────┤
│  LAYER 2: Intelligence (Backend + AI)           │
│  - FastAPI server                               │
│  - RAG pipeline (LLM + vector store)            │
│  - Inventory database (SQLite)                  │
├─────────────────────────────────────────────────┤
│  LAYER 1: Sensing (IoT Mesh Network)            │
│  - ESP32 + LoRa sensor nodes                    │
│  - Meshtastic mesh protocol                     │
│  - LoRa gateway → Brain                        │
└─────────────────────────────────────────────────┘
```

### 4.2 Data Flow

```
Sensor Node → LoRa Mesh → Gateway → FastAPI → SQLite (inventory update)
                                         ↓
User Query → FastAPI → Vector Search (ChromaDB) → LLM → Construction Plan
                  ↑
         Inventory Context (SQLite)
```

---

## 5. Hardware Components

### 5.1 The "Brain" (Command Hub)

| Component | Spec | Purpose |
|-----------|------|---------|
| Compute | NVIDIA Jetson Orin Nano Super (67 TOPS) | LLM inference, web server |
| Storage | 1TB NVMe SSD | Vector DB, knowledge base, logs |
| LoRa Gateway | Heltec V3 via USB | Receive sensor mesh data |
| Local Wi-Fi | Intel AX210 (AP mode) | Serve PWA to user devices |
| Power Input | 10-24V DC (any source) | Car batteries, generators, solar |

### 5.2 Sensor Nodes ("Nervous System")

| Component | Spec | Purpose |
|-----------|------|---------|
| MCU | ESP32 + SX1262 LoRa | Processing + long-range comms |
| Sensors | Ultrasonic + Load Cells | Volume/distance + weight |
| Protocol | Meshtastic (self-healing mesh) | Multi-hop reliability |
| Power | 18650 Li-ion (solar rechargeable) | Off-grid operation |
| Broadcast | Every 10 minutes | Battery-efficient updates |

### 5.3 Rugged Power Hub

- DC-DC Boost Converter: Any 10-24V input → stable 19V output
- Double-conversion: Source → Battery → Regulator → Device
- Protection against dirty/unstable power sources
- BOM: ~$40

### 5.4 Bill of Materials Summary

| Unit | Estimated Cost |
|------|---------------|
| Brain (Jetson + peripherals) | ~$389 |
| Sensor Node (each) | ~$23 |
| Power Hub | ~$40 |
| **Command Hub Kit (Brain + 10 nodes + power)** | **~$659** |

---

## 6. Software Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | Next.js (React) PWA | Offline-capable, installable on any device |
| Backend | Python (FastAPI) | Lightweight, async, easy to deploy |
| Structured DB | SQLite | Inventory tracking, zero-config |
| Vector DB | ChromaDB | Embedding store for knowledge base |
| AI Inference (Production) | TensorRT-LLM on Jetson | Llama 3 8B / Phi-3 Mini quantized |
| AI Inference (MVP) | Cloud API (Anthropic/OpenAI) | Swap-in during development |
| IoT Protocol | Meshtastic | LoRa mesh, open-source |

## 7. Key Features

### 7.1 Inventory Management ("State of the World")

- **Automated:** Sensor nodes broadcast material levels (water, fuel, rubble, aggregate) every 10 minutes via LoRa
- **Manual:** Users scan/log scavenged items through the PWA (camera input + form entry)
- **Unified view:** Real-time quantities displayed per material type and location

### 7.2 AI Architect (Offline RAG Chat)

**Inputs:**
1. User goal ("Build a shelter for 6 people")
2. Inventory context (auto-injected from SQLite)
3. Knowledge base retrievals (ChromaDB → engineering manuals)

**Output:** Step-by-step construction guide tailored to available materials

**Knowledge Sources:**
- Open-source: Earthship manuals, Earthbag guides, UNHCR Shelter Standards
- Custom: Team-written scenarios for demo (e.g., tire-rammed earth walls)

### 7.3 Network Health Dashboard

- Geospatial map of mesh node locations
- Signal strength (RSSI) per link
- Node online/offline status
- Coverage gap prediction

---

## 8. User Personas & Interface Design

### 8.1 Personas

| Persona | Role | Primary Needs |
|---------|------|---------------|
| **Field Coordinator** | Aid worker, non-technical | Simple inventory overview, plain-language AI outputs |
| **Construction Technician** | Semi-technical, builds structures | Actionable plans with diagrams, material specs |
| **Logistics Officer** | Camp manager | Resource allocation across sites, supply forecasting |

### 8.2 Unified Interface (Page Structure)

One PWA with role-oriented pages:

| Page | Primary Persona | Description |
|------|----------------|-------------|
| `/dashboard` | Logistics Officer | Overview: total inventory, alerts, network status summary |
| `/inventory` | Field Coordinator | Material list with quantities, manual entry form, scan button |
| `/architect` | Construction Technician | Chat interface for AI-generated build plans |
| `/network` | Field Coordinator | Mesh network map, node health, signal strength |
| `/settings` | All | System config, user preferences, data export |

### 8.3 Design Principles

- **Offline-first:** All pages functional without connectivity
- **Low-literacy friendly:** Icons + color coding supplement text
- **High-contrast:** Usable in bright outdoor conditions
- **Touch-optimized:** Large tap targets for gloved/dirty hands
- **Multilingual-ready:** i18n architecture from day one

---

## 9. MVP Scope — 3-Day Code Submission

Given the competition timeline, the MVP demonstrates the core value proposition with strategic simplifications.

### 9.1 What We're Building

| Component | MVP Implementation | Full Vision |
|-----------|-------------------|-------------|
| AI Architect | Cloud API + ChromaDB RAG | TensorRT-LLM on Jetson |
| Knowledge Base | 3-5 open-source docs + 2 custom scenarios | Full engineering library |
| Frontend | Next.js PWA (all 5 pages) | Same |
| Backend | FastAPI + SQLite + ChromaDB | Same |
| Sensor Data | Simulated (Python script emitting fake readings) | Real ESP32 + LoRa nodes |
| Network Map | Static/mocked node positions | Live Meshtastic telemetry |
| Power System | N/A (laptop-powered) | Rugged Power Hub |

### 9.2 MVP User Flow

1. User opens PWA → sees `/dashboard` with inventory summary
2. Simulated sensors update inventory every 10 minutes
3. User manually logs a scavenged item on `/inventory`
4. User navigates to `/architect` and asks: "Build a shelter for 4 people"
5. RAG pipeline injects current inventory + retrieves relevant docs
6. AI returns a step-by-step plan using available materials
7. User views `/network` page showing simulated mesh topology

### 9.3 Team Workload Split (3 Days)

| Member | Track | Deliverables |
|--------|-------|-------------|
| Tech 1 | Backend + AI | FastAPI, RAG pipeline, ChromaDB ingestion, sensor simulator |
| Tech 2 | Frontend | Next.js PWA, all 5 pages, API integration |
| Business 1 | Content + Testing | Knowledge base curation, test scenarios, UX feedback |
| Business 2 | Documentation + Presentation | PRD finalization, demo script, pitch deck |

---

## 10. Deployment Strategy

### 10.1 Power Strategy (Production)

- **Input Agnostic:** Accepts any DC source from 10-24V
- **Double-conversion protection:** Source → Battery → Regulator → Device
- **Scavenged energy:** Car batteries, generators, solar panels
- **No grid dependency**

### 10.2 Field Deployment Workflow

1. Deploy Brain unit with charged battery + Wi-Fi AP active
2. Place sensor nodes at material stockpile locations
3. Mesh network self-heals and establishes routing
4. Field workers connect phones/tablets to local Wi-Fi
5. PWA installs automatically, ready for use

## 11. Business Model

### 11.1 "CapEx Heavy, OpEx Zero"

No subscriptions. No cloud costs. No recurring fees. One-time hardware purchase, indefinite use.

### 11.2 Product Tiers

| Tier | Contents | Target User | Price |
|------|----------|-------------|-------|
| **Scout Kit** | Raspberry Pi 5 + 3 sensor nodes | Small mobile teams | $499 |
| **Command Hub** | Jetson Orin Nano + 10 sensor nodes + Power Hub | Base camps / field hospitals | $1,299 |
| **Open Source** | Software + schematics | DIY / Makers / NGOs | Free |

### 11.3 Go-To-Market

- **Primary channel:** Humanitarian procurement (UN agencies, Red Cross/Crescent, MSF)
- **Secondary:** Disaster preparedness programs (government civil defense)
- **Tertiary:** Open-source community adoption, maker/prepper market

### 11.4 Sustainability

- Hardware margins fund ongoing software development
- Open-source model drives adoption and community contributions
- No vendor lock-in — organizations can self-maintain

---

## 12. Development Roadmap

### Phase 1: MVP (Current — Competition Deliverable)
- Cloud API-backed RAG pipeline with 5-7 knowledge documents
- Next.js PWA with all 5 pages
- FastAPI backend with SQLite + ChromaDB
- Simulated sensor data
- Demo-ready vertical slice

### Phase 2: Hardware Integration
- Procure Jetson Orin Nano Super
- Port LLM inference to TensorRT-LLM (target <3s latency)
- Build 3-5 ESP32 + LoRa sensor nodes
- Integrate Meshtastic mesh protocol
- Replace cloud API with on-device inference

### Phase 3: Field Hardening
- Fabricate Rugged Power Hub prototype
- Weatherproof enclosures for all hardware
- Stress testing (heat, dust, power cycling)
- Expand knowledge base (20+ documents)
- Multi-language UI support

### Phase 4: Pilot Deployment
- Deploy 1 Brain + 5 nodes in controlled off-grid environment
- Partner with humanitarian org for real-world feedback
- Iterate on UX based on field coordinator input
- Validate power scavenging in real conditions

## 13. Success Metrics

### MVP (Competition)

| Metric | Target |
|--------|--------|
| RAG response relevance | Plans reference actual inventory items |
| Response latency (cloud API) | <5 seconds |
| PWA page load (cached) | <2 seconds |
| Knowledge base coverage | 3+ construction methods |
| Demo scenario completion | User can go from query → actionable plan |

### Production (Post-Competition)

| Metric | Target |
|--------|--------|
| On-device inference latency | <3 seconds |
| Sensor mesh uptime | >99% over 72 hours |
| LoRa range (node-to-node) | >500m line of sight |
| Power runtime (single battery) | >8 hours continuous |
| Time from unboxing to operational | <30 minutes |

---

## 14. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| LLM generates unsafe construction advice | High | Critical | Retrieval-only mode (no hallucinated specs), disclaimer on all outputs, reference source docs |
| Jetson thermal throttling in hot climates | Medium | High | Passive heatsink design, duty-cycle inference, thermal monitoring |
| LoRa mesh packet loss in dense rubble | Medium | Medium | Redundant broadcast intervals, store-and-forward on nodes |
| Knowledge base gaps for local materials | High | Medium | Manual override entry, community-contributed docs |
| Power source variability damages hardware | Low | Critical | Double-conversion architecture, voltage clamping |
| 3-day MVP timeline too ambitious | Medium | High | Cut network page to static mockup if behind schedule |

## 15. Assumptions

- Users have access to at least one smartphone or tablet
- At least one team member can perform initial hardware setup
- Scavenged materials can be roughly categorized (wood, metal, earth, glass, rubber)
- Cloud API remains available during development/demo phase
- Competition judges value working demo over comprehensive documentation

---

## 16. Appendix

### A. Knowledge Base Sources (MVP)
- Earthship Biotecture Vol. 1 (open chapters)
- UNHCR Emergency Shelter Standard Guidelines
- Earthbag Building Guide (CalEarth)
- Tire-Rammed Earth Construction (open-source)
- Team-written: "Bottle Wall Construction" scenario
- Team-written: "Pallet Shelter" scenario

### B. API Contracts (MVP)

```
POST /api/inventory    — Log new material
GET  /api/inventory    — List all materials
POST /api/architect    — Submit query to RAG pipeline
GET  /api/network      — Get mesh node status
WS   /api/sensors      — WebSocket for simulated sensor stream
```

### C. Repository Structure (Planned)

```
lifelines-26-fort-santiago/
├── frontend/          # Next.js PWA
├── backend/           # FastAPI + RAG pipeline
├── sensor-sim/        # Python sensor simulator
├── knowledge-base/    # Documents for ChromaDB ingestion
├── hardware/          # Schematics, BOM, assembly docs
├── docs/              # PRD, design docs, pitch deck
└── README.md
```
