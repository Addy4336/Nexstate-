import { permanentRedirect } from "next/navigation";

/** Photos now open in the full-screen viewer on the property page; keep old links working. */
export default async function PhotoRedirect({ params }: { params: Promise<{ slug: string; id: string }> }) {
    const { slug, id } = await params;
    permanentRedirect(`/properties/${slug}/${id}`);
}
