import { ImageResponse } from "next/og";
import { brand } from "@nexstate/brand";

// Favicon generated from the brand config (initial on the theme colour).
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: brand.themeColor,
                    color: "#ffffff",
                    fontSize: 22,
                    fontWeight: 700,
                    borderRadius: 8,
                }}
            >
                {brand.name.charAt(0)}
            </div>
        ),
        { ...size }
    );
}
