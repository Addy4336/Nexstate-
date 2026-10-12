"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, User, Mail, Phone, MessageSquare, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface EnquiryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    propertyId: string;
    propertyTitle: string;
    propertyImage?: string;
    propertyLocation?: string;
    bookingData?: {
        checkInDate?: string;
        checkOutDate?: string;
        guests?: number;
        cancellationPolicy?: string;
        totalAmount?: number;
    } | null;
}

export function EnquiryDialog({ isOpen, onClose, propertyId, propertyTitle, propertyImage, propertyLocation, bookingData }: EnquiryDialogProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    React.useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/enquiries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    propertyId: propertyId,
                    propertyTitle: propertyTitle,
                    type: 'tenant_enquiry',
                    propertyDetails: bookingData ? {
                        checkInDate: bookingData.checkInDate,
                        checkOutDate: bookingData.checkOutDate,
                        guests: bookingData.guests,
                        cancellationPolicy: bookingData.cancellationPolicy,
                        totalAmount: bookingData.totalAmount,
                        bookingType: 'reservation',
                    } : null,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Failed to submit enquiry');
            }

            setIsSuccess(true);
            setTimeout(() => {
                onClose();
                setIsSuccess(false);
                setFormData({ name: '', email: '', phone: '', message: '' });
            }, 2000);
        } catch (error) {
            console.error('Error submitting form:', error);
            // Optionally set error state here to show in UI
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    />

                    {/* Dialog */}
                    <motion.div
                        initial={isMobile ? { y: "100%" } : { opacity: 0, scale: 0.95, x: "-50%", y: "-40%" }}
                        animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                        exit={isMobile ? { y: "100%" } : { opacity: 0, scale: 0.95, x: "-50%", y: "-40%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className={`
                            fixed z-[101] bg-background overflow-hidden flex flex-col
                            
                            /* Mobile Styles (Default) - Bottom Sheet */
                            bottom-0 left-0 right-0 w-full rounded-t-3xl border-t border-border shadow-2xl max-h-[90vh]
                            
                            /* Desktop Styles (md+) - Centered Modal */
                            md:bottom-auto md:right-auto md:left-1/2 md:top-1/2 
                            md:w-full md:max-w-md md:rounded-2xl md:border md:shadow-xl md:max-h-[85vh]
                            /* Transform handled by motion animate props for centering on desktop */
                        `}
                    >
                        {/* Mobile Handle */}
                        <div className="md:hidden w-full flex items-center justify-center pt-3 pb-1" onClick={onClose}>
                            <div className="w-12 h-1.5 bg-muted rounded-full"></div>
                        </div>

                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40 shrink-0 bg-background/80 backdrop-blur-xl sticky top-0 z-10">
                            <h2 className="text-lg font-bold tracking-tight">Complete your Request</h2>
                            <button
                                onClick={onClose}
                                className="p-2 -mr-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-all duration-200"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto overscroll-contain bg-background">
                            {isSuccess ? (
                                <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                        <svg
                                            className="w-8 h-8 text-green-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-green-600 mb-1">Enquiry Sent!</h3>
                                        <p className="text-muted-foreground text-sm">We'll get back to you shortly.</p>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex items-center gap-4 p-4 bg-muted/20 border-b border-border/40">
                                        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border border-border/50 shadow-sm bg-muted">
                                            {isOpen && (bookingData || propertyId) ? (
                                                <Image
                                                    src={propertyImage || '/placeholder-property.jpg'}
                                                    alt={propertyTitle}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center bg-muted">
                                                    <MapPin className="h-6 w-6 text-muted-foreground/50" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-0.5">You are booking</p>
                                            <h3 className="text-sm font-bold text-foreground line-clamp-1 leading-tight">{propertyTitle}</h3>
                                            {propertyLocation && (
                                                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 truncate">
                                                    <MapPin className="w-3 h-3 shrink-0" />
                                                    {propertyLocation}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-5">
                                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                            <div className="grid gap-5">
                                                <div className="space-y-1.5 group">
                                                    <label htmlFor="name" className="text-xs font-semibold text-foreground/70 ml-1 group-focus-within:text-primary transition-colors">Full Name</label>
                                                    <div className="relative">
                                                        <div className="absolute left-3.5 top-3.5 text-muted-foreground/50 group-focus-within:text-primary/70 transition-colors">
                                                            <User className="w-4 h-4" />
                                                        </div>
                                                        <input
                                                            id="name"
                                                            required
                                                            type="text"
                                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background/50 ring-offset-background transition-all duration-200 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground/40 text-sm"
                                                            placeholder="e.g. John Doe"
                                                            value={formData.name}
                                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5 group">
                                                    <label htmlFor="email" className="text-xs font-semibold text-foreground/70 ml-1 group-focus-within:text-primary transition-colors">Email Address</label>
                                                    <div className="relative">
                                                        <div className="absolute left-3.5 top-3.5 text-muted-foreground/50 group-focus-within:text-primary/70 transition-colors">
                                                            <Mail className="w-4 h-4" />
                                                        </div>
                                                        <input
                                                            id="email"
                                                            required
                                                            type="email"
                                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background/50 ring-offset-background transition-all duration-200 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground/40 text-sm"
                                                            placeholder="e.g. john@example.com"
                                                            value={formData.email}
                                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5 group">
                                                    <label htmlFor="phone" className="text-xs font-semibold text-foreground/70 ml-1 group-focus-within:text-primary transition-colors">Phone Number</label>
                                                    <div className="relative">
                                                        <div className="absolute left-3.5 top-3.5 text-muted-foreground/50 group-focus-within:text-primary/70 transition-colors">
                                                            <Phone className="w-4 h-4" />
                                                        </div>
                                                        <input
                                                            id="phone"
                                                            required
                                                            type="tel"
                                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background/50 ring-offset-background transition-all duration-200 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground/40 text-sm"
                                                            placeholder="e.g. +971 50 123 4567"
                                                            value={formData.phone}
                                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-1.5 group">
                                                    <label htmlFor="message" className="text-xs font-semibold text-foreground/70 ml-1 group-focus-within:text-primary transition-colors">Message (Optional)</label>
                                                    <div className="relative">
                                                        <div className="absolute left-3.5 top-3.5 text-muted-foreground/50 group-focus-within:text-primary/70 transition-colors">
                                                            <MessageSquare className="w-4 h-4" />
                                                        </div>
                                                        <textarea
                                                            id="message"
                                                            rows={3}
                                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background/50 ring-offset-background transition-all duration-200 focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-muted-foreground/40 resize-none text-sm"
                                                            placeholder="Anything else we should know?"
                                                            value={formData.message}
                                                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full h-12 text-base rounded-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 hover:scale-[1.01] active:scale-[0.98] mt-2"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                        Submitting...
                                                    </>
                                                ) : (
                                                    'Confirm Reservation'
                                                )}
                                            </Button>
                                        </form>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        {!isSuccess && (
                            <div className="p-4 bg-muted/20 text-center text-[10px] text-muted-foreground/60 border-t border-border/40 shrink-0 pb-8 md:pb-4 safe-area-bottom">
                                By submitting, you agree to our Terms of Service and Privacy Policy.
                            </div>
                        )}
                    </motion.div>
                </>
            )
            }
        </AnimatePresence >
    );
}
