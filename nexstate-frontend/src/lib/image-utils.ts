/**
 * Image utility functions
 */

/**
 * Process an array of image URLs:
 * - Filter out empty/invalid URLs
 * - Remove duplicates
 * 
 * @param urls - Array of image URLs
 * @returns Processed and deduplicated array of valid image URLs
 */
export function processImageUrls(urls: string[]): string[] {
    if (!Array.isArray(urls)) {
        return [];
    }
    
    return urls
        // Filter out empty, null, or whitespace-only URLs
        .filter(url => url && typeof url === 'string' && url.trim() !== '')
        // Remove duplicates (keep first occurrence)
        .filter((url, index, self) => self.indexOf(url) === index);
}

/**
 * Get a fallback image URL for when image loading fails
 * 
 * @param category - Optional category to get category-specific fallback
 * @returns Fallback image URL
 */
export function getFallbackImageUrl(category?: string): string {
    // Use a reliable Unsplash image as fallback
    return 'https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?w=800&auto=format&fit=crop';
}

/**
 * Validate if a URL is likely to be a valid image URL
 * 
 * @param url - URL to validate
 * @returns true if URL appears to be valid
 */
export function isValidImageUrl(url: string): boolean {
    if (!url || typeof url !== 'string') {
        return false;
    }
    
    try {
        const urlObj = new URL(url);
        // Check if it's http or https
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
            return false;
        }
        return true;
    } catch {
        return false;
    }
}
