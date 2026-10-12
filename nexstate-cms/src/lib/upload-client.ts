"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createMediaUploadTicket } from "@/actions/media-actions";
import { MEDIA_BUCKET, validateMedia, type MediaKind } from "@/lib/media";

let browserClient: SupabaseClient | null = null;

// Anon client for the upload only; authorization comes from the signed token, not this key.
function getBrowserClient(): SupabaseClient {
    if (!browserClient) {
        browserClient = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            { auth: { persistSession: false, autoRefreshToken: false } }
        );
    }
    return browserClient;
}

/** Uploads a file to Supabase Storage and returns its public URL. Throws with a readable message. */
export async function uploadMedia(file: File, kind: MediaKind, folder?: string): Promise<string> {
    const problem = validateMedia(kind, file.type, file.size);
    if (problem) throw new Error(problem);

    const ticket = await createMediaUploadTicket({ kind, contentType: file.type, size: file.size, folder });
    if (!ticket.success) throw new Error(ticket.error);

    const { error } = await getBrowserClient()
        .storage.from(MEDIA_BUCKET)
        .uploadToSignedUrl(ticket.path, ticket.token, file, { contentType: file.type });
    if (error) throw new Error(error.message);

    return ticket.publicUrl;
}
