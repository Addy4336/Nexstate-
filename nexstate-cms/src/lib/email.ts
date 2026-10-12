import { brand } from "@nexstate/brand";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface InviteUserEmailParams {
    to: string;
    name: string;
    email: string;
    password: string;
    role: string;
    loginUrl: string;
}

export async function sendUserInviteEmail({
    to,
    name,
    email,
    password,
    role,
    loginUrl,
}: InviteUserEmailParams) {
    const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

    try {
        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || `${brand.name} <noreply@${new URL(brand.siteUrl).hostname}>`,
            to: [to],
            subject: `Welcome to the ${brand.name} CMS - Your Account Details`,
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to the ${brand.name} CMS</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0284c7 0%, #38bdf8 100%); padding: 32px 40px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                                ${brand.wordmark.primary}<span style="color: #0f172a;">${brand.wordmark.accent}</span>
                            </h1>
                            <p style="margin: 8px 0 0; color: #ffffff; font-size: 14px; opacity: 0.9;">
                                Content Management System & Real Estate AI
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 16px; color: #1a1a2e; font-size: 24px; font-weight: 600;">
                                Welcome, ${name}! 🎉
                            </h2>
                            <p style="margin: 0 0 24px; color: #64748b; font-size: 16px; line-height: 1.6;">
                                You've been invited to join the  CMS as a <strong style="color: #0284c7;">${roleLabel}</strong>. 
                                Below are your login credentials to access the admin dashboard.
                            </p>
                            
                            <!-- Credentials Box -->
                            <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px; border: 1px solid #e2e8f0;">
                                <h3 style="margin: 0 0 16px; color: #1a1a2e; font-size: 16px; font-weight: 600;">
                                    Your Login Credentials
                                </h3>
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 80px;">Email:</td>
                                        <td style="padding: 8px 0; color: #1a1a2e; font-size: 14px; font-weight: 500;">${email}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Password:</td>
                                        <td style="padding: 8px 0;">
                                            <code style="background-color: #1a1a2e; color: #38bdf8; padding: 4px 12px; border-radius: 6px; font-size: 14px; font-family: monospace;">${password}</code>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Role:</td>
                                        <td style="padding: 8px 0; color: #1a1a2e; font-size: 14px; font-weight: 500;">${roleLabel}</td>
                                    </tr>
                                </table>
                            </div>
                            
                            <!-- CTA Button -->
                            <div style="text-align: center; margin: 32px 0;">
                                <a href="${loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #0284c7 0%, #38bdf8 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4);">
                                    Login to Dashboard →
                                </a>
                            </div>
                            
                            <!-- Security Note -->
                            <div style="background-color: #fef3c7; border-radius: 8px; padding: 16px; border-left: 4px solid #f59e0b;">
                                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                                    <strong>🔐 Security Tip:</strong> We recommend changing your password after your first login for enhanced security.
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #0f172a; padding: 24px 40px; text-align: center;">
                            <p style="margin: 0 0 8px; color: #94a3b8; font-size: 14px;">
                                © ${new Date().getFullYear()} ${brand.legalName}. All rights reserved.
                            </p>
                            <p style="margin: 0; color: #64748b; font-size: 12px;">
                                This email was sent because you were invited to the ${brand.name} CMS.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
            `,
        });

        if (error) {
            console.error('Error sending email:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error: any) {
        console.error('Error sending email:', error);
        return { success: false, error: error.message };
    }
}

// Generate a secure random password
export function generateSecurePassword(length: number = 12): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const special = '!@#$%^&*';

    const allChars = lowercase + uppercase + numbers + special;

    // Ensure at least one of each type
    let password = '';
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];

    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
}
