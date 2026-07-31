import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 5000;

const HOME = {
    lat: 42.8828,
    lon: -79.4403,
};

const RADIUS_NM = 40;

let cache = {data:null, fetchedAt: 0};
const CACHE_TTL_MS = 1_000;

async function fetchAircraft() {
    const now = Date.now();
    if (cache.data && now - cache.fetchedAt < CACHE_TTL_MS) {
        return cache.data;
    }

    const url = `https://opendata.adsb.fi/api/v3/lat/${HOME.lat}/lon/${HOME.lon}/dist/${RADIUS_NM}`;
    const res = await fetch(url);
    if(!res.ok) {
        throw new Error(`adsb.fi request failed: ${res.status}`);
    }
    const json = await res.json();

    const aircraft = (json.ac || [])
    .filter((a) => a.lat !== undefined && a.lon !== undefined)
    .map((a) => ({
      icao24: a.hex,
      callsign: (a.flight || "").trim(),
      latitude: a.lat,
      longitude: a.lon,
      altitudeFt: a.alt_baro,
      groundSpeedKt: a.gs,
      heading: a.track,
      verticalRateFtMin: a.baro_rate,
      squawk: a.squawk,
    }));

  cache = { data: aircraft, fetchedAt: now };
  return aircraft;
}

app.get("/api/aircraft", async (req, res) =>{
    try {
        const aircraft = await fetchAircraft();
        res.json({ aircraft, fetchedAt: cache.fetchedAt });
    } catch (err){
        console.error(err);
        res.status(502).json({ error: "Failed to fetch aircraft data"});
        }
    });

    app.use(express.static(path.join(__dirname, "..", "public")));

    app.listen(PORT, () => {
        console.log(`ADS-B radar server running at http://localhost:${PORT}`);
    })