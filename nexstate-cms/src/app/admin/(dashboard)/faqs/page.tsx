import { supabaseAdmin } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { requireStaff } from "@/lib/auth-utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteFaqButton } from "@/components/admin/DeleteFaqButton";
import { ToggleFaqButton } from "@/components/admin/ToggleFaqButton";

async function getFaqs() {
    const { data, error } = await supabaseAdmin
        .from("faq")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching FAQs:", error);
        return [];
    }

    return data || [];
}

function getCategoryLabel(category: string) {
    const labels: Record<string, string> = {
        "general": "General",
        "properties": "Properties",
        "investment": "Investment",
        "buying": "Buying",
        "selling": "Selling",
        "renting": "Renting",
        "legal": "Legal",
        "finance": "Finance",
    };
    return labels[category] || category;
}

function getCategoryColor(category: string) {
    const colors: Record<string, string> = {
        "general": "bg-gray-100 text-gray-700",
        "properties": "bg-blue-100 text-blue-700",
        "investment": "bg-green-100 text-green-700",
        "buying": "bg-purple-100 text-purple-700",
        "selling": "bg-orange-100 text-orange-700",
        "renting": "bg-cyan-100 text-cyan-700",
        "legal": "bg-red-100 text-red-700",
        "finance": "bg-amber-100 text-amber-700",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
}

export default async function FaqsPage() {
    await requireStaff();

    const faqs = await getFaqs();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">FAQs</h1>
                    <p className="text-muted-foreground">
                        Manage frequently asked questions.
                    </p>
                </div>
                <Link href="/admin/faqs/new">
                    <Button className="btn-primary">
                        <Plus className="mr-2 h-4 w-4" /> Add FAQ
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All FAQs ({faqs.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    {faqs.length === 0 ? (
                        <div className="py-12 text-center text-muted-foreground">
                            <p>No FAQs found.</p>
                            <Link href="/admin/faqs/new" className="text-accent hover:underline mt-2 inline-block">
                                Create your first FAQ
                            </Link>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">#</TableHead>
                                    <TableHead>Question</TableHead>
                                    <TableHead className="w-[120px]">Category</TableHead>
                                    <TableHead className="w-[100px]">Status</TableHead>
                                    <TableHead className="w-[150px] text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {faqs.map((faq, index) => (
                                    <TableRow key={faq.id}>
                                        <TableCell className="font-medium text-muted-foreground">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <p className="font-medium line-clamp-1">{faq.question}</p>
                                                <p className="text-sm text-muted-foreground line-clamp-1">
                                                    {faq.answer.substring(0, 80)}...
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getCategoryColor(faq.category)}>
                                                {getCategoryLabel(faq.category)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <ToggleFaqButton
                                                id={faq.id}
                                                isActive={faq.is_active}
                                            />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/admin/faqs/${faq.id}/edit`}>
                                                    <Button variant="outline" size="sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <DeleteFaqButton id={faq.id} question={faq.question} />
                                            </div>
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
