# ADS-B Radar

A live radar tracking aircraft over my house, built to shake the rust off my coding skills.

Node/Express backend polls the [adsb.fi](https://adsb.fi) open API for aircraft within a radius of my home coordinates. A Leaflet-based frontend renders them on a live map, updating every few seconds.

## Stack
- Node.js + Express (backend)
- Leaflet.js (frontend map)
- adsb.fi open ADS-B API (data source)

## Run it
\`\`\`
cd server
npm install
npm start
\`\`\`
Then open `http://localhost:5000`

## Roadmap
- [ ] Flight trails / history
- [ ] WebSocket live updates instead of polling
- [ ] Altitude-based marker coloring
- [ ] Deploy to Raspberry Pi
