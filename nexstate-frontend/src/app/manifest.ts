import type { MetadataRoute } from "next";
import { brand } from "@nexstate/brand";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: brand.name,
        short_name: brand.name,
        description: brand.description,
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: brand.themeColor,
        icons: [{ src: "/icon", sizes: "32x32", type: "image/png" }],
    };
}
