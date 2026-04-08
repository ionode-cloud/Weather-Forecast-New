const { Schema , model } = require('mongoose');

const weatherForecastSchema = new Schema({  
    date: { 
        type: Date,
        default: Date.now
        },
    temperature: {
        type: Number,
    },
    humidity: {
        type: Number,
    },
    windSpeed: {
        type: Number,
    },
    weather: {
        type: String,
        
    },
    pressure: { 
        type: Number,
        
    },
    altitude: {    
        type: Number,
        
    },
    windDirection: {
        type: String,
        
    },
    windGust: {
        type: Number,
        
    },
    precipitation: {
        type: Number,
       
    },
    lightIntensity: {
        type: Number,
        
    },
    uvIndex: {
        type: Number,
        
    },
    airQuality: {   
        type: String,
        
    },
    airQualityIndex: {   
        type: Number,
        
    },
}, { timestamps: true });

const WeatherData = model('WeatherData', weatherForecastSchema);

module.exports = WeatherData;