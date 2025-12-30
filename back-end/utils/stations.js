import { redLine, yellowLine, greyLine, rapidLine, violetLine, aquaLine, blueLine, magentaLine, pinkLine, greenLine, airportLine } from "./data/allLines.js";

const allLines = {
  Violet: violetLine,
  Red: redLine,
  Yellow: yellowLine,
  Grey:greyLine,
  Rapid:rapidLine,
  Aqua:aquaLine,
  Blue: blueLine,
  Magenta: magentaLine,
  Pink: pinkLine,
  Green: greenLine,
  "Airport Express": airportLine
};

// detect which line a station belongs to
export function getLineOfStation(station) {
  for (const [line, stations] of Object.entries(allLines)) {
    if (stations.includes(station)) return { line, stations };
  }
  return null;
}

export function getAdjacentStations(lineStations, station) {
  const idx = lineStations.indexOf(station);
  if (idx === -1) return [];

  const result = [station];

  if (idx > 0) result.push(lineStations[idx - 1]);
  if (idx < lineStations.length - 1) result.push(lineStations[idx + 1]);

  return result;
}