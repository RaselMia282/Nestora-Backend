

// ───────────────────────────────────────────────────────────
// প্রতিটা এলাকার approximate center + spread (±0.015° ≈ ১.৫ কিমি)

import { prisma } from "../../src/lib/prisma";

// ───────────────────────────────────────────────────────────
const AREA_COORDS: Record<string, { lat: [number, number]; lng: [number, number] }> = {
  // ── Gulshan / Banani / Baridhara / Niketan / Mohakhali ──
  "Gulshan-1":        { lat: [23.780, 23.795], lng: [90.410, 90.425] },
  "Gulshan-2":        { lat: [23.790, 23.805], lng: [90.405, 90.420] },
  "Banani":           { lat: [23.790, 23.805], lng: [90.395, 90.410] },
  "Banani DOHS":      { lat: [23.795, 23.810], lng: [90.385, 90.400] },
  "Baridhara":        { lat: [23.805, 23.820], lng: [90.415, 90.430] },
  "Baridhara DOHS":   { lat: [23.810, 23.825], lng: [90.395, 90.410] },
  "Niketan":          { lat: [23.775, 23.790], lng: [90.400, 90.415] },
  "Mohakhali":        { lat: [23.775, 23.790], lng: [90.395, 90.410] },
  "Nikunja-2":        { lat: [23.820, 23.835], lng: [90.405, 90.420] },
  "Khilkhet":         { lat: [23.825, 23.840], lng: [90.415, 90.430] },

  // ── Dhanmondi / Mohammadpur / Shyamoli / Adabor ──
  "Dhanmondi":        { lat: [23.740, 23.760], lng: [90.370, 90.390] },
  "Kalabagan":        { lat: [23.745, 23.760], lng: [90.380, 90.395] },
  "Jigatola":         { lat: [23.735, 23.750], lng: [90.375, 90.390] },
  "Lalmatia":         { lat: [23.755, 23.770], lng: [90.365, 90.380] },
  "Mohammadpur":      { lat: [23.750, 23.770], lng: [90.355, 90.375] },
  "Shyamoli":         { lat: [23.770, 23.785], lng: [90.365, 90.380] },
  "Adabor":           { lat: [23.770, 23.785], lng: [90.355, 90.370] },
  "Hazaribagh":       { lat: [23.735, 23.750], lng: [90.360, 90.375] },

  // ── Uttara ──
  "Uttara Sector 3":  { lat: [23.860, 23.870], lng: [90.395, 90.405] },
  "Uttara Sector 4":  { lat: [23.865, 23.875], lng: [90.395, 90.405] },
  "Uttara Sector 7":  { lat: [23.870, 23.880], lng: [90.390, 90.400] },
  "Uttara Sector 9":  { lat: [23.875, 23.885], lng: [90.385, 90.395] },
  "Uttara Sector 10": { lat: [23.870, 23.880], lng: [90.380, 90.390] },
  "Uttara Sector 11": { lat: [23.865, 23.875], lng: [90.380, 90.390] },
  "Uttara Sector 12": { lat: [23.860, 23.870], lng: [90.385, 90.395] },
  "Uttara Sector 13": { lat: [23.855, 23.865], lng: [90.385, 90.395] },
  "Uttara Sector 14": { lat: [23.850, 23.860], lng: [90.390, 90.400] },

  // ── Mirpur / Pallabi / Kafrul / Kazipara ──
  "Mirpur-1":         { lat: [23.795, 23.810], lng: [90.350, 90.365] },
  "Mirpur-2":         { lat: [23.800, 23.815], lng: [90.355, 90.370] },
  "Mirpur-10":        { lat: [23.805, 23.820], lng: [90.365, 90.380] },
  "Mirpur-11":        { lat: [23.810, 23.825], lng: [90.360, 90.375] },
  "Pallabi":          { lat: [23.820, 23.835], lng: [90.355, 90.370] },
  "Kafrul":           { lat: [23.800, 23.815], lng: [90.375, 90.390] },
  "Kazipara":         { lat: [23.795, 23.810], lng: [90.370, 90.385] },
  "Shewrapara":       { lat: [23.790, 23.805], lng: [90.375, 90.390] },
  "Tolarbagh":        { lat: [23.790, 23.805], lng: [90.360, 90.375] },
  "Senpara Parbata":  { lat: [23.805, 23.820], lng: [90.365, 90.380] },
  "Darus Salam":      { lat: [23.780, 23.795], lng: [90.355, 90.370] },
  "Kallyanpur":       { lat: [23.785, 23.800], lng: [90.360, 90.375] },

  // ── Agargaon / Sher-e-Bangla Nagar / Tejgaon / Farmgate ──
  "Agargaon":              { lat: [23.775, 23.790], lng: [90.375, 90.390] },
  "Sher-e-Bangla Nagar":   { lat: [23.770, 23.785], lng: [90.375, 90.390] },
  "Tejgaon":               { lat: [23.760, 23.775], lng: [90.390, 90.405] },
  "Farmgate":              { lat: [23.755, 23.770], lng: [90.385, 90.400] },
  "Panthapath":            { lat: [23.745, 23.760], lng: [90.385, 90.400] },
  "Eskaton":               { lat: [23.740, 23.755], lng: [90.395, 90.410] },
  "Baily Road":            { lat: [23.735, 23.750], lng: [90.400, 90.415] },

  // ── Shantinagar / Malibagh / Rampura / Banasree ──
  "Shantinagar":      { lat: [23.735, 23.750], lng: [90.410, 90.425] },
  "Malibagh":         { lat: [23.745, 23.760], lng: [90.410, 90.425] },
  "Mouchak":          { lat: [23.745, 23.760], lng: [90.400, 90.415] },
  "Rampura":          { lat: [23.760, 23.775], lng: [90.415, 90.430] },
  "Banasree":         { lat: [23.760, 23.775], lng: [90.425, 90.440] },
  "Aftabnagar":       { lat: [23.755, 23.770], lng: [90.440, 90.455] },
  "Khilgaon":         { lat: [23.745, 23.760], lng: [90.420, 90.435] },
  "Bashabo":          { lat: [23.735, 23.750], lng: [90.425, 90.440] },

  // ── Badda ──
  "Badda":            { lat: [23.775, 23.790], lng: [90.420, 90.435] },
  "Merul Badda":      { lat: [23.780, 23.795], lng: [90.420, 90.435] },
  "Uttar Badda":      { lat: [23.790, 23.805], lng: [90.415, 90.430] },
  "South Badda":      { lat: [23.765, 23.780], lng: [90.420, 90.435] },

  // ── Old Dhaka ──
  "Wari":             { lat: [23.715, 23.730], lng: [90.410, 90.425] },
  "Sutrapur":         { lat: [23.705, 23.720], lng: [90.415, 90.430] },
  "Lalbagh":          { lat: [23.715, 23.730], lng: [90.385, 90.400] },
  "Chawkbazar":       { lat: [23.715, 23.730], lng: [90.395, 90.410] },
  "Gandaria":         { lat: [23.705, 23.720], lng: [90.405, 90.420] },
  "Jatrabari":        { lat: [23.705, 23.720], lng: [90.425, 90.440] },

  // ── Bashundhara R/A ──
  "Bashundhara R/A":  { lat: [23.815, 23.830], lng: [90.425, 90.440] },
};

