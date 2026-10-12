
import { requireStaff } from "@/lib/auth-utils";
import { getEnquiries, getStaffUsers, getEnquiryStats } from "@/lib/enquiries";
import { ENQUIRY_STATUSES } from "@/lib/enquiry-constants";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Mail, Phone, MessageSquare, Users, TrendingUp, CheckCircle, Clock } from "lucide-react";
import { LeadStatusSelect } from "@/components/admin/LeadStatusSelect";
import { LeadAssignSelect } from "@/components/admin/LeadAssignSelect";
import { DeleteLeadButton } from "@/components/admin/DeleteLeadButton";

function getTypeColor(type: string) {
    switch (type) {
        case 'tenant_enquiry': return 'bg-chart-2/10 text-chart-2 border-chart-2/20';
        case 'owner_submission': return 'bg-chart-1/10 text-chart-1 border-chart-1/20';
        case 'general_contact': return 'bg-muted text-muted-foreground border-border';
        default: return 'bg-secondary text-foreground';
    }
}

export default async function LeadsPage() {
    await requireStaff();
    const [enquiries, staffUsers, stats] = await Promise.all([
        getEnquiries(),
        getStaffUsers(),
        getEnquiryStats()
    ]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Lead Management</h1>
                <p className="text-muted-foreground">
                    Track and manage your property enquiries and contact form submissions.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">New Leads</CardTitle>
                        <MessageSquare className="h-4 w-4 text-chart-2" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.new_count}</div>
                        <p className="text-xs text-muted-foreground">Awaiting response</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                        <Clock className="h-4 w-4 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.contacted_count + stats.in_progress_count}</div>
                        <p className="text-xs text-muted-foreground">Being handled</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Converted</CardTitle>
                        <CheckCircle className="h-4 w-4 text-chart-1" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.converted_count}</div>
                        <p className="text-xs text-muted-foreground">Successful conversions</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.total_count}</div>
                        <p className="text-xs text-muted-foreground">All time</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Enquiries</CardTitle>
                    <CardDescription>
                        Manage lead status and assignments. New leads appear first.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {enquiries.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No enquiries yet.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Date</TableHead>
                                    <TableHead>Contact</TableHead>
                                    <TableHead className="w-[120px]">Type</TableHead>
                                    <TableHead>Details</TableHead>
                                    <TableHead className="w-[140px]">Status</TableHead>
                                    <TableHead className="w-[160px]">Assigned To</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {enquiries.map((enquiry) => (
                                    <TableRow key={enquiry.id}>
                                        <TableCell className="whitespace-nowrap text-muted-foreground text-sm">
                                            {formatDistanceToNow(new Date(enquiry.created_at), { addSuffix: true })}
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-medium">{enquiry.name}</div>
                                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                                                <Mail className="w-3 h-3" /> {enquiry.email}
                                            </div>
                                            {enquiry.phone && (
                                                <div className="text-sm text-muted-foreground flex items-center gap-1">
                                                    <Phone className="w-3 h-3" /> {enquiry.phone}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`capitalize text-xs ${getTypeColor(enquiry.type)}`}>
                                                {enquiry.type.replace(/_/g, ' ')}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="max-w-[250px]">
                                            {enquiry.property_title && (
                                                <div className="text-xs font-semibold mb-1 text-primary">
                                                    Re: {enquiry.property_title}
                                                </div>
                                            )}
                                            <div className="text-sm line-clamp-2" title={enquiry.message}>
                                                {enquiry.message}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <LeadStatusSelect
                                                enquiryId={enquiry.id}
                                                currentStatus={enquiry.status}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <LeadAssignSelect
                                                enquiryId={enquiry.id}
                                                currentAssignee={enquiry.assigned_to || null}
                                                staffUsers={staffUsers}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <DeleteLeadButton id={enquiry.id} name={enquiry.name} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
