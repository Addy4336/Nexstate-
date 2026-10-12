'use client';

import { brand } from "@nexstate/brand";
import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight, Bed, Home, MapPin, CheckCircle2, Shield, Clock, Sparkles, Loader2, Mail } from 'lucide-react';

const bedroomOptions = [
    { value: '', label: 'Bedrooms' },
    { value: 'studio', label: 'Studio Apartment' },
    { value: '1', label: '1 Bedroom' },
    { value: '2', label: '2 Bedrooms' },
    { value: '3', label: '3 Bedrooms' },
    { value: '4', label: '4 Bedrooms' },
    { value: '5+', label: '5+ Bedrooms' },
];

const propertyTypes = [
    { value: '', label: 'Property Type' },
    { value: 'villa', label: 'Villa' },
    { value: 'penthouse', label: 'Penthouse' },
    { value: 'townhouse', label: 'Townhouse' },
    { value: 'apartment', label: 'Full Apartment' },
    { value: 'building', label: 'Whole Building' },
    { value: 'shared', label: 'Shared Accommodation' },
];

const cityOptions = [
    { value: '', label: 'Select City' },
    { value: 'dubai', label: 'Dubai' },
    { value: 'abudhabi', label: 'Abu Dhabi' },
    { value: 'sharjah', label: 'Sharjah' },
    { value: 'ajman', label: 'Ajman' },
    { value: 'rak', label: 'Ras Al Khaimah' },
];

const benefits = [
    ...(brand.licenseBadge ? [{ icon: Shield, text: brand.licenseBadge }] : []),
    { icon: Clock, text: 'Response in 24hrs' },
    { icon: CheckCircle2, text: 'Free Valuation' },
];