// কোনো এলাকা না মিললে পুরো Dhaka-র মধ্যে random
const FALLBACK = {
  lat: [23.70, 23.90] as [number, number],
  lng: [90.35, 90.50] as [number, number],
};

function rand(min: number, max: number, decimals = 6) {
  const v = Math.random() * (max - min) + min;
  return Number(v.toFixed(decimals));
}

// "House 12, Road 4, Gulshan-1" → "Gulshan-1"
function extractArea(address: string): string {
  const parts = address.split(",").map((s) => s.trim());
  return parts[parts.length - 1];
}

async function run() {
  const properties = await prisma.property.findMany({
    where: { OR: [{ latitude: null }, { longitude: null }] },
    select: { id: true, title: true, address: true },
    orderBy: { createdAt: "asc" },
  });

  if (properties.length === 0) {
    console.log("✅ সব property-তে latitude/longitude আগেই সেট করা আছে।");
    return;
  }

  console.log(`📦 ${properties.length} টা property-তে location বসানো হবে...\n`);

  let updated = 0;
  const unmatched: string[] = [];

  await prisma.$transaction(
    async (tx) => {
      for (const p of properties) {
        const area = extractArea(p.address);
        const bounds = AREA_COORDS[area];

        if (!bounds) unmatched.push(`${p.title} → "${area}"`);

        const b = bounds ?? FALLBACK;
        const latitude = rand(b.lat[0], b.lat[1]);
        const longitude = rand(b.lng[0], b.lng[1]);

        await tx.property.update({
          where: { id: p.id },
          data: { latitude, longitude },
        });

        console.log(
          `${area.padEnd(22)} ${p.title.padEnd(30)} → ${latitude}, ${longitude}`,
        );
        updated++;
      }
    },
    { maxWait: 10_000, timeout: 60_000 },
  );

  console.log(`\n✅ ${updated} টা property-তে latitude/longitude সেট হয়েছে।`);

  if (unmatched.length) {
    console.log(`\n⚠️  ${unmatched.length} টা এলাকা মেলানো যায়নি (fallback ব্যবহার হয়েছে):`);
    unmatched.forEach((u) => console.log("  -", u));
  }
}

run()
  .catch((e) => {
    console.error("❌ failed:", e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());