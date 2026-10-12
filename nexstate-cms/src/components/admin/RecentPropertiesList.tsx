"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Property } from "@/types/property";

interface RecentPropertiesListProps {
    properties: Property[];
}

export function RecentPropertiesList({ properties }: RecentPropertiesListProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
        >
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Properties</CardTitle>
                    <Link href="/admin/properties">
                        <Button variant="ghost" size="sm">
                            View All
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {properties.length > 0 ? (
                            properties.map((property) => (
                                <div
                                    key={property.id}
                                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-muted/50 gap-4 sm:gap-0"
                                >
                                    <div>
                                        <p className="font-medium line-clamp-1">{property.title}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {property.location}
                                        </p>
                                    </div>
                                    <div className="text-left sm:text-right">
                                        <p className="font-medium">
                                            AED {property.price.toLocaleString()}/mo
                                        </p>
                                        <span
                                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${property.status === "rented"
                                                ? "bg-chart-2/10 text-chart-2"
                                                : property.status === "available"
                                                    ? "bg-chart-1/10 text-chart-1"
                                                    : "bg-chart-5/10 text-chart-5"
                                                }`}
                                        >
                                            {property.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-muted-foreground py-4">No recent properties</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
