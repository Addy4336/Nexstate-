import { brand } from "@nexstate/brand";
import { supabaseAdmin } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Users, Calendar, DollarSign, Mail, Phone, MapPin } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
    title: `Rentals & Tenants - ${brand.name} Admin`,
    description: "Manage property rentals and tenant information",
};

async function getRentalStats() {
    // First, try to get basic payment data without join
    const { data: allPayments, error: basicError } = await supabaseAdmin
        .from("payments")
        .select("*")
        .eq("status", "success")
        .not("check_in_date", "is", null);

    if (basicError) {
        console.error("Error fetching basic payments:", basicError);
    } else {
        console.log("Basic payments count:", allPayments?.length);
    }

    // Get all successful payments with check-in dates (property bookings)
    const { data: rentals, error } = await supabaseAdmin
        .from("payments")
        .select(`
            *,
            property:property_id (
                id,
                title,
                slug,
                status
            )
        `)
        .eq("status", "success")
        .not("check_in_date", "is", null);

    if (error) {
        console.error("Error fetching rentals with join:", error);
        // Fallback to basic data if join fails
        if (allPayments) {
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            
            const activeRentals = allPayments.filter(r => {
                if (!r.check_out_date) return false;
                const checkoutDate = new Date(r.check_out_date);
                checkoutDate.setHours(0, 0, 0, 0);
                return checkoutDate >= now;
            });

            const expiredRentals = allPayments.filter(r => {
                if (!r.check_out_date) return false;
                const checkoutDate = new Date(r.check_out_date);
                checkoutDate.setHours(0, 0, 0, 0);
                return checkoutDate < now;
            });

            const totalRevenue = allPayments.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
            const uniqueTenants = new Set(allPayments.map(r => r.user_email).filter(Boolean));
            const activePropertiesWithId = activeRentals.filter(r => r.property_id);
            const uniqueActiveProperties = new Set(activePropertiesWithId.map(r => r.property_id));

            return {
                total_rentals: allPayments.length,
                active_rentals: activeRentals.length,
                expired_rentals: expiredRentals.length,
                total_revenue: totalRevenue,
                unique_tenants: uniqueTenants.size,
                active_properties: uniqueActiveProperties.size,
            };
        }

        return {
            total_rentals: 0,
            active_rentals: 0,
            expired_rentals: 0,
            total_revenue: 0,
            unique_tenants: 0,
            active_properties: 0,
        };
    }

    console.log("Total rentals fetched:", rentals?.length);
    console.log("Sample rental:", rentals?.[0]);

    const now = new Date();
    now.setHours(0, 0, 0, 0); // Reset to start of day for accurate comparison

    const activeRentals = rentals?.filter(rental => {
        if (!rental.check_out_date) return false;
        const checkoutDate = new Date(rental.check_out_date);
        checkoutDate.setHours(0, 0, 0, 0);
        return checkoutDate >= now;
    }) || [];

    const expiredRentals = rentals?.filter(rental => {
        if (!rental.check_out_date) return false;
        const checkoutDate = new Date(rental.check_out_date);
        checkoutDate.setHours(0, 0, 0, 0);
        return checkoutDate < now;
    }) || [];

    console.log("Active rentals:", activeRentals.length);
    console.log("Expired rentals:", expiredRentals.length);

    const totalRevenue = rentals?.reduce((sum, r) => sum + (Number(r.amount) || 0), 0) || 0;

    // Get unique tenants (by email)
    const uniqueTenants = new Set(rentals?.map(r => r.user_email).filter(Boolean));

    // Get unique active properties (only count those with property_id)
    const activePropertiesWithId = activeRentals.filter(r => r.property_id);
    const uniqueActiveProperties = new Set(activePropertiesWithId.map(r => r.property_id));

    return {
        total_rentals: rentals?.length || 0,
        active_rentals: activeRentals.length,
        expired_rentals: expiredRentals.length,
        total_revenue: totalRevenue,
        unique_tenants: uniqueTenants.size,
        active_properties: uniqueActiveProperties.size,
    };
}

