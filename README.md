# Fort Santiago's Lifelines 2026 Code Repository

Welcome to the Fort Santiago team's submission for Lifelines 2026 @ CMUQ!

## 📦 Monorepo Structure

This repository is organized as a **monorepo** - a single repository containing multiple related projects. Each top-level folder represents a separate code repository that focuses on a different part of the Lifelines 2026 program.

## 🗂️ Repository Organization

Each folder in this monorepo is self-contained with its own:
- Source code and dependencies
- Build configuration
- Testing setup
- Documentation
- Specific instructions in its own README

### Current Projects

> **Note**: As new components are added to this monorepo, they will be documented here. Each project folder contains its own README with detailed setup and usage instructions.

<!-- 
Example structure (to be populated as projects are added):

- **`/frontend`** - User interface and client-side application
  - See [frontend/README.md](frontend/README.md) for setup instructions
  
- **`/backend`** - Server-side API and business logic
  - See [backend/README.md](backend/README.md) for setup instructions
  
- **`/mobile`** - Mobile application
  - See [mobile/README.md](mobile/README.md) for setup instructions
  
- **`/docs`** - Project documentation and specifications
  - See [docs/README.md](docs/README.md) for more information
-->

## 🚀 Getting Started

### Clone the Repository

```bash
git clone https://github.com/your-org/lifelines-26-fort-santiago.git
cd lifelines-26-fort-santiago
```

### Prerequisites

Before running the application, ensure you have the following installed:

- **Python** (3.10+) - [Download Python](https://www.python.org/downloads/)
- **Bun** - [Install Bun](https://bun.sh/)

### Frontend Setup

```bash
cd frontend
bun install
```

Create a `.env` file in the `frontend` directory with your Mapbox token:

```bash
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

You can obtain a Mapbox token from [Mapbox Access Tokens](https://account.mapbox.com/access-tokens/).

Then run the development server:

```bash
bun run dev
```

### Backend Setup

```bash
cd backend/inventory
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Access the Platform

Open [http://localhost:3000](http://localhost:3000) in your browser to interact with the platform.

---

To work with a specific component:

1. Navigate to the relevant folder: `cd <folder-name>`
2. Read the project-specific README: `cat README.md`
3. Follow the setup and installation instructions provided in that README

Each component has its own dependencies and requirements, so make sure to check the individual README files for detailed instructions.

## 📋 Requirements

Different parts of this monorepo may have different requirements. Please refer to the README in each project folder for specific:
- Programming language and runtime versions
- Package managers and dependencies
- Build tools and configuration
- Environment variables and secrets

## 🤝 Contributing

When contributing to this monorepo:

1. Identify which component your changes affect
2. Follow the coding standards and guidelines in that component's README
3. Test your changes within the specific component
4. Ensure your changes don't break other components

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**Fort Santiago** - Lifelines 2026 @ CMUQ

---

*For questions or support, please refer to the individual project READMEs or contact the team.*