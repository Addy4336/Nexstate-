import { brand } from "@nexstate/brand";
import { supabaseAdmin } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getPaymentStatusInfo } from "@/lib/totalpay";
import { DollarSign, TrendingUp, Clock, XCircle, CheckCircle } from "lucide-react";

export const metadata = {
    title: `Payments - ${brand.name} Admin`,
    description: "Manage payment transactions",
};

async function getPaymentStats() {
    const { data: payments } = await supabaseAdmin
        .from("payments")
        .select("amount, status");

    const stats = {
        total_payments: payments?.length || 0,
        total_revenue: payments?.reduce((sum, p) => sum + (Number(p.amount) || 0), 0) || 0,
        successful_payments: payments?.filter(p => p.status === 'success').length || 0,
        pending_payments: payments?.filter(p => p.status === 'pending').length || 0,
        failed_payments: payments?.filter(p => p.status === 'failed').length || 0,
        successful_revenue: payments
            ?.filter(p => p.status === 'success')
            .reduce((sum, p) => sum + (Number(p.amount) || 0), 0) || 0,
    };

    return stats;
}

async function getRecentPayments() {
    const { data: payments } = await supabaseAdmin
        .from("payments")
        .select(`
            *,
            property:property_id (
                id,
                title,
                slug
            )
        `)
        .order("created_at", { ascending: false })
        .limit(50);

    return payments || [];
}

export default async function PaymentsPage() {
    const [stats, payments] = await Promise.all([
        getPaymentStats(),
        getRecentPayments(),
    ]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
                <p className="text-muted-foreground">
                    Manage and monitor payment transactions
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${stats.successful_revenue.toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            From {stats.successful_payments} successful payments
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Successful</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {stats.successful_payments}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Completed transactions
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending</CardTitle>
                        <Clock className="h-4 w-4 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-yellow-600">
                            {stats.pending_payments}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Awaiting confirmation
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Failed</CardTitle>
                        <XCircle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600">
                            {stats.failed_payments}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Unsuccessful attempts
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Payments Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Payments</CardTitle>
                    <CardDescription>
                        All payment transactions from TotalPay gateway
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {payments.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">No payments yet</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {payments.map((payment) => {
                                const statusInfo = getPaymentStatusInfo(payment.status);
                                const statusColor = {
                                    green: 'bg-green-100 text-green-800 border-green-200',
                                    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
                                    red: 'bg-red-100 text-red-800 border-red-200',
                                    orange: 'bg-orange-100 text-orange-800 border-orange-200',
                                    blue: 'bg-blue-100 text-blue-800 border-blue-200',
                                    gray: 'bg-gray-100 text-gray-800 border-gray-200',
                                }[statusInfo.color] || 'bg-gray-100 text-gray-800 border-gray-200';

                                return (
                                    <div
                                        key={payment.id}
                                        className="flex items-start justify-between border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="space-y-1 flex-1">
                                            <div className="flex items-center gap-3">
                                                <p className="font-semibold">{payment.user_name}</p>
                                                <Badge className={statusColor} variant="outline">
                                                    {statusInfo.label}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {payment.user_email}
                                            </p>
                                            <p className="text-xs font-mono text-muted-foreground">
                                                Order: {payment.order_number}
                                            </p>
                                            {payment.property && (
                                                <p className="text-xs text-muted-foreground">
                                                    Property: {payment.property.title}
                                                </p>
                                            )}
                                            {payment.check_in_date && (
                                                <p className="text-xs text-muted-foreground">
                                                    Check-in: {new Date(payment.check_in_date).toLocaleDateString()} - 
                                                    Check-out: {new Date(payment.check_out_date).toLocaleDateString()}
                                                </p>
                                            )}
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(payment.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-lg">
                                                ${Number(payment.amount).toFixed(2)}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {payment.currency}
                                            </p>
                                            {payment.totalpay_transaction_id && (
                                                <p className="text-xs font-mono text-muted-foreground mt-1">
                                                    TXN: {payment.totalpay_transaction_id.substring(0, 12)}...
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
