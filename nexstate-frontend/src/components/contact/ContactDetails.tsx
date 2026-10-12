'use client';

import { brand } from "@nexstate/brand";
import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface FormData {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    message: string;
}

interface FormStatus {
    type: 'idle' | 'loading' | 'success' | 'error';
    message: string;
}

export default function ContactDetails() {
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        message: '',
    });

    const [status, setStatus] = useState<FormStatus>({
        type: 'idle',
        message: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.firstName || !formData.email || !formData.message) {
            setStatus({
                type: 'error',
                message: 'Please fill in all required fields (First Name, Email, and Message).',
            });
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setStatus({
                type: 'error',
                message: 'Please enter a valid email address.',
            });
            return;
        }

        setStatus({ type: 'loading', message: '' });

        try {
            const response = await fetch('/api/enquiries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'general_contact',
                    name: `${formData.firstName} ${formData.lastName}`.trim(),
                    email: formData.email,
                    phone: formData.phone || undefined,
                    message: formData.message,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setStatus({
                    type: 'success',
                    message: 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.',
                });
                // Reset form
                setFormData({
                    firstName: '',
                    lastName: '',
                    phone: '',
                    email: '',
                    message: '',
                });
            } else {
                setStatus({
                    type: 'error',
                    message: data.error || 'Something went wrong. Please try again.',
                });
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus({
                type: 'error',
                message: 'Network error. Please check your connection and try again.',
            });
        }
    };

    return (
        <section className="bg-background py-20 md:py-32 relative overflow-hidden">
            {/* Subtle Gradient Background */}
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-secondary/20 via-background to-background -z-10" />

            <div className="container mx-auto px-4 md:px-12">

                {/* Top Header Section */}
                <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
                    <span className="inline-block py-1.5 px-4 rounded-full bg-secondary text-secondary-foreground text-xs md:text-sm font-semibold tracking-widest uppercase mb-6 hover:bg-secondary/80 transition-colors cursor-default">
                        Call To Find Your Luxury Home
                    </span>
                    <h2 className="text-3xl md:text-5xl font-semibold text-foreground leading-tight">
                        We'd love to hear from you
                    </h2>
                    <p className="mt-4 text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
                        Whether you have a question about properties, need assistance, or just want to talk, we are here to help.
                    </p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                    {/* Phone */}
                    {brand.contact.phone && (
                        <div className="flex flex-col items-center text-center p-8 bg-card border border-border/50 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-[#23527C] mb-6 group-hover:scale-110 transition-transform">
                                <Phone className="w-6 h-6" />
                            </div>
                            <h4 className="text-foreground font-semibold text-lg mb-3">Phone Support</h4>
                            <div className="text-muted-foreground text-sm space-y-1">
                                <p>{brand.contact.phone}</p>
                            </div>
                        </div>
                    )}

                    {/* Email */}
                    {brand.contact.email && (
                        <div className="flex flex-col items-center text-center p-8 bg-card border border-border/50 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-[#23527C] mb-6 group-hover:scale-110 transition-transform">
                                <Mail className="w-6 h-6" />
                            </div>
                            <h4 className="text-foreground font-semibold text-lg mb-3">Email Us</h4>
                            <div className="text-muted-foreground text-sm space-y-1">
                                <p>{brand.contact.email}</p>
                                <p>We reply within 24 hours.</p>
                            </div>
                        </div>
                    )}

                    {/* Address/Visit HQ */}
                    {brand.contact.address && (
                        <div className="flex flex-col items-center text-center p-8 bg-card border border-border/50 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 group">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-[#23527C] mb-6 group-hover:scale-110 transition-transform">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <h4 className="text-foreground font-semibold text-lg mb-3">Visit HQ</h4>
                            <div className="text-muted-foreground text-sm space-y-1">
                                <p>{brand.contact.address}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Form & Map Section */}
                <div className="flex flex-col lg:flex-row shadow-2xl shadow-black/5 rounded-3xl overflow-hidden border border-border/50">

                    {/* Left Form */}
                    <div className={`w-full ${brand.contact.mapEmbedUrl ? "lg:w-1/2" : "lg:w-full"} p-8 md:p-12 lg:p-16 bg-card relative`}>
                        <h3 className="text-3xl font-bold text-foreground mb-2">Send a Message</h3>
                        <p className="text-muted-foreground mb-10">For specific inquiries about property management or partnerships.</p>

                        {/* Status Messages */}
                        {status.type === 'success' && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                <p className="text-green-700 text-sm">{status.message}</p>
                            </div>
                        )}

                        {status.type === 'error' && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <p className="text-red-700 text-sm">{status.message}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="firstName" className="text-sm font-medium text-foreground ml-1">
                                        First Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="firstName"
                                        type="text"
                                        placeholder="John"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        disabled={status.type === 'loading'}
                                        className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground placeholder:text-muted-foreground/40 text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="lastName" className="text-sm font-medium text-foreground ml-1">Last Name</label>
                                    <input
                                        id="lastName"
                                        type="text"
                                        placeholder="Doe"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        disabled={status.type === 'loading'}
                                        className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground placeholder:text-muted-foreground/40 text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label htmlFor="phone" className="text-sm font-medium text-foreground ml-1">Phone Number</label>
                                    <input
                                        id="phone"
                                        type="tel"
                                        placeholder="+1 (555) 000-0000"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={status.type === 'loading'}
                                        className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground placeholder:text-muted-foreground/40 text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-foreground ml-1">
                                        Email Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={status.type === 'loading'}
                                        className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground placeholder:text-muted-foreground/40 text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="message" className="text-sm font-medium text-foreground ml-1">
                                    Message <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="message"
                                    placeholder="Tell us how we can help..."
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    disabled={status.type === 'loading'}
                                    className="w-full px-4 py-3 bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-foreground placeholder:text-muted-foreground/40 text-sm transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                                ></textarea>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={status.type === 'loading'}
                                    className="group w-full md:w-auto px-8 py-3.5 bg-[#23527C] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {status.type === 'loading' ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            SENDING...
                                        </>
                                    ) : (
                                        <>
                                            SEND MESSAGE
                                            <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Map */}
                    {brand.contact.mapEmbedUrl && (
                        <div className="w-full lg:w-1/2 min-h-[400px] lg:min-h-full bg-muted relative">
                            <iframe
                                src={brand.contact.mapEmbedUrl}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={false}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="absolute inset-0 w-full h-full  contrast-[0.9] opacity-90 hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                    )}
                </div>

            </div>
        </section>
    );
}
