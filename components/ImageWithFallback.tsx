import React, { useState, useEffect } from 'react';
import { STYLE_TAXONOMY, Substyle } from '../constants';

interface ImageWithFallbackProps {
    name: string;
    className: string;
}

// Helper to find a substyle by name across all categories to get its icon
const findSubstyle = (name: string): Substyle | null => {
    for (const category in STYLE_TAXONOMY) {
        const found = STYLE_TAXONOMY[category as keyof typeof STYLE_TAXONOMY].find(s => s.name === name);
        if (found) return found;
    }
    return null;
};

// Generates a color based on the style name, using a predefined map or a hash.
const getStyleColor = (styleName: string): string => {
  const colors: { [key: string]: string } = {
    'Anime': '#ff6b9d', 'Kawaii': '#ffa726', 'Studio Ghibli': '#66bb6a', 'Disney Style': '#64b5f6', 'Chibi': '#ffab40', 'Comic Book': '#ff7043', 'Manga': '#ab47bc', 'Modern Anime': '#42a5f5', 'Funko Pop': '#5c6bc0', 'South Park': '#D42A2A', 'Minecraft': '#6EBF3B', 'GTA 5 Style': '#4A4A4A', '2D Animation': '#29B6F6', '3D Animation': '#EC407A', 'Boxes Style': '#78909C'
  };
  if (colors[styleName]) { return colors[styleName]; }
  let hash = 0;
  for (let i = 0; i < styleName.length; i++) { hash = styleName.charCodeAt(i) + ((hash << 5) - hash); }
  const h = hash % 360;
  return `hsl(${h}, 50%, 45%)`;
};

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ name, className }) => {
    const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
    const substyle = findSubstyle(name);
    const previewUrl = substyle?.previewImageUrl;

    useEffect(() => {
        if (!previewUrl) {
            setStatus('error');
            return;
        }
        setStatus('loading');
        const img = new Image();
        img.src = previewUrl;
        img.onload = () => setStatus('loaded');
        img.onerror = () => setStatus('error');
    }, [previewUrl]);

    if (status === 'loaded' && previewUrl) {
        return (
            <img
                src={previewUrl}
                alt={name}
                className={className}
            />
        );
    }

    // Fallback for 'loading' or 'error' states
    const icon = substyle?.icon || '🎨';
    const backgroundColor = getStyleColor(name);
    
    return (
        <div
            className={`${className} flex items-center justify-center`}
            style={{ backgroundColor }}
            role="img"
            aria-label={name}
        >
            {status === 'loading' && previewUrl ? (
                <svg className="animate-spin h-8 w-8 text-white/70" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : (
                <span className="text-4xl" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.2)' }}>
                    {icon}
                </span>
            )}
        </div>
    );
};