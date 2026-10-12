"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface PaymentButtonProps {
    propertyId?: string;
    amount: number;
    customerEmail: string;
    customerName: string;
    customerPhone?: string;
    checkInDate?: string;
    checkOutDate?: string;
    guests?: number;
    enquiryId?: string;
    description?: string;
    className?: string;
    children?: React.ReactNode;
    disabled?: boolean;
}

export function PaymentButton({
    propertyId,
    amount,
    customerEmail,
    customerName,
    customerPhone,
    checkInDate,
    checkOutDate,
    guests,
    enquiryId,
    description,
    className,
    children = "Proceed to Payment",
    disabled = false,
}: PaymentButtonProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePayment = async () => {
        try {
            setLoading(true);
            setError(null);

            // Validate required fields
            if (!amount || !customerEmail || !customerName) {
                throw new Error('Missing required payment information');
            }

            console.log('Creating payment session...', {
                amount,
                customerEmail,
                customerName,
            });

            // Call backend API to create payment session
            const response = await fetch('http://localhost:3001/api/payments/create-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    propertyId,
                    amount,
                    customerEmail,
                    customerName,
                    customerPhone,
                    checkInDate,
                    checkOutDate,
                    guests,
                    enquiryId,
                    description,
                }),
            });

            const data = await response.json();
            
            console.log('Backend response:', data);

            if (!response.ok || !data.success) {
                const errorMsg = data.error || data.message || 'Failed to create payment session';
                console.error('Payment creation failed:', errorMsg);
                throw new Error(errorMsg);
            }

            console.log('Payment session created:', {
                order_number: data.order_number,
                redirect_url: data.redirect_url,
            });

            // Redirect to TotalPay checkout page
            if (data.redirect_url) {
                // Store order number in session storage for later reference
                sessionStorage.setItem('nexstate_payment_order', data.order_number);
                
                // Redirect to TotalPay
                window.location.href = data.redirect_url;
            } else {
                throw new Error('No redirect URL received from payment gateway');
            }
        } catch (err: any) {
            console.error('Payment error:', err);
            setError(err.message || 'Failed to initiate payment');
            setLoading(false);
        }
    };

    return (
        <div className="space-y-2">
            <Button
                onClick={handlePayment}
                disabled={loading || disabled}
                className={className}
                size="lg"
            >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? 'Processing...' : children}
            </Button>
            {error && (
                <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                    {error}
                </p>
            )}
        </div>
    );
}
