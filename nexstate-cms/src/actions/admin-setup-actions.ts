"use server";

import { timingSafeEqual } from "crypto";
import { supabaseAdmin } from "@/lib/db";
import { auth } from "@/lib/auth";

/**
 * True while no admin user has a credential (password) account yet.
 * A seeded admin row without a password still counts as "not set up".
 */
async function isSetupOpen(): Promise<boolean> {
  const { data: admins, error } = await supabaseAdmin
    .from("user")
    .select("id")
    .eq("role", "admin");
  if (error) throw new Error("Unable to verify setup state");
  if (!admins || admins.length === 0) return true;

  const { data: accounts, error: accError } = await supabaseAdmin
    .from("account")
    .select("user_id")
    .eq("provider_id", "credential")
    .in("user_id", admins.map((a: { id: string }) => a.id));
  if (accError) throw new Error("Unable to verify setup state");
  return !accounts || accounts.length === 0;
}

function tokenMatches(provided: string | undefined): boolean {
  const expected = process.env.ADMIN_SETUP_TOKEN;
  if (!expected) return true; // token not configured: state check only
  if (!provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Set the initial admin password (first-run only).
 * Allowed only while no admin has a password; never touches an existing
 * credential. If ADMIN_SETUP_TOKEN is set, it must be supplied.
 */
export async function setInitialAdminPassword(formData: {
  email: string;
  password: string;
  name?: string;
  token?: string;
}) {
  try {
    if (!tokenMatches(formData.token)) {
      return { error: "Setup is not available" };
    }
    if (!(await isSetupOpen())) {
      return { error: "Setup is not available" };
    }
    if (!formData.email || !formData.password || formData.password.length < 8) {
      return { error: "Valid email and a password of at least 8 characters are required" };
    }

    const { data: existingUser } = await supabaseAdmin
      .from("user")
      .select("id, role")
      .eq("email", formData.email)
      .maybeSingle();

    let userId: string;
    let isNewUser = false;

    if (!existingUser) {
      const { data: newUser, error: createError } = await supabaseAdmin
        .from("user")
        .insert({
          name: formData.name || "Admin User",
          email: formData.email,
          email_verified: true,
          role: "admin",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (createError || !newUser) {
        console.error("Error creating user:", createError);
        return { error: "Failed to create admin account" };
      }
      userId = newUser.id;
      isNewUser = true;
    } else {
      // Only the pre-seeded admin (no password yet) may be claimed
      if (existingUser.role !== "admin") {
        return { error: "Setup is not available" };
      }
      userId = existingUser.id;
    }

    const ctx = await auth.$context;
    const hashedPassword = await ctx.password.hash(formData.password);

    const { error: accountError } = await supabaseAdmin
      .from("account")
      .insert({
        user_id: userId,
        account_id: formData.email,
        provider_id: "credential",
        password: hashedPassword,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (accountError) {
      console.error("Error creating account:", accountError);
      return { error: "Failed to create admin account" };
    }

    return {
      success: true,
      message: isNewUser ? "Admin account created successfully" : "Password set successfully",
    };
  } catch (error: any) {
    console.error("Error setting admin password:", error);
    return { error: "Failed to create admin account" };
  }
}
