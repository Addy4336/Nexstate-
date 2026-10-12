import { supabaseAdmin } from "@/lib/db";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Plus,
    MoreHorizontal,
    Shield,
    User,
    CheckCircle2,
    XCircle,
    Info,
    Mail
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { requireAdmin } from "@/lib/auth-utils";
import { formatDistanceToNow } from "date-fns";

async function getUsers() {
    const { data, error } = await supabaseAdmin
        .from("user")
        .select("id, name, email, role, created_at, email_verified")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching users:", error);
        return [];
    }

    return data || [];
}

export default async function UsersPage() {
    // Verify admin access
    await requireAdmin();

    const users = await getUsers();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">Users</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage admin access and user roles.
                    </p>
                </div>
                <Link href="/admin/users/new">
                    <Button size="sm" className="h-9">
                        <Plus className="mr-2 h-4 w-4" /> Add User
                    </Button>
                </Link>
            </div>

            <Card className="border shadow-sm bg-card">
                <CardHeader className="px-6 pt-6 pb-2">
                    <CardTitle className="text-lg font-semibold tracking-tight">All Users</CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">
                        A list of all users with access to the admin panel.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[300px] pl-6 uppercase text-xs font-bold tracking-wider text-muted-foreground/70">User</TableHead>
                                <TableHead className="w-[150px] uppercase text-xs font-bold tracking-wider text-muted-foreground/70">Role</TableHead>
                                <TableHead className="w-[150px] uppercase text-xs font-bold tracking-wider text-muted-foreground/70">Status</TableHead>
                                <TableHead className="w-[150px] uppercase text-xs font-bold tracking-wider text-muted-foreground/70">Joined</TableHead>
                                <TableHead className="w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id} className="group hover:bg-muted/50 transition-colors">
                                    <TableCell className="pl-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9 border border-border/50">
                                                <AvatarFallback className="bg-primary/5 text-primary text-xs font-medium">
                                                    {user.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col gap-0.5">
                                                <span className="font-medium text-sm text-foreground">
                                                    {user.name || "Unknown User"}
                                                </span>
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Mail className="w-3 h-3 opacity-70" />
                                                    {user.email}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={`
                                                capitalize px-2 py-0.5 h-6 text-xs font-medium border-0
                                                ${user.role === 'admin'
                                                    ? 'bg-purple-500/10 text-purple-700 hover:bg-purple-500/20'
                                                    : 'bg-slate-500/10 text-slate-700 hover:bg-slate-500/20'}
                                            `}
                                        >
                                            {user.role === 'admin' ? (
                                                <Shield className="w-3 h-3 mr-1.5" />
                                            ) : (
                                                <User className="w-3 h-3 mr-1.5" />
                                            )}
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {user.email_verified ? (
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded-full">
                                                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 bg-amber-50 w-fit px-2 py-0.5 rounded-full">
                                                <XCircle className="w-3.5 h-3.5" /> Pending
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-xs">
                                        {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                                    </TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="flex items-start gap-3 p-4 rounded-xl border border-dashed border-border text-sm hover:bg-muted/30 transition-colors">
                <Info className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                    <p className="font-medium text-foreground">User Management Tip</p>
                    <p className="text-muted-foreground leading-relaxed">
                        To manually onboard a new user without sending an invite, you can use the
                        <code className="bg-muted px-1.5 py-0.5 rounded mx-1.5 text-foreground font-mono text-xs font-medium">/admin/setup</code>
                        page. We recommend doing this in an Incognito window to maintain your current session.
                    </p>
                </div>
            </div>
        </div>
    );
}
