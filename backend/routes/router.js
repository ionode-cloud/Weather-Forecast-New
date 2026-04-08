const { Router } = require("express");
const WeatherData = require("../models/weatherForecast");
const axios = require('axios');

const router = Router();

/* ──────────────────────────────────────────────────────────────────
   HELPER — build a weather data object from request body / query
────────────────────────────────────────────────────────────────── */
const buildWeatherObj = (src) => ({
    date:            src.date          || new Date(),
    temperature:     Number(src.temperature)    || undefined,
    humidity:        Number(src.humidity)       || undefined,
    windSpeed:       Number(src.windSpeed)      || undefined,
    weather:         src.weather               || undefined,
    pressure:        Number(src.pressure)       || undefined,
    altitude:        Number(src.altitude)       || undefined,
    windDirection:   src.windDirection          || undefined,
    windGust:        Number(src.windGust)       || undefined,
    precipitation:   Number(src.precipitation)  || undefined,
    lightIntensity:  Number(src.lightIntensity) || undefined,
    uvIndex:         Number(src.uvIndex)        || undefined,
    airQuality:      src.airQuality             || undefined,
    airQualityIndex: Number(src.airQualityIndex)|| undefined,
});

/* ──────────────────────────────────────────────────────────────────
   EJS VIEW
────────────────────────────────────────────────────────────────── */
router.get("/", (req, res) => {
    res.render("weatherForecast.ejs");
});

/* ──────────────────────────────────────────────────────────────────
   OPENWEATHERMAP PROXY
   GET /api/current?lat=20.23&lon=85.83
────────────────────────────────────────────────────────────────── */
router.get('/api/current', async (req, res) => {
    try {
        const apiKey = "61adcd4319aaa00fabfffb31522f3dfd";
        const { lat = 20.23333, lon = 85.833328 } = req.query;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const response = await axios.get(url);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch weather from OpenWeatherMap' });
    }
});

/* ══════════════════════════════════════════════════════════════════
   WEATHER DATA  —  FULL CRUD
   Base URL: /api/weather
══════════════════════════════════════════════════════════════════ */

/* ── GET ALL  ──────────────────────────────────────────────────────
   GET /api/weather
   Returns all records, sorted newest first.
   Supports optional query filters:
     ?limit=10        — max records returned (default 50)
     ?date=2024-04-08 — filter by date (YYYY-MM-DD)
────────────────────────────────────────────────────────────────── */
router.get('/api/weather', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const filter = {};

        if (req.query.date) {
            const day   = new Date(req.query.date);
            const next  = new Date(day); next.setDate(next.getDate() + 1);
            filter.date = { $gte: day, $lt: next };
        }

        const records = await WeatherData.find(filter)
            .sort({ createdAt: -1 })
            .limit(limit);

        res.status(200).json({
            count: records.length,
            data: records,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ── GET BY ID ─────────────────────────────────────────────────────
   GET /api/weather/:id
────────────────────────────────────────────────────────────────── */
router.get('/api/weather/:id', async (req, res) => {
    try {
        const record = await WeatherData.findById(req.params.id);
        if (!record) {
            return res.status(404).json({ error: 'Record not found' });
        }
        res.status(200).json(record);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ── CREATE ────────────────────────────────────────────────────────
   POST /api/weather
   Body (JSON):
   {
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
────────────────────────────────────────────────────────────────── */
router.post('/api/weather', async (req, res) => {
    try {
        const weather = new WeatherData(buildWeatherObj(req.body));
        await weather.save();
        res.status(201).json({
            message: 'Weather data added successfully',
            data: weather,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ── UPDATE ────────────────────────────────────────────────────────
   PUT /api/weather/:id
   Body (JSON) — any subset of fields to update
────────────────────────────────────────────────────────────────── */
router.put('/api/weather/:id', async (req, res) => {
    try {
        // Build update object, removing undefined/NaN fields
        const updates = {};
        const src = req.body;
        const numFields = ['temperature','humidity','windSpeed','pressure','altitude',
                           'windGust','precipitation','lightIntensity','uvIndex','airQualityIndex'];
        const strFields = ['weather','windDirection','airQuality'];

        numFields.forEach(f => {
            if (src[f] !== undefined && src[f] !== '') updates[f] = Number(src[f]);
        });
        strFields.forEach(f => {
            if (src[f] !== undefined) updates[f] = src[f];
        });
        if (src.date) updates.date = new Date(src.date);

        const updated = await WeatherData.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ error: 'Record not found' });
        }
        res.status(200).json({
            message: 'Weather data updated successfully',
            data: updated,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ── DELETE ────────────────────────────────────────────────────────
   DELETE /api/weather/:id
────────────────────────────────────────────────────────────────── */
router.delete('/api/weather/:id', async (req, res) => {
    try {
        const deleted = await WeatherData.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ error: 'Record not found' });
        }
        res.status(200).json({
            message: 'Record deleted successfully',
            data: deleted,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/* ──────────────────────────────────────────────────────────────────
   LEGACY ENDPOINTS (kept for backward compatibility)
   GET /weather/api  and  POST /weather/api
────────────────────────────────────────────────────────────────── */
router.get('/weather/api', async (req, res) => {
    const queryParams = req.query;
    if (Object.keys(queryParams).length > 0) {
        try {
            const weather = new WeatherData(buildWeatherObj(queryParams));
            await weather.save();
            return res.status(201).json({ message: 'Weather data added successfully', data: weather });
        } catch (err) {
            return res.status(500).json({ error: err.message });
        }
    } else {
        const allData = await WeatherData.find().sort({ createdAt: -1 });
        return res.status(200).json(allData);
    }
});

router.post('/weather/api', async (req, res) => {
    try {
        const weather = new WeatherData(buildWeatherObj(req.body));
        await weather.save();
        res.status(201).json({ message: 'Weather data added successfully', data: weather });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;