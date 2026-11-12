import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "DiskLens — See where your storage goes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#070a08",
          color: "#f3f7ee",
          fontFamily: "Arial",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 54, height: 54, borderRadius: 15, background: "#caff4a", color: "#10160a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 800 }}>D</div>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 24, fontWeight: 700 }}>
            DiskLens
            <span style={{ fontSize: 13, color: "#96a493", fontWeight: 400 }}>Storage Intelligence</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 900 }}>
          <div style={{ fontSize: 66, lineHeight: 1.08, fontWeight: 800 }}>See where your</div>
          <div style={{ fontSize: 66, lineHeight: 1.08, fontWeight: 800, color: "#caff4a" }}>storage goes.</div>
          <div style={{ fontSize: 24, lineHeight: 1.4, color: "#96a493", marginTop: 22 }}>A clearer view of your disks. Right on your PC.</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 17, color: "#96a493" }}>
          <span>LOCAL-FIRST STORAGE INTELLIGENCE</span>
          <span>Windows 10 / 11 · x64</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
