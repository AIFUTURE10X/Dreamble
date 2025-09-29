export const LIGHTING_OPTIONS: string[] = [
    "Studio",
    "Natural",
    "Golden Hour",
    "Blue Hour",
    "Dramatic",
    "Cinematic",
    "Backlit",
    "Soft",
    "High-Key",
    "Low-Key"
];

export const ASPECT_RATIO_OPTIONS: { value: string, label: string }[] = [
    { value: "1:1", label: "1:1 (Square)" },
    { value: "4:3", label: "4:3 (Standard)" },
    { value: "3:2", label: "3:2 (Classic)" },
    { value: "16:9", label: "16:9 (Widescreen)" },
    { value: "3:4", label: "3:4 (Portrait)" },
    { value: "2:3", label: "2:3 (Portrait)" },
    { value: "9:16", label: "9:16 (Tall)" },
    { value: "21:9", label: "21:9 (Cinemascope)" }
];

export const CAMERA_PERSPECTIVE_OPTIONS: string[] = [
    "Eye-Level",
    "High-Angle",
    "Low-Angle",
    "Bird's-Eye View",
    "Worm's-Eye View",
    "Dutch Angle",
    "Over-the-Shoulder",
    "Close-up",
    "Macro",
    "Wide-Angle"
];

export const STYLE_TAXONOMY: { [key: string]: string[] } = {
    "🎞️ Animation": [
        "Anime", "Kawaii", "Studio Ghibli", "Disney Style", "Pixar Style", "2D Animation",
        "3D Animation", "Chibi", "Comic Book", "Manga", "Modern Anime", "Funko Pop",
        "South Park", "Minecraft", "Boxes Style", "GTA 5 Style"
    ],
    "📸 Realism": [
        "Realistic", "Photorealistic", "Hyperrealism", "Cinematic", "HDR (High Dynamic Range)"
    ],
    "🔮 Fantasy": [
        "Dark Fantasy", "Fairy Tale", "Mythical", "Dreamlike", "Dreamcore"
    ],
    "🚀 Sci-Fi": [
        "Cyberpunk", "Steampunk", "Solarpunk", "Biopunk", "Retro-Futurism", "Synthwave",
        "Sci-Fi", "Eco-Futurism"
    ],
    "🖌️ Painting": [
        "Oil Painting", "Watercolor", "Acrylic Painting", "Fresco", "Encaustic", "Tempera",
        "Pointillism", "Palette Knife Painting", "Impasto", "Grisaille", "Tonalism",
        "Impressionism", "Expressionism", "Surrealism", "Abstract", "Pop Art",
        "Vaporwave", "Color Field Painting", "Hard-Edge Painting"
    ],
    "🏛️ Heritage": [
        "Ukiyo-e", "Renaissance", "Baroque", "Medieval", "Art Deco", "Art Nouveau",
        "Hudson River School", "Barbizon School", "Gothic", "Minimalist", "Line Art",
        "Flat Design", "Grunge", "Liminal Spaces", "Glitch Art", "Collage",
        "Chalkboard", "Sketch", "Monochrome", "Isometric", "Info Graphic"
    ],
    "🌌 Fusion": [
        "Cyber-Ghibli", "Fantasy-Cyberpunk", "Techno-Organic", "Neo-Noir",
        "Cyberpunk Anime", "Steampunk Fantasy", "Art Deco Sci-Fi", "Gothic Surrealism",
        "Pop Art Mythology", "Minimalist Nature", "Baroque Cybernetics"
    ],
    "🎨 Drawing": [
        "Pencil", "Charcoal", "Ink", "Pastel", "Marker",
        "Technical (Architectural Drafting / Blueprints)", "Sketch (Loose / Concept Sketch)",
        "Line Art", "Doodle"
    ],
    "📸 Photo": [
        "Portrait", "Landscape", "Street", "Fashion", "Macro", "Black & White",
        "Film / Analog", "Aerial / Drone", "Wildlife", "Sports / Action"
    ],
    "💻 Digital Art": [
        "Pixel", "Vector", "3D Render", "Matte Painting", "Concept Art", "Low Poly",
        "CGI", "Vaporwave", "Cyberpunk", "Glitch"
    ],
    "👉 Cel‑Shaded": [
        "Disney", "Low Poly", "Voxel / Minecraft", "Cel‑Shaded / Toon Shaded 3D"
    ],
    "✨ Misc": [
        "Retro", "Vintage", "Still Life", "Landscape Painting", "Figurative Painting",
        "Genre Painting", "Portraiture"
    ]
};

export const NUMBER_OF_IMAGES_OPTIONS: string[] = [
    "1",
    "2",
    "3",
    "4"
];

export const MAX_HISTORY_SIZE = 12;
