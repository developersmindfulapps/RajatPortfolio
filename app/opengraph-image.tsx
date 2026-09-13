import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Rajat Deep Singh — Senior Frontend Engineer & Web Developer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#070913",
          backgroundImage:
            "radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.18) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.15) 0%, transparent 50%)",
          padding: "70px 80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#ffffff",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px 20px",
              borderRadius: "9999px",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              fontSize: "15px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "#e0e7ff",
            }}
          >
            Senior Frontend Engineer • 8+ Years Experience
          </div>
          <div
            style={{
              fontSize: "16px",
              letterSpacing: "0.1em",
              color: "rgba(255, 255, 255, 0.6)",
              fontWeight: 600,
            }}
          >
            rajatdeepsingh.xyz
          </div>
        </div>

        {/* Center: Main Identity */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              fontSize: "64px",
              fontWeight: 900,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              lineHeight: 1.1,
              background: "linear-gradient(to right, #ffffff, #c7d2fe, #a5b4fc)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Rajat Deep Singh
          </div>
          <div
            style={{
              fontSize: "26px",
              fontWeight: 600,
              color: "#94a3b8",
              letterSpacing: "0.02em",
              maxWidth: "950px",
              lineHeight: 1.4,
            }}
          >
            Building enterprise web platforms, scalable microfrontends & high-performance applications with Angular, React, Next.js & TypeScript.
          </div>
        </div>

        {/* Bottom tags */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          {[
            "Angular",
            "React",
            "Next.js",
            "TypeScript",
            "Microfrontends",
            "RxJS",
            "AG Grid",
            "Performance Optimization",
          ].map((tag) => (
            <div
              key={tag}
              style={{
                padding: "8px 18px",
                borderRadius: "8px",
                backgroundColor: "rgba(99, 102, 241, 0.12)",
                border: "1px solid rgba(99, 102, 241, 0.3)",
                fontSize: "14px",
                fontWeight: 700,
                color: "#c7d2fe",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
