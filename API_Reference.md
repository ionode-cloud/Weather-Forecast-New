# Weather Forecast API Reference

This document provides a comprehensive list of all backend API endpoints available for the Weather Forecast application.

## Base URL
Default local development URL: `http://localhost:2222`

---

## 1. Get OpenWeatherMap Current Data
Fetches the current real-time weather directly from OpenWeatherMap for a given latitude and longitude.

- **URL**: `/api/current`
- **Method**: `GET`
- **Query Parameters**:
  - `lat` (optional): Latitude (default: 20.23333)
  - `lon` (optional): Longitude (default: 85.833328)

**Success Response**: `200 OK` (OpenWeatherMap JSON Data)

---

## 2. Weather Data Storage (CRUD)
The app features its own MongoDB-backed database for storing local and custom weather metrics. The base path for all CRUD operations is `/api/weather`.

### A. Get All Weather Data
Retrieve all stored weather records, sorted by newest first.

- **URL**: `/api/weather`
- **Method**: `GET`
- **Query Parameters**:
  - `limit` (optional): Number of records to return (Default: 50)
  - `date` (optional): Filter records by specific date (Format: YYYY-MM-DD)

**Success Response**:
```json
{
  "count": 10,
  "data": [
    { "_id": "...", "temperature": 33, "humidity": 45, ... }
  ]
}
```

### B. Get Weather Data by ID
Retrieve a specific weather record by its MongoDB ID.

- **URL**: `/api/weather/:id`
- **Method**: `GET`
- **URL Params**:
  - `id`: The MongoDB document ID

**Success Response**: `200 OK` (JSON document object)

### C. Create New Weather Data
Insert a new weather data record into the database.

- **URL**: `/api/weather`
- **Method**: `POST`
- **Body Data** (JSON format expected):
```json
{
  "date": "2024-04-08T10:00:00Z",
  "temperature": 33,
  "humidity": 45,
  "windSpeed": 7,
  "weather": "Sunny",
  "pressure": 1011,
  "altitude": 200,
  "windDirection": "NW",
  "windGust": 15,
  "precipitation": 0,
  "lightIntensity": 3,
  "uvIndex": 7,
  "airQuality": "Poor",
  "airQualityIndex": 252
}
```
**Success Response**: `201 Created`

### D. Update Weather Data
Update specific fields of an existing weather record without overwriting all data.

- **URL**: `/api/weather/:id`
- **Method**: `PUT`
- **URL Params**:
  - `id`: The MongoDB document ID
- **Body Data** (JSON with any fields to update):
```json
{
  "temperature": 35,
  "weather": "Partly Cloudy"
}
```
**Success Response**: `200 OK`

### E. Delete Weather Data
Remove a weather record from the database.

- **URL**: `/api/weather/:id`
- **Method**: `DELETE`
- **URL Params**:
  - `id`: The MongoDB document ID

**Success Response**: `200 OK`