async function getActiveRentals() {
    // First try with join
    const { data: rentals, error } = await supabaseAdmin
        .from("payments")
        .select(`
            *,
            property:property_id (
                id,
                title,
                slug,
                status,
                location,
                images
            )
        `)
        .eq("status", "success")
        .not("check_in_date", "is", null)
        .order("check_in_date", { ascending: false });

    if (error) {
        console.error("Error fetching rentals list with join:", error);
        
        // Try without join as fallback
        const { data: basicRentals, error: basicError } = await supabaseAdmin
            .from("payments")
            .select("*")
            .eq("status", "success")
            .not("check_in_date", "is", null)
            .order("check_in_date", { ascending: false });

        if (basicError) {
            console.error("Error fetching basic rentals list:", basicError);
            return { active: [], past: [] };
        }

        // Use basic data without property info
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const active = basicRentals?.filter(rental => {
            if (!rental.check_out_date) return false;
            const checkoutDate = new Date(rental.check_out_date);
            checkoutDate.setHours(0, 0, 0, 0);
            return checkoutDate >= now;
        }) || [];

        const past = basicRentals?.filter(rental => {
            if (!rental.check_out_date) return true;
            const checkoutDate = new Date(rental.check_out_date);
            checkoutDate.setHours(0, 0, 0, 0);
            return checkoutDate < now;
        }) || [];

        console.log("Using basic data - Active:", active.length, "Past:", past.length);

        return { active, past };
    }

    console.log("Rentals list fetched:", rentals?.length);

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // Separate active and past rentals
    const active = rentals?.filter(rental => {
        if (!rental.check_out_date) return false;
        const checkoutDate = new Date(rental.check_out_date);
        checkoutDate.setHours(0, 0, 0, 0);
        return checkoutDate >= now;
    }) || [];

    const past = rentals?.filter(rental => {
        if (!rental.check_out_date) return true;
        const checkoutDate = new Date(rental.check_out_date);
        checkoutDate.setHours(0, 0, 0, 0);
        return checkoutDate < now;
    }) || [];

    console.log("Split - Active:", active.length, "Past:", past.length);

    return { active, past };
}