export default function ConsultationSection() {
    const [formData, setFormData] = useState({
        bedrooms: '',
        propertyType: '',
        city: '',
        name: '',
        email: '',
        phone: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(null); // Clear error when user makes changes
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Build the message from property details
            const propertyDetailsMessage = `Property Type: ${propertyTypes.find(p => p.value === formData.propertyType)?.label || 'Not specified'}, Bedrooms: ${bedroomOptions.find(b => b.value === formData.bedrooms)?.label || 'Not specified'}, City: ${cityOptions.find(c => c.value === formData.city)?.label || 'Not specified'}`;

            const response = await fetch('/api/enquiries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: 'owner_enquiry',
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    message: `Owner consultation request: ${propertyDetailsMessage}`,
                    propertyDetails: {
                        propertyType: formData.propertyType,
                        bedrooms: formData.bedrooms,
                        city: formData.city,
                    },
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Failed to submit enquiry');
            }

            setIsSuccess(true);
            // Reset form after success
            setTimeout(() => {
                setFormData({
                    bedrooms: '',
                    propertyType: '',
                    city: '',
                    name: '',
                    email: '',
                    phone: '',
                });
                setIsSuccess(false);
            }, 3000);
        } catch (err) {
            console.error('Error submitting form:', err);
            setError(err instanceof Error ? err.message : 'Failed to submit. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="consultation-form" className="relative py-16 md:py-28 px-4 sm:px-6 md:px-12 overflow-hidden">
            <style dangerouslySetInnerHTML={{
                __html: `
                @media (min-width: 1024px) {
                    .desktop-clip-form {
                        clip-path: url(#form-clip);
                        -webkit-clip-path: url(#form-clip);
                    }
                }
            `}} />

            {/* Background with Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/90" />

            {/* Decorative Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            {/* SVG Clip Path Definition */}
            <svg className="absolute w-0 h-0" aria-hidden="true">
                <defs>
                    <clipPath id="consultation-clip" clipPathUnits="objectBoundingBox">
                        <path d="M 0.06 0 H 0.94 Q 1 0 1 0.08 L 1 0.72 Q 0.72 0.72 0.72 1 H 0.06 Q 0 1 0 0.92 V 0.08 Q 0 0 0.06 0 Z" />
                    </clipPath>
                    <clipPath id="form-clip" clipPathUnits="objectBoundingBox">
                        <path d="M 0.04 0 H 0.96 Q 1 0 1 0.04 V 0.96 Q 1 1 0.96 1 H 0.28 Q 0.24 1 0.24 0.96 V 0.92 Q 0.24 0.88 0.2 0.88 H 0.04 Q 0 0.88 0 0.84 V 0.04 Q 0 0 0.04 0 Z" />
                    </clipPath>
                </defs>
            </svg>

            <div className="relative max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

                    {/* Left Content */}
                    <div className="space-y-6 md:space-y-8 text-white text-center lg:text-left">
                        <div className="space-y-6">
                            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs md:text-sm font-medium">
                                <Sparkles size={16} className="text-secondary" />
                                Free Property Consultation
                            </span>

                            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-semibold leading-[1.1]">
                                Best & Secure Way to <br />
                                <span className="text-white/90">Manage Your Property</span>
                            </h2>

                            <p className="text-lg sm:text-xl text-white/80 max-w-md leading-relaxed mx-auto lg:mx-0">
                                Get high income from rent in a few steps. Login, register, or submit your property details to get started.
                            </p>
                        </div>

                        {/* Benefits */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                                    <benefit.icon size={16} className="text-white/90 sm:w-[18px] sm:h-[18px]" />
                                    <span className="text-xs sm:text-sm font-medium text-white/90">{benefit.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="flex justify-center lg:justify-start gap-8 sm:gap-12 pt-4">
                            {brand.claims.assetsManaged && (
                                <div>
                                    <div className="text-3xl sm:text-4xl font-bold text-white">{brand.claims.assetsManaged}</div>
                                    <div className="text-white/60 text-xs sm:text-sm mt-1">Assets Managed</div>
                                </div>
                            )}
                            <div>
                                <div className="text-3xl sm:text-4xl font-bold text-white">{brand.claims.occupancy}</div>
                                <div className="text-white/60 text-xs sm:text-sm mt-1">Occupancy Rate</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Form with Clippath */}
                    <div className="relative">
                        {/* Decorative floating elements */}
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/5 rounded-full blur-xl" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-xl" />

                        {/* Form Container with Clippath */}
                        <div className="relative bg-white rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-2xl desktop-clip-form">
                            {isSuccess ? (
                                // Success State
                                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-green-600 mb-1">Consultation Request Sent!</h3>
                                        <p className="text-muted-foreground text-sm">We'll get back to you within 24 hours.</p>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5" id='owner-consultation-form'>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-semibold text-foreground">Claim Free Consultation</h3>
                                        <p className="text-muted-foreground text-sm">Fill in your property details to get started</p>
                                    </div>

                                    {/* Error Message */}
                                    {error && (
                                        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
                                            {error}
                                        </div>
                                    )}

                                    {/* Property Type */}
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            <Home size={20} />
                                        </div>
                                        <select
                                            name="propertyType"
                                            value={formData.propertyType}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-12 pr-4 py-4 rounded-xl bg-muted/50 border border-border text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                                        >
                                            {propertyTypes.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                                        </div>
                                    </div>

                                    {/* Two Column Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Bedrooms */}
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                <Bed size={20} />
                                            </div>
                                            <select
                                                name="bedrooms"
                                                value={formData.bedrooms}
                                                onChange={handleChange}
                                                required
                                                className="w-full pl-12 pr-4 py-4 rounded-xl bg-muted/50 border border-border text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                                            >
                                                {bedroomOptions.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                                            </div>
                                        </div>

                                        {/* City */}
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                <MapPin size={20} />
                                            </div>
                                            <select
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                required
                                                className="w-full pl-12 pr-4 py-4 rounded-xl bg-muted/50 border border-border text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                                            >
                                                {cityOptions.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6" /></svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Name Input */}
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Your Full Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-5 py-4 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                                    />

                                    {/* Email Input */}
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            <Mail size={20} />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Your Email Address"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-12 pr-5 py-4 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                                        />
                                    </div>

                                    {/* Phone Input */}
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Phone Number (+971)"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-5 py-4 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                                    />

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 px-8 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-secondary/25 transition-all group disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 size={20} className="animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                Claim Free Consultation
                                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </button>

                                    <p className="text-center text-xs text-muted-foreground">
                                        By submitting, you agree to our Terms & Privacy Policy
                                    </p>
                                </form>
                            )}
                        </div>

                        {/* Floating Image Card - Bottom Right Cutout */}
                        <div className="absolute -bottom-12 left-[1%] w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden shadow-xl border-4 border-white hidden lg:block">
                            <Image
                                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=200&auto=format&fit=crop"
                                alt="Happy Property Owner"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* Mobile Drawer & Sticky Trigger */}
            <MobileDrawerForm
                formData={formData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                isSubmitting={isSubmitting}
            />
        </section>
    );
}

// Sub-component for Mobile Drawer Form to keep things clean
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronUp, X } from 'lucide-react';

function MobileDrawerForm({ formData, handleChange, handleSubmit, isSubmitting }: {
    formData: any,
    handleChange: (e: any) => void,
    handleSubmit: (e: any) => void | Promise<void>,
    isSubmitting: boolean
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Sticky Trigger Bar (Always Visible on Mobile) */}
            <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-background border-t border-border p-4 z-40 flex items-center justify-between shadow-[0_-5px_20px_rgba(0,0,0,0.1)]">
                <div>
                    <span className="block text-sm font-bold text-foreground">Free Consultation</span>
                    <span className="text-xs text-muted-foreground">Maximize your rental yield</span>
                </div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="h-10 px-6 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-semibold text-sm shadow-md transition-all flex items-center gap-2"
                >
                    Claim Now
                    <ChevronUp className="w-4 h-4" />
                </button>
            </div>

            {/* Backdrop & Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 bg-background z-[51] rounded-t-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] lg:hidden will-change-transform"
                        >
                            {/* Drawer Header */}
                            <div className="p-4 border-b border-border flex items-center justify-between bg-muted/30">
                                <div>
                                    <h3 className="font-bold text-base">Property Consultation</h3>
                                    <p className="text-xs text-muted-foreground">Fill in details below</p>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 bg-muted rounded-full hover:bg-muted/80 transition-colors"
                                >
                                    <X className="w-5 h-5 text-muted-foreground" />
                                </button>
                            </div>

                            {/* Scrollable Form Content */}
                            <div className="p-5 overflow-y-auto">
                                <form onSubmit={(e) => {
                                    handleSubmit(e);
                                    setIsOpen(false);
                                }} className="space-y-4">

                                    {/* Property Type */}
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium ml-1">Property Type</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                <Home size={18} />
                                            </div>
                                            <select
                                                name="propertyType"
                                                value={formData.propertyType}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                                            >
                                                {propertyTypes.map((option) => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Bedrooms & City Grid */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium ml-1">Bedrooms</label>
                                            <div className="relative">
                                                <select
                                                    name="bedrooms"
                                                    value={formData.bedrooms}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-3 rounded-xl bg-muted/50 border border-border text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                                                >
                                                    {bedroomOptions.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium ml-1">City</label>
                                            <div className="relative">
                                                <select
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-3 rounded-xl bg-muted/50 border border-border text-foreground appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                                                >
                                                    {cityOptions.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Name */}
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Your Full Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                                    />

                                    {/* Email */}
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Your Email Address"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                                    />

                                    {/* Phone */}
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Phone Number (+971)"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                                    />

                                    {/* Submit */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/25 transition-all mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 size={18} className="animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                Claim Free Consultation
                                                <ArrowRight size={18} />
                                            </>
                                        )}
                                    </button>

                                    <div className="h-6" /> {/* Spacer for bottom safe area */}
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
