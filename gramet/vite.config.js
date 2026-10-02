// Baut das GRAMET-Modul für den Viewer als EINE ES-Datei nach ../vendor/.
// Der Viewer selbst hat keinen Build-Schritt; er lädt die Datei per
// dynamischem import() erst, wenn der Produkte-Tab geöffnet wird.
// Voraussetzung: meteokit liegt neben mws-viewer (~/Documents/Git/meteokit).
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

const meteokit = fileURLToPath(new URL("../../meteokit", import.meta.url));

export default defineConfig({
  optimizeDeps: { exclude: ["meteokit"] },
  server: { fs: { allow: [".", meteokit] } },
  build: {
    outDir: "../vendor",
    emptyOutDir: false,
    lib: {
      entry: "entry.js",
      formats: ["es"],
      fileName: () => "mws-gramet.js",
    },
  },
});
