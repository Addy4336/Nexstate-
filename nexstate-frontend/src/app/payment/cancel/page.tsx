"use client";

import { XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaymentCancelPage() {
    return (
        <div className="container max-w-2xl mx-auto px-4 py-16">
            <div className="text-center space-y-6">
                <XCircle className="h-20 w-20 text-orange-600 mx-auto" />
                <h1 className="text-4xl font-bold text-gray-900">Payment Cancelled</h1>
                <p className="text-lg text-gray-600">
                    Your payment was cancelled. No charges were made to your account.
                </p>

                <Card className="text-left mt-8">
                    <CardHeader>
                        <CardTitle>What happened?</CardTitle>
                        <CardDescription>
                            The payment process was cancelled before completion
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-gray-600">
                            Your payment was not processed. This could happen if:
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 ml-4">
                            <li>You clicked the back button or closed the payment window</li>
                            <li>You chose to cancel the transaction</li>
                            <li>The payment session expired</li>
                        </ul>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded p-4 mt-4">
                            <p className="text-sm text-blue-800">
                                <strong>Want to try again?</strong> You can return to the property page and 
                                restart the booking process.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex gap-4 justify-center pt-6">
                    <Button asChild size="lg">
                        <Link href="/properties">Browse Properties</Link>
                    </Button>
                    <Button variant="outline" asChild size="lg">
                        <Link href="/">Go Home</Link>
                    </Button>
                </div>

                <div className="pt-8 border-t">
                    <p className="text-sm text-gray-500">
                        Need help? <Link href="/contact" className="text-blue-600 hover:underline">Contact our support team</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