export default async function RentalsPage() {
    const [stats, { active, past }] = await Promise.all([
        getRentalStats(),
        getActiveRentals(),
    ]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Rentals & Tenants</h1>
                <p className="text-muted-foreground">
                    Manage property rentals and tenant information
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Rentals</CardTitle>
                        <Home className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {stats.active_rentals}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Currently occupied
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Properties</CardTitle>
                        <MapPin className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">
                            {stats.active_properties}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Properties rented out
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tenants</CardTitle>
                        <Users className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">
                            {stats.unique_tenants}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Unique customers
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-600">
                            ${stats.total_revenue.toFixed(2)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            From {stats.total_rentals} rentals
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Past Rentals</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.expired_rentals}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Completed bookings
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Active Rentals */}
            <Card>
                <CardHeader>
                    <CardTitle>Active Rentals</CardTitle>
                    <CardDescription>
                        Properties currently occupied by tenants
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {active.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Home className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No active rentals at the moment</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {active.map((rental) => (
                                <div
                                    key={rental.id}
                                    className="border rounded-lg p-4 hover:border-primary transition-colors"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                                        {/* Property Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1">
                                                    {rental.property?.slug && rental.property?.id ? (
                                                        <Link
                                                            href={`/properties/${rental.property.slug}/${rental.property.id}`}
                                                            className="text-lg font-semibold hover:text-primary transition-colors"
                                                            target="_blank"
                                                        >
                                                            {rental.property?.title || "Property"}
                                                        </Link>
                                                    ) : (
                                                        <div className="text-lg font-semibold">
                                                            Rental Booking
                                                            {rental.property_id && (
                                                                <span className="text-sm text-muted-foreground ml-2">
                                                                    (Property ID: {rental.property_id})
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                    {rental.property?.location ? (
                                                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                                            <MapPin className="w-3 h-3" />
                                                            {rental.property.location}
                                                        </p>
                                                    ) : (
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            Order: {rental.order_number}
                                                        </p>
                                                    )}
                                                </div>
                                                <Badge variant="default" className="bg-green-600">
                                                    Active
                                                </Badge>
                                            </div>

                                            {/* Rental Period */}
                                            <div className="flex flex-wrap gap-4 text-sm mb-3">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                                    <span className="text-muted-foreground">Check-in:</span>
                                                    <span className="font-medium">
                                                        {rental.check_in_date
                                                            ? format(new Date(rental.check_in_date), "MMM dd, yyyy")
                                                            : "N/A"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                                    <span className="text-muted-foreground">Check-out:</span>
                                                    <span className="font-medium">
                                                        {rental.check_out_date
                                                            ? format(new Date(rental.check_out_date), "MMM dd, yyyy")
                                                            : "N/A"}
                                                    </span>
                                                </div>
                                                {rental.guests && (
                                                    <div className="flex items-center gap-1">
                                                        <Users className="w-4 h-4 text-muted-foreground" />
                                                        <span className="font-medium">{rental.guests} guests</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Tenant Info */}
                                            <div className="bg-muted/50 rounded-lg p-3">
                                                <h4 className="text-sm font-semibold mb-2">Tenant Information</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Users className="w-4 h-4 text-muted-foreground" />
                                                        <span className="font-medium">{rental.user_name || "N/A"}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="w-4 h-4 text-muted-foreground" />
                                                        <a
                                                            href={`mailto:${rental.user_email}`}
                                                            className="text-primary hover:underline"
                                                        >
                                                            {rental.user_email}
                                                        </a>
                                                    </div>
                                                    {rental.user_phone && (
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="w-4 h-4 text-muted-foreground" />
                                                            <a
                                                                href={`tel:${rental.user_phone}`}
                                                                className="text-primary hover:underline"
                                                            >
                                                                {rental.user_phone}
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Payment Info */}
                                        <div className="lg:w-48 bg-muted/30 rounded-lg p-3">
                                            <div className="text-sm text-muted-foreground mb-1">Payment</div>
                                            <div className="text-2xl font-bold text-green-600">
                                                ${Number(rental.amount).toFixed(2)}
                                            </div>
                                            <div className="text-xs text-muted-foreground mt-1">
                                                Order: {rental.order_number}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Paid: {format(new Date(rental.paid_at || rental.created_at), "MMM dd, yyyy")}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Past Rentals */}
            {past.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Past Rentals</CardTitle>
                        <CardDescription>
                            Completed rental bookings
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {past.slice(0, 10).map((rental) => (
                                <div
                                    key={rental.id}
                                    className="border rounded-lg p-4 opacity-75"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                                        {/* Property Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1">
                                                    {rental.property?.slug && rental.property?.id ? (
                                                        <Link
                                                            href={`/properties/${rental.property.slug}/${rental.property.id}`}
                                                            className="text-lg font-semibold hover:text-primary transition-colors"
                                                            target="_blank"
                                                        >
                                                            {rental.property?.title || "Property"}
                                                        </Link>
                                                    ) : (
                                                        <div className="text-lg font-semibold">
                                                            Rental Booking
                                                            {rental.property_id && (
                                                                <span className="text-sm text-muted-foreground ml-2">
                                                                    (Property ID: {rental.property_id})
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <Badge variant="outline">
                                                    Completed
                                                </Badge>
                                            </div>

                                            {/* Rental Period */}
                                            <div className="flex flex-wrap gap-4 text-sm mb-2">
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                                    <span className="font-medium">
                                                        {rental.check_in_date && rental.check_out_date
                                                            ? `${format(new Date(rental.check_in_date), "MMM dd")} - ${format(new Date(rental.check_out_date), "MMM dd, yyyy")}`
                                                            : "N/A"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Tenant Info - Compact */}
                                            <div className="text-sm text-muted-foreground">
                                                {rental.user_name} • {rental.user_email}
                                            </div>
                                        </div>

                                        {/* Payment Info */}
                                        <div className="lg:w-32 text-right">
                                            <div className="text-lg font-bold">
                                                ${Number(rental.amount).toFixed(2)}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {format(new Date(rental.paid_at || rental.created_at), "MMM dd, yyyy")}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
