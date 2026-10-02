/**
 * GRAMET des aktuellen Tages (00–24 Z) für die MWS-Position.
 * Quelle der Datei: mws-viewer/gramet/ — Ergebnis: vendor/mws-gramet.js
 * (neu bauen mit `cd gramet && npm install && npm run build`).
 */
import "meteokit/components/gramet-panel";
import { MODELS } from "meteokit/config";
import { pickModel } from "meteokit/modelpick";
import { sliceColumnRange } from "meteokit/column";
import { fetchSurface } from "meteokit/weather";
import { gridFromColumn } from "meteokit/gramet";
import { setUnits } from "meteokit/units";

export { setUnits };

export const MODEL_LABELS = Object.fromEntries(
  Object.entries(MODELS).map(([key, m]) => [key, m.label]));

const DAY = 86400;

/**
 * @param {number} lat
 * @param {number} lon
 * @param {object} [opts]
 * @param {string} [opts.model="auto"]  "auto" oder ein Schlüssel aus MODEL_LABELS
 * @param {Date}   [opts.date]          Tag (UTC), Default heute
 * @returns {Promise<{grid, model, label, tried}>}
 */
export async function loadDayGrid(lat, lon, { model = "auto", date = new Date() } = {}) {
  const day0 = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 1000;
  const iso = (sec) => new Date(sec * 1000).toISOString().slice(0, 10);
  // Bis einschließlich 24 Z → Folgetag mit anfragen, danach zuschneiden.
  const horizon = { startDate: iso(day0), endDate: iso(day0 + DAY) };

  const picked = await pickModel(lat, lon, horizon, {
    coverFrom: day0,
    coverUntil: day0 + DAY,
    only: model === "auto" ? undefined : [model],
  });
  // Oberflächenwerte (2 m, 10 m-Wind, Niederschlag …) sind Beiwerk — fehlen
  // sie, zeichnet das GRAMET trotzdem (Zeilen bleiben leer).
  const surface = await fetchSurface(lat, lon, picked.model, horizon).catch(() => null);
  const col = sliceColumnRange(picked.col, day0, day0 + DAY);
  return {
    grid: gridFromColumn(col, surface, lat, lon),
    model: picked.model,
    label: MODELS[picked.model].label,
    tried: picked.tried,
  };
}
