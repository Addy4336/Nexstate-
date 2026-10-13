export type StatusColor = "green" | "yellow" | "red" | "orange" | "blue" | "gray";

/** Display label and colour for a payments.status value. */
export function getPaymentStatusInfo(status: string | null | undefined): { label: string; color: StatusColor } {
    switch (status) {
        case "success":
            return { label: "Paid", color: "green" };
        case "pending":
            return { label: "Pending", color: "yellow" };
        case "failed":
            return { label: "Failed", color: "red" };
        case "cancelled":
            return { label: "Cancelled", color: "gray" };
        default:
            return { label: status || "Unknown", color: "gray" };
    }
}