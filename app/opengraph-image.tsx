import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = ".CO | The Coconut Company";
export const size = {
  width: 1200,
  height: 630
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#fffdf8",
          color: "#211915",
          padding: 72
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 4, textTransform: "uppercase", color: "#4a6f4a" }}>
          Palakkad, Kerala
        </div>
        <div>
          <div style={{ fontSize: 112, lineHeight: 0.95, fontFamily: "serif" }}>.CO</div>
          <div style={{ marginTop: 24, fontSize: 56, lineHeight: 1.05, fontFamily: "serif" }}>
            The Coconut Company
          </div>
        </div>
        <div style={{ fontSize: 30, color: "#654026" }}>A modern coconut-origin lifestyle brand. Made for Living.</div>
      </div>
    ),
    size
  );
}
