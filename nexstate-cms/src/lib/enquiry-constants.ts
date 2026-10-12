/**
 * Enquiry constants - safe to import in client components
 */

export const ENQUIRY_STATUSES = [
    { value: 'new', label: 'New', color: 'bg-blue-500/10 text-blue-600 border-blue-500/20' },
    { value: 'contacted', label: 'Contacted', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-purple-500/10 text-purple-600 border-purple-500/20' },
    { value: 'converted', label: 'Converted', color: 'bg-green-500/10 text-green-600 border-green-500/20' },
    { value: 'closed', label: 'Closed', color: 'bg-gray-500/10 text-gray-600 border-gray-500/20' },
] as const;

export type EnquiryStatus = typeof ENQUIRY_STATUSES[number]['value'];
