import express from "express";
import axios from "axios";
import { error } from "node:console";
const app = express();
const port = 3000;
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.render("index.ejs", {});
});
app.post("/result", async (req, res) => {
    const place = req.body.place;
    console.log(place);
    try {

        //finding coordinates
        const place_info = await axios.get(`https://geocoding-api.open-meteo.com/v1/search?name=${place}&count=1`);
        const cord_info = place_info.data;
        if (!cord_info.results || cord_info.results.length === 0) {
            return res.render("index.ejs", {
                error: "No such place exists"
            });
        }
        const place_longi = cord_info.results[0].longitude;
        const place_lati = cord_info.results[0].latitude;
        console.log(place_lati);
        console.log(place_longi);

        //determining weather
        const weather = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=${place_lati}&longitude=${place_longi}&timezone=auto&current=temperature_2m,relative_humidity_2m,dew_point_2m,wind_speed_10m,apparent_temperature,surface_pressure,cloud_cover`
        );
        const weather_data = weather.data;
        console.log(weather_data);
        res.render("result.ejs",
            {
        place:req.body.place,
        time:weather_data.current.time,
        temp:weather_data.current.temperature_2m,
        humi:weather_data.current.relative_humidity_2m,
        dew:weather_data.current.dew_point_2m,
        wind:weather_data.current.wind_speed_10m,
        aptemp:weather_data.current.apparent_temperature,
        pressure:weather_data.current.surface_pressure
            });
        }
    catch (error) {
        res.render("index.ejs",
            {
                error: "API request failed"
            }
        )

    }

});

app.listen(port);