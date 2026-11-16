# Delivery zone generation

`lib/delivery/zoneZips.ts` lists the ZIP codes that get free delivery: about a 3-hour drive from the shop.

## How it was built (2026-11-16)

1. **Candidates:** every US ZIP within 235 straight-line miles of the shop (40.1449, -111.6407), from the `zipcodes` npm package (ZIP center points). 549 ZIPs.
2. **Drive time:** OpenStreetMap routing (OSRM public demo server, `table` service), shop to each ZIP center. `osrm-table-browser.js.txt` is the snippet that was run (it was run from a browser because the build sandbox blocks that host).
3. **Calibration:** OSRM is consistently slower than Google Maps on Utah highways. Google times divided by OSRM times for six reference towns:

   | Town | Google | OSRM | Ratio |
   | --- | --- | --- | --- |
   | Moab | 3h05 | 3h48 | 0.81 |
   | Cedar City | 2h53 | 3h23 | 0.85 |
   | Vernal | 2h54 | 3h18 | 0.88 |
   | Pocatello | 3h11 | 3h40 | 0.87 |
   | Rock Springs | 3h26 | 3h47 | 0.91 |
   | Logan | 2h12 | 2h32 | 0.87 |

   Estimated drive = OSRM × 0.86. Keep the ZIP if the estimate is 180 minutes or less.
4. **Result:** 312 ZIPs (UT 287, WY 12, ID 12, NV 1).
   - Just inside: Cedar City, Vernal, Panguitch, Torrey, Lava Hot Springs.
   - Just outside: Moab, Brian Head, Jensen, Pocatello, Rock Springs.

## Files

- `zone-reference.csv`: the 312 ZIPs with city, estimated minutes, road miles.
- `osrm-raw.csv`: all 549 candidates with raw OSRM minutes and the calibrated estimate. Use it to see what changes if you move the cutoff (e.g. 195 minutes).

## Changing the cutoff without re-running anything

Filter `osrm-raw.csv` on `est_google_minutes <= N`, then paste the ZIPs into `lib/delivery/zoneZips.ts`.

## Caveat

The ZIP dataset dates from about 2014. A ZIP created since then won't be listed, and a customer there will be told they're outside the area. Add it by hand if that comes up.
