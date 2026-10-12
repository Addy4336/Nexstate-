import { betterAuth } from "better-auth";
import { date, z } from "zod";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins";
import { Pool } from "pg";

export const auth = betterAuth({
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false,
        },
    }),
    plugins: [
        admin({
            defaultRole: "user",
            adminRole: "admin",
        }),
    ],
    emailAndPassword: {
        enabled: true,
        // Staff are provisioned via inviteUser; no public self-registration
        disableSignUp: true,
    },
    user: {
        modelName: "user",
        fields: {
            emailVerified: "email_verified",
            createdAt: "created_at",
            updatedAt: "updated_at",
        },
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "user",
                input: false, // clients can never set their own role
            },
        },
    },
    session: {
        modelName: "session",
        fields: {
            expiresAt: "expires_at",
            createdAt: "created_at",
            updatedAt: "updated_at",
            ipAddress: "ip_address",
            userAgent: "user_agent",
            userId: "user_id",
        }
    },
    account: {
        modelName: "account",
        fields: {
            accountId: "account_id",
            providerId: "provider_id",
            userId: "user_id",
            accessToken: "access_token",
            refreshToken: "refresh_token",
            idToken: "id_token",
            accessTokenExpiresAt: "access_token_expires_at",
            refreshTokenExpiresAt: "refresh_token_expires_at",
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    },
    verification: {
        modelName: "verification",
        fields: {
            expiresAt: "expires_at",
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    },
    secret: process.env.BETTER_AUTH_SECRET 
});
