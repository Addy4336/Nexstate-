"use server";

import { requireStaff } from "@/lib/auth-utils";
import { supabaseAdmin } from "@/lib/db";
import { MEDIA_BUCKET, MEDIA_RULES, safeFolder, validateMedia, type MediaKind } from "@/lib/media";

export type MediaUploadTicket =
    | { success: true; path: string; token: string; publicUrl: string }
    | { success: false; error: string };

/**
 * Staff-only. Validates the file's declared type/size and returns a one-time signed upload
 * URL token. The object name is generated here (random id + extension from the validated
 * MIME type), so the client cannot choose the path or overwrite existing files.
 */
export async function createMediaUploadTicket(input: {
    kind: MediaKind;
    contentType: string;
    size: number;
    folder?: string;
}): Promise<MediaUploadTicket> {
    await requireStaff();

    if (input.kind !== "image" && input.kind !== "video") {
        return { success: false, error: "Invalid media kind" };
    }
    const problem = validateMedia(input.kind, input.contentType, input.size);
    if (problem) return { success: false, error: problem };

    const ext = MEDIA_RULES[input.kind].mimeTypes[input.contentType];
    const path = `${input.kind}s/${safeFolder(input.folder)}/${crypto.randomUUID()}.${ext}`;

    const { data, error } = await supabaseAdmin.storage.from(MEDIA_BUCKET).createSignedUploadUrl(path);
    if (error || !data) {
        console.error("createSignedUploadUrl failed:", error);
        return { success: false, error: "Could not start upload" };
    }

    const { data: pub } = supabaseAdmin.storage.from(MEDIA_BUCKET).getPublicUrl(path);
    return { success: true, path: data.path, token: data.token, publicUrl: pub.publicUrl };
}
