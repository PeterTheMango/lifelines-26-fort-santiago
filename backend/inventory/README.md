# Inventory Backend

This directory contains the FastAPI backend for the Inventory system.
It uses SQLite as the database (`inventory.db`) and pre-seeds it with mock data on the first run.

## Setup

1.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```

2.  Run the server:
    ```bash
    uvicorn main:app --reload --port 8000
    ```

## API Endpoints

*   `GET /items`: Retrieve all inventory items.
*   `POST /items`: Create a new inventory item.

## Database

The database file `inventory.db` will be created automatically in this directory.
