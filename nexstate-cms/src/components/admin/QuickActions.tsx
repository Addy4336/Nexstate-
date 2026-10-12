"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    Building2,
    Users,
    Eye,
    Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function QuickActions() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="h-full"
        >
            <Card className="h-full flex flex-col">
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Link href="/admin/properties/new" className="block">
                        <Button className="w-full justify-start gap-2" variant="outline">
                            <Building2 className="w-4 h-4" />
                            Add New Property
                        </Button>
                    </Link>
                    <Link href="/admin/users/new" className="block">
                        <Button className="w-full justify-start gap-2" variant="outline">
                            <Users className="w-4 h-4" />
                            Add New Tenant
                        </Button>
                    </Link>
                    <Link href="/admin/properties" className="block">
                        <Button className="w-full justify-start gap-2" variant="outline">
                            <Calendar className="w-4 h-4" />
                            Schedule Viewing
                        </Button>
                    </Link>
                    <Link href="/admin/properties" className="block">
                        <Button className="w-full justify-start gap-2" variant="outline">
                            <Eye className="w-4 h-4" />
                            View Reports
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </motion.div>
    );
}
