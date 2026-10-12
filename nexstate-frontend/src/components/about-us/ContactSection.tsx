'use client';

import React, { useState } from 'react';

const ContactSection = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <section className="bg-muted py-20 md:py-28 overflow-hidden">
            <div className="container mx-auto px-5 md:px-10 max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                    {/* Left - Content */}
                    <div className="w-full lg:w-[45%] flex flex-col justify-center">
                        {/* Tag */}
                        <div className="flex items-center gap-2 mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                            <span className="text-[12px] font-semibold uppercase tracking-[1.5px] text-muted-foreground">
                                For Sellers
                            </span>
                        </div>

                        {/* Heading */}
                        <h2 className="text-[32px] md:text-[48px] lg:text-[56px] font-medium leading-[1.15] text-foreground mb-6 tracking-[-0.02em]">
                            Ready to Experience the <span className="font-serif italic text-primary">Future?</span>
                        </h2>

                        {/* Description */}
                        <p className="text-muted-foreground text-[15px] md:text-[17px] leading-[1.7] mb-12 max-w-[400px]">
                            Chat with our AI Agent now or calculate your property's ROI instantly.
                        </p>

                        {/* Contact Info */}
                        <div className="flex flex-col gap-8 mt-auto">
                            {/* Address */}
                            <div className="flex items-center gap-5 group cursor-pointer">
                                <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-card border border-border shadow-sm group-hover:bg-primary group-hover:border-primary transition-colors duration-300">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground group-hover:text-primary-foreground transition-colors">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Office</span>
                                    <span className="text-foreground text-[16px] font-medium">
                                        123 Example Road, New York, NY 12345
                                    </span>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-center gap-5 group cursor-pointer">
                                <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-card border border-border shadow-sm group-hover:bg-primary group-hover:border-primary transition-colors duration-300">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground group-hover:text-primary-foreground transition-colors">
                                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                        <polyline points="22,6 12,13 2,6" />
                                    </svg>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Email</span>
                                    <span className="text-foreground text-[16px] font-medium">
                                        email@example.com
                                    </span>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-center gap-5 group cursor-pointer">
                                <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-card border border-border shadow-sm group-hover:bg-primary group-hover:border-primary transition-colors duration-300">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground group-hover:text-primary-foreground transition-colors">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Phone</span>
                                    <span className="text-foreground text-[16px] font-medium">
                                        (555) 555-5555
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right - Form Card */}
                    <div className="w-full lg:w-[55%]">
                        <div className="bg-card rounded-[32px] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border/50 h-full">
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6 h-full justify-center">
                                {/* Name */}
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="name" className="text-foreground text-[14px] font-semibold">
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Type your name"
                                        className="w-full bg-muted/50 border border-transparent rounded-xl px-4 py-4 text-foreground text-[15px] placeholder:text-muted-foreground focus:outline-none focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                                    />
                                </div>

                                {/* Email & Phone Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="email" className="text-foreground text-[14px] font-semibold">
                                            Email address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="Type your email"
                                            className="w-full bg-muted/50 border border-transparent rounded-xl px-4 py-4 text-foreground text-[15px] placeholder:text-muted-foreground focus:outline-none focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <label htmlFor="phone" className="text-foreground text-[14px] font-semibold">
                                            Phone number
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="Type your phone"
                                            className="w-full bg-muted/50 border border-transparent rounded-xl px-4 py-4 text-foreground text-[15px] placeholder:text-muted-foreground focus:outline-none focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                {/* Message */}
                                <div className="flex flex-col gap-2">
                                    <label htmlFor="message" className="text-foreground text-[14px] font-semibold">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="How can we help you?"
                                        rows={4}
                                        className="w-full bg-muted/50 border border-transparent rounded-xl px-4 py-4 text-foreground text-[15px] placeholder:text-muted-foreground focus:outline-none focus:bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 resize-none"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full md:w-fit px-10 py-4 bg-primary text-primary-foreground text-[15px] font-semibold rounded-full hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 mt-2"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;