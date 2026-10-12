"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const [payment, setPayment] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const orderNumber = searchParams.get("order_number") || 
                          sessionStorage.getItem("nexstate_payment_order");
        
        console.log('Success page - Order number:', orderNumber);
        
        if (orderNumber) {
            // Fetch payment details
            fetch(`http://localhost:3001/api/payments/${orderNumber}`)
                .then(res => res.json())
                .then(data => {
                    console.log('Payment API response:', data);
                    
                    if (data.success && data.payment) {
                        setPayment(data.payment);
                        // Clear session storage
                        sessionStorage.removeItem("nexstate_payment_order");
                    } else {
                        setError(data.error || "Payment not found");
                    }
                    setLoading(false);
                })
                .catch(err => {
                    console.error("Failed to fetch payment:", err);
                    setError("Failed to load payment details");
                    setLoading(false);
                });
        } else {
            setError("No order number provided");
            setLoading(false);
        }
    }, [searchParams]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container max-w-2xl mx-auto px-4 py-16">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-red-600">Error</CardTitle>
                        <CardDescription>{error}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/">Go Home</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container max-w-3xl mx-auto px-4 py-16">
            <div className="text-center space-y-6">
                <CheckCircle2 className="h-20 w-20 text-green-600 mx-auto" />
                <h1 className="text-4xl font-bold text-gray-900">Payment Successful!</h1>
                <p className="text-lg text-gray-600">
                    Thank you for your payment. Your transaction has been completed successfully.
                </p>

                {payment && (
                    <Card className="text-left mt-8">
                        <CardHeader>
                            <CardTitle>Payment Details</CardTitle>
                            <CardDescription>
                                Order Number: <span className="font-mono font-semibold">{payment.order_number}</span>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="text-gray-600">Amount Paid:</div>
                                <div className="font-semibold text-green-600">
                                    {Number(payment.amount).toFixed(2)} {payment.currency || 'AED'}
                                </div>
                                
                                <div className="text-gray-600">Status:</div>
                                <div className="flex items-center gap-2">
                                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium capitalize">
                                        {payment.status}
                                    </span>
                                </div>
                                
                                <div className="text-gray-600">Payment Date:</div>
                                <div>{new Date(payment.created_at).toLocaleString()}</div>
                                
                                {payment.totalpay_transaction_id && (
                                    <>
                                        <div className="text-gray-600">Transaction ID:</div>
                                        <div className="font-mono text-xs">
                                            {payment.totalpay_transaction_id}
                                        </div>
                                    </>
                                )}
                            </div>

                            {payment.check_in_date && payment.check_out_date && (
                                <div className="border-t pt-4 mt-4">
                                    <h3 className="font-semibold mb-3 text-gray-900">Booking Details</h3>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div className="text-gray-600">Check-in:</div>
                                        <div className="font-medium">
                                            {new Date(payment.check_in_date).toLocaleDateString()}
                                        </div>
                                        
                                        <div className="text-gray-600">Check-out:</div>
                                        <div className="font-medium">
                                            {new Date(payment.check_out_date).toLocaleDateString()}
                                        </div>
                                        
                                        {payment.guests && (
                                            <>
                                                <div className="text-gray-600">Guests:</div>
                                                <div className="font-medium">{payment.guests}</div>
                                            </>
                                        )}
                                        
                                        {payment.property && (
                                            <>
                                                <div className="text-gray-600">Property:</div>
                                                <div className="font-medium">{payment.property.title}</div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="bg-blue-50 border border-blue-200 rounded p-4 mt-4">
                                <p className="text-sm text-blue-800">
                                    <strong>Next Steps:</strong> You will receive a confirmation email shortly with all the booking details.
                                    Our team will contact you within 24 hours to finalize your reservation.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="flex gap-4 justify-center pt-6">
                    <Button asChild size="lg">
                        <Link href="/properties">Browse More Properties</Link>
                    </Button>
                    <Button variant="outline" asChild size="lg">
                        <Link href="/">Go Home</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        }>
            <PaymentSuccessContent />
        </Suspense>
    );
}
