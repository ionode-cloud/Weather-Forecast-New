const express =  require("express");
const userRouter = require("./routes/router");
const path = require("path");
const mongoose = require("mongoose");

require("dotenv").config();

const port = process.env.PORT || 2222;

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/weatherForecast")
.then(()=>console.log("Database Connected"))
.catch((err)=>console.log(err));

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Specific origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(204);
    } else {
        next();
    }
});

app.set('view engine','ejs');
app.set('views',path.resolve("./views"));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, '/views/public')));

//mongoose.connect("mongodb://127.0.0.1:27017/weatherForecast").then(()=>console.log("Database Connected")).catch((err)=>console.log(err));

app.use("/",userRouter);

app.listen(port,()=>{
    console.log("Listening on port number : ",port);
})
