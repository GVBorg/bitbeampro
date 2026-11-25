# BitBeam autonomous browser demo

Deploy the contents of this folder to a static hosting root. No Node.js server or Mac is needed at runtime.

The original BitBeam host is bundled in `browser-host.js` with browser shims. API requests and event stream are handled in memory; output to DMX/Art-Net/sACN/USB is disabled.

The current show is stored locally in the visitor's browser. Clearing the browser's site data resets the show.

The build sources are in the parent `BitBeam_Site` folder, including `browser-host-entry.js`, `browser-shims/`, and `build-browser-host.cjs`.
