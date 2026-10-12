"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, User } from "lucide-react"; // Added User for author icon matching LatestBlogs if needed, or stick to current
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link"; // Optional: if we want to make it clickable, but I'll stick to display first or wraps

// Blog interface matching the CMS API response
interface Blog {
    id: string;
    title: string;
    description?: string; // Mapped from excerpt
    slug: string;
    content: string;
    excerpt: string | null;
    cover_image: string | null;
    images: string[] | null;
    category: string;
    status: string;
    published_at: string | null;
    created_at: string;
    updated_at: string;
}

interface BlogListResponse {
    success: boolean;
    data: Blog[];
    error?: string;
}

// CMS API base URL
const CMS_API_URL = process.env.NEXT_PUBLIC_CMS_API_URL || 'http://localhost:3001';

// Format date for display
function formatDate(dateString: string | null): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

// Get reading time estimate
function getReadingTime(content: string): string {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} min${minutes !== 1 ? 's' : ''}`;
}

// Get blog cover image with fallback
function getBlogImage(blog: Blog): string {
    if (blog.cover_image) {
        return blog.cover_image;
    }
    if (blog.images && blog.images.length > 0) {
        return blog.images[0];
    }
    // Fallback placeholder
    return 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=2000&auto=format&fit=crop';
}

// Fallback slides in case of API failure or empty state
const FALLBACK_SLIDES = [
    {
        id: "1",
        image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070&auto=format&fit=crop",
        title: "Exploring The Wonders of \n Hiking True Journey",
        description: "An iconic Landmarks, this post unveils of secrets that make the destination a traveler's paradise",
        category: "Travel",
        slug: "#",
        date: "5 Aug 2024",
        readTime: "5 mins"
    },
    {
        id: "2",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop",
        title: "Mountain Peaks & \n Hidden Valleys",
        description: "Discover the untouched beauty of the high mountains and specific valleys.",
        category: "Nature",
        slug: "#",
        date: "10 Aug 2024",
        readTime: "7 mins"
    },
    {
        id: "3",
        image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=2076&auto=format&fit=crop",
        title: "Into the Wild: \n Nature's Serenity",
        description: "A journey through dense forests and calm rivers finding peace in nature.",
        category: "Adventure",
        slug: "#",
        date: "12 Aug 2024",
        readTime: "6 mins"
    }
];

export default function BlogHero() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slides, setSlides] = useState<any[]>(FALLBACK_SLIDES);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBlogs() {
            try {
                const response = await fetch(`${CMS_API_URL}/api/blogs?limit=4`, {
                    cache: 'no-store',
                    headers: { 'Content-Type': 'application/json' },
                });

                if (!response.ok) throw new Error('Failed to fetch');

                const data: BlogListResponse = await response.json();

                if (data.success && data.data.length > 0) {
                    const mappedSlides = data.data.map(blog => ({
                        id: blog.id,
                        image: getBlogImage(blog),
                        title: blog.title,
                        description: blog.excerpt || blog.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
                        category: blog.category,
                        slug: blog.slug,
                        date: formatDate(blog.published_at || blog.created_at),
                        readTime: getReadingTime(blog.content || '')
                    }));
                    setSlides(mappedSlides);
                }
            } catch (err) {
                console.error("Error fetching hero blogs:", err);
                // Keep fallback slides on error
            } finally {
                setLoading(false);
            }
        }

        fetchBlogs();
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    // Auto-advance slides
    useEffect(() => {
        if (loading) return;
        const timer = setInterval(() => {
            nextSlide();
        }, 14000);
        return () => clearInterval(timer);
    }, [currentSlide, loading, slides.length]);

    if (!slides || slides.length === 0) return null;

    const currentData = slides[currentSlide];

    return (
        <div className="relative w-full h-[500px] md:h-[600px] lg:h-[750px] overflow-hidden group font-sans bg-background">
            {/* Background Image Carousel */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentData.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                >
                    <Image
                        src={currentData.image}
                        alt={currentData.title}
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Gradient Overlays */}
                    <div className="absolute inset-0 bg-black/30 md:bg-black/20" />
                    <div className="absolute inset-x-0 bottom-0 h-3/4 md:h-2/3 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <div className="absolute inset-0 hidden md:flex items-center justify-between px-2 md:px-8 pointer-events-none">
                <button
                    onClick={prevSlide}
                    className="p-1 md:p-2 text-white/80 hover:text-white transition-transform hover:scale-110 pointer-events-auto"
                    aria-label="Previous Slide"
                >
                    <ChevronLeft className="w-8 h-8 md:w-10 md:h-10 drop-shadow-md" strokeWidth={1.5} />
                </button>

                <button
                    onClick={nextSlide}
                    className="p-1 md:p-2 text-white/80 hover:text-white transition-transform hover:scale-110 pointer-events-auto"
                    aria-label="Next Slide"
                >
                    <ChevronRight className="w-8 h-8 md:w-10 md:h-10 drop-shadow-md" strokeWidth={1.5} />
                </button>
            </div>

            {/* Main Content Area */}
            <div className="absolute bottom-0 w-full pb-8 md:pb-16 z-10">
                <div className="container mx-auto px-4 md:px-12 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 md:gap-10">

                    {/* Left Section: Title & Details */}
                    <Link href={`/blog/${currentData.slug}`} className="max-w-3xl w-full space-y-4 md:space-y-6 group cursor-pointer block">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentData.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight drop-shadow-lg group-hover:text-primary-foreground/90 transition-colors">
                                    {currentData.title}
                                </h1>

                                <p className="mt-2 md:mt-4 text-white/90 text-sm md:text-lg font-light max-w-xl leading-relaxed drop-shadow-md line-clamp-2 md:line-clamp-none">
                                    {currentData.description}
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 md:gap-3 pt-1 md:pt-2">
                            {/* Display Category as Tag */}
                            <button className="px-4 py-1.5 md:px-5 md:py-1.5 rounded-full border border-white/40 text-xs md:text-sm text-white hover:bg-white hover:text-foreground transition-colors backdrop-blur-sm uppercase">
                                {currentData.category}
                            </button>
                        </div>
                    </Link>

                    {/* Right Section: Author & Indicators */}
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 md:gap-6">
                        {/* Author Info */}
                        <div className="flex items-center gap-3 md:gap-4">
                            <div className="relative w-8 h-8 md:w-12 md:h-12 rounded-full overflow-hidden ring-2 ring-white/20 bg-white/10 flex items-center justify-center">
                                {/* Use Icon if no author image available in API yet */}
                                <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
                            </div>
                            <div className="flex flex-col text-white drop-shadow-md">
                                <span className="font-medium text-sm md:text-base">nexstate</span>
                                <span className="text-xs md:text-sm text-white/80">
                                    {currentData.date} • {currentData.readTime}
                                </span>
                            </div>
                        </div>

                        {/* Pagination Dots & Mobile Arrows */}
                        <div className="flex items-center gap-4">
                            {/* Mobile Prev Arrow */}
                            <button
                                onClick={prevSlide}
                                className="md:hidden text-white/80 hover:text-white p-1"
                                aria-label="Previous Slide"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>

                            {/* Dots */}
                            <div className="flex items-center gap-2 md:gap-3">
                                {slides.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentSlide(index)}
                                        className={`rounded-full transition-all border border-transparent ${currentSlide === index ? 'w-2 h-2 md:w-2.5 md:h-2.5 bg-white' : 'w-1.5 h-1.5 md:w-2 md:h-2 bg-white/50 hover:bg-white hover:scale-110'}`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>

                            {/* Mobile Next Arrow */}
                            <button
                                onClick={nextSlide}
                                className="md:hidden text-white/80 hover:text-white p-1"
                                aria-label="Next Slide"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
