"use server";

import { requireAdmin } from "@/lib/auth-utils";

import { supabaseAdmin } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sendUserInviteEmail, generateSecurePassword } from "@/lib/email";

export async function inviteUser(formData: FormData) {
    await requireAdmin();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as string || "editor";

    if (!name || !email) {
        return { error: "Name and email are required" };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { error: "Invalid email format" };
    }

    // Validate role
    const validRoles = ["admin", "manager", "editor"];
    if (!validRoles.includes(role)) {
        return { error: "Invalid role selected" };
    }

    // Generate a secure password
    const password = generateSecurePassword(12);

    try {
        // Check if user already exists
        const { data: existingUser } = await supabaseAdmin
            .from("user")
            .select("id")
            .eq("email", email)
            .single();

        if (existingUser) {
            return { error: "User with this email already exists" };
        }

        // Use Better Auth's internal password hashing
        const ctx = await auth.$context;
        const hashedPassword = await ctx.password.hash(password);

        // Create user
        const { data: userData, error: userError } = await supabaseAdmin
            .from("user")
            .insert({
                name,
                email,
                role,
                email_verified: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .select("id")
            .single();

        if (userError || !userData) {
            console.error("Error creating user:", userError);
            return { error: userError?.message || "Failed to create user" };
        }

        const userId = userData.id;

        // Create account with hashed password
        const { error: accountError } = await supabaseAdmin
            .from("account")
            .insert({
                user_id: userId,
                account_id: email,
                provider_id: "credential",
                password: hashedPassword,
            });

        if (accountError) {
            console.error("Error creating account:", accountError);
            return { error: accountError.message || "Failed to create account" };
        }

        // Send invitation email with credentials
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
        const emailResult = await sendUserInviteEmail({
            to: email,
            name,
            email,
            password,
            role,
            loginUrl: `${baseUrl}/admin/login`,
        });

        if (!emailResult.success) {
            console.error("Failed to send invitation email:", emailResult.error);
            // User is created but email failed - don't fail the whole operation
        }

    } catch (error: any) {
        console.error("Error creating user:", error);
        return { error: error.message || "Failed to create user" };
    }

    revalidatePath("/admin/users");
    return { success: true, message: "User invited successfully! An email with login credentials has been sent." };
}

// Keep the old function name as an alias for backwards compatibility
export const createUser = inviteUser;

export async function updateUser(id: string, formData: FormData) {
    await requireAdmin();
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as string;
    const banned = formData.get("banned") === "true";
    const banReason = formData.get("ban_reason") as string || null;

    if (!name || !email) {
        return { error: "Name and email are required" };
    }

    try {
        // Check if email is taken by another user
        const { data: existingUser } = await supabaseAdmin
            .from("user")
            .select("id")
            .eq("email", email)
            .neq("id", id)
            .single();

        if (existingUser) {
            return { error: "Email is already in use" };
        }

        const { error } = await supabaseAdmin
            .from("user")
            .update({
                name,
                email,
                role,
                banned,
                ban_reason: banReason,
                updated_at: new Date().toISOString(),
            })
            .eq("id", id);

        if (error) {
            console.error("Error updating user:", error);
            return { error: error.message || "Failed to update user" };
        }
    } catch (error: any) {
        console.error("Error updating user:", error);
        return { error: error.message || "Failed to update user" };
    }

    revalidatePath("/admin/users");
    redirect("/admin/users");
}

export async function deleteUser(id: string) {
    await requireAdmin();
    try {
        const { error } = await supabaseAdmin
            .from("user")
            .delete()
            .eq("id", id);
        
        if (error) {
            console.error("Error deleting user:", error);
            return { error: error.message || "Failed to delete user" };
        }
    } catch (error: any) {
        console.error("Error deleting user:", error);
        return { error: error.message || "Failed to delete user" };
    }
    revalidatePath("/admin/users");
}

export async function resetUserPassword(id: string, formData: FormData) {
    await requireAdmin();
    const newPassword = formData.get("password") as string;

    if (!newPassword || newPassword.length < 8) {
        return { error: "Password must be at least 8 characters long" };
    }

    try {
        // Use Better Auth's internal password hashing
        const ctx = await auth.$context;
        const hashedPassword = await ctx.password.hash(newPassword);

        const { error } = await supabaseAdmin
            .from("account")
            .update({ password: hashedPassword })
            .eq("user_id", id)
            .eq("provider_id", "credential");
        
        if (error) {
            console.error("Error resetting password:", error);
            return { error: error.message || "Failed to reset password" };
        }
    } catch (error: any) {
        console.error("Error resetting password:", error);
        return { error: error.message || "Failed to reset password" };
    }

    return { success: true };
}

