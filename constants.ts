

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

export const ASPECT_RATIO_OPTIONS: { group: string, options: { value: string, label: string, native?: boolean }[] }[] = [
    {
        group: "Common",
        options: [
            { value: "1:1", label: "1:1 (Square)", native: true },
            { value: "16:9", label: "16:9 (Widescreen)", native: true },
            { value: "9:16", label: "9:16 (Tall)", native: true },
            { value: "4:3", label: "4:3 (Standard)", native: true },
            { value: "3:4", label: "3:4 (Portrait)", native: true },
            { value: "3:2", label: "3:2 (Classic)" },
        ]
    },
    {
        group: "Photography & Print",
        options: [
            { value: "5:4", label: "5:4 (Print)" },
            { value: "7:5", label: "7:5 (Photo)" },
            { value: "3:2", label: "3:2 (35mm Film)" },
            { value: "8.5:11", label: "8.5:11 (Letter)" },
            { value: "1:1.414", label: "A4 (ISO)" },
        ]
    },
    {
        group: "Cinema & Video",
        options: [
            { value: "4:3", label: "4:3 (Old TV)", native: true },
            { value: "1.37:1", label: "1.37:1 (Academy)" },
            { value: "1.43:1", label: "1.43:1 (IMAX)" },
            { value: "1.66:1", label: "1.66:1 (European)" },
            { value: "16:9", label: "16:9 (HDTV)", native: true },
            { value: "1.85:1", label: "1.85:1 (Cinema)" },
            { value: "2.39:1", label: "2.39:1 (Scope)" },
            { value: "2.76:1", label: "2.76:1 (UltraPan)" },
        ]
    },
    {
        group: "Social Media",
        options: [
            { value: "1:1", label: "1:1 (Insta Post)", native: true },
            { value: "4:5", label: "4:5 (Insta Portrait)" },
            { value: "9:16", label: "9:16 (Stories/Reels)", native: true },
            { value: "16:9", label: "16:9 (Video)", native: true },
        ]
    },
    {
        group: "Screens & Displays",
        options: [
            { value: "5:4", label: "5:4 (Monitor)" },
            { value: "16:10", label: "16:10 (Laptop)" },
            { value: "21:9", label: "21:9 (Ultrawide)" },
            { value: "32:9", label: "32:9 (Superwide)" },
        ]
    }
];

export const IMAGE_SIZE_OPTIONS: { group: string, options: { value: string, label: string }[] }[] = [
    {
        group: "General",
        options: [
            { value: "auto", label: "Auto (Based on Aspect Ratio)" },
        ]
    },
    {
        group: "Icons",
        options: [
            { value: "16x16", label: "Favicon (16x16)" },
            { value: "32x32", label: "Favicon (32x32)" },
            { value: "180x180", label: "App Icon - iOS (180x180)" },
            { value: "192x192", label: "App Icon - Android (192x192)" },
            { value: "512x512", label: "App Store Icon (512x512)" },
        ]
    },
    {
        group: "Passport & ID",
        options: [
            { value: "600x600", label: "US Passport (2x2 inch)" },
            { value: "413x531", label: "Schengen Visa (35x45 mm)" },
            { value: "591x827", label: "Canada Passport (50x70 mm)" },
        ]
    },
    {
        group: "Web & Digital",
        options: [
            { value: "1920x1080", label: "Hero Image (1920x1080)" },
            { value: "1200x630", label: "Blog / Facebook Post (1200x630)" },
            { value: "1080x1080", label: "Instagram Post - Square (1080x1080)" },
            { value: "1080x1350", label: "Instagram Post - Portrait (1080x1350)" },
            { value: "1600x900", label: "Twitter Post (1600x900)" },
            { value: "1000x1500", label: "Pinterest Pin (1000x1500)" },
            { value: "1584x396", label: "LinkedIn Cover (1584x396)" },
            { value: "800x200", label: "Email Banner (800x200)" },
        ]
    },
    {
        group: "Print (300 DPI)",
        options: [
            { value: "1200x1800", label: "4x6 inches" },
            { value: "1500x2100", label: "5x7 inches" },
            { value: "2400x3000", label: "8x10 inches" },
            { value: "2480x3508", label: "A4 Paper" },
            { value: "2550x3300", label: "Letter Paper (US)" },
        ]
    },
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

export const NUMBER_OF_IMAGES_OPTIONS: string[] = ["1", "2", "3", "4"];

export const UPSCALE_OPTIONS: { value: string, label: string }[] = [
    { value: '2x', label: '2x Upscale (Approx. 2K)' },
    { value: '4x', label: '4x Upscale (Approx. 4K)' },
];

export const MAX_HISTORY_SIZE: number = 50;

export interface Substyle {
    name: string;
    description: string;
    tags?: string[];
    icon?: string;
    previewImageUrl?: string;
    shortDescription?: string;
    longDescription?: string;
}


export const STYLE_TAXONOMY: { [key: string]: Substyle[] } = {
    "🎞️ Animation": [
        { name: "Anime", description: "Japanese animation style, characterized by vibrant colors, dramatic action, and expressive characters.", tags: ["Expressive Characters", "Vibrant Colors"], icon: "🌸", previewImageUrl: 'https://placehold.co/100x100/FF6B9D/FFFFFF/png?text=Anime' },
        { name: "Kawaii", description: "Cute, colorful and charming art style with rounded features.", tags: ["Cute", "Pastel Colors"], icon: "🎀", previewImageUrl: 'https://placehold.co/100x100/FFA726/FFFFFF/png?text=Kawaii' },
        { name: "Studio Ghibli", description: "Evokes the hand-drawn, enchanting style of Studio Ghibli films, known for lush landscapes and heartfelt storytelling.", tags: ["Whimsical", "Natural Settings"], icon: "🍃", previewImageUrl: 'https://placehold.co/100x100/66BB6A/FFFFFF/png?text=Ghibli' },
        { name: "Disney Style", description: "Classic family-friendly animation with smooth features.", tags: ["Smooth features", "Bright colors"], icon: "✨", previewImageUrl: 'https://placehold.co/100x100/64B5F6/FFFFFF/png?text=Disney' },
        { 
            name: "Pixar Style", 
            description: "Combines realistic textures and details with stylized proportions and design, using a vibrant color palette, cinematic lighting, and exaggerated, emotion-packed facial expressions to create relatable, sympathetic characters within richly detailed environments.", 
            tags: ["3D Animation", "Detailed Textures"], 
            icon: "💡",
            previewImageUrl: 'https://placehold.co/100x100/EC407A/FFFFFF/png?text=Pixar',
            shortDescription: '3D animated style with vibrant colors',
            longDescription: "Pixar Style: combines realistic textures and details with stylized proportions and design, using a vibrant color palette, cinematic lighting, and exaggerated, emotion-packed facial expressions to create relatable, sympathetic characters within richly detailed environments."
        },
        { name: "2D Animation", description: "Traditional flat animation style, reminiscent of classic cartoons and hand-drawn art.", tags: ["Flat Design", "Bold Colors"], icon: "✏️", previewImageUrl: 'https://placehold.co/100x100/29B6F6/FFFFFF/png?text=2D' },
        { name: "3D Animation", description: "Computer-generated 3D models and environments, offering depth, realism, and complex lighting.", icon: "🧊", previewImageUrl: 'https://placehold.co/100x100/F06292/FFFFFF/png?text=3D' },
        { name: "Chibi", description: "A super-deformed Japanese style where characters are drawn in an exaggerated, cute, and small form with large heads.", icon: "🥰" },
        { name: "Comic Book", description: "Mimics Western comic books, with bold outlines, halftone dots (Ben-Day dots), and dynamic paneling.", tags: ["Bold Outlines", "Dynamic Paneling"], icon: "💥", previewImageUrl: 'https://placehold.co/100x100/FF7043/FFFFFF/png?text=Comic' },
        { name: "Manga", description: "Japanese comic art style, typically in black and white with expressive linework and dynamic action.", icon: "📖", previewImageUrl: 'https://placehold.co/100x100/AB47BC/FFFFFF/png?text=Manga' },
        { name: "Modern Anime", description: "Contemporary anime style with clean lines, high-definition quality, and modern character designs.", icon: "📱" },
        { name: "Funko Pop", description: "The distinct style of Funko Pop vinyl figures, with large heads, black eyes, and simple, cute designs.", icon: "📦" },
        { name: "South Park", description: "The simple, construction-paper cutout animation style of the show South Park.", icon: "🏔️" },
        { name: "Minecraft", description: "A blocky, pixelated art style inspired by the video game Minecraft.", icon: "🧱", previewImageUrl: 'https://placehold.co/100x100/6EBF3B/FFFFFF/png?text=MC' },
        { name: "Boxes Style", description: "A simplified, geometric style using cubes and rectangular prisms to build characters and environments.", icon: "📦" },
        { name: "GTA 5 Style", description: "Mimics the stylized, slightly gritty, and realistic look of the video game Grand Theft Auto V.", icon: "🚗" }
    ],
    "📸 Realism": [
        { name: "Realistic", description: "A style that aims to represent subjects truthfully, without artificiality.", previewImageUrl: 'https://placehold.co/100x100/78909C/FFFFFF/png?text=Realistic' },
        { name: "Photorealistic", description: "Aims to reproduce an image as realistically as a photograph.", previewImageUrl: 'https://placehold.co/100x100/607D8B/FFFFFF/png?text=Photo' },
        { name: "Hyperrealism", description: "A genre resembling a high-resolution photograph, often with an emphasis on fine details and textures.", previewImageUrl: 'https://placehold.co/100x100/546E7A/FFFFFF/png?text=Hyper' },
        { name: "Cinematic", description: "A style that mimics the look of a movie, often with dramatic lighting, specific color grading, and a widescreen feel.", previewImageUrl: 'https://placehold.co/100x100/455A64/FFFFFF/png?text=Cinematic' },
        { name: "HDR (High Dynamic Range)", description: "Creates a more dramatic image with a greater range of detail in both the shadows and highlights.", previewImageUrl: 'https://placehold.co/100x100/37474F/FFFFFF/png?text=HDR' }
    ],
    "🔮 Fantasy": [
        { name: "Dark Fantasy", description: "A subgenre that combines fantasy with elements of horror, creating a dark, frightening, and often gloomy atmosphere.", previewImageUrl: 'https://placehold.co/100x100/424242/FFFFFF/png?text=Dark%20Fantasy' },
        { name: "Fairy Tale", description: "A whimsical and magical style, often featuring fantastical creatures, enchanted forests, and castles.", previewImageUrl: 'https://placehold.co/100x100/F48FB1/FFFFFF/png?text=Fairy%20Tale' },
        { name: "Mythical", description: "A style inspired by myths, legends, and folklore, often featuring gods, heroes, and epic creatures." },
        { name: "Dreamlike", description: "A surreal and ethereal style, characterized by soft focus, strange juxtapositions, and a sense of unreality.", previewImageUrl: 'https://placehold.co/100x100/CE93D8/FFFFFF/png?text=Dreamlike' },
        { name: "Dreamcore", description: "An aesthetic based on dreams and surreal imagery, often with a nostalgic or unsettling feeling." }
    ],
    "🚀 Sci-Fi": [
        { name: "Cyberpunk", description: "A futuristic, high-tech, low-life setting, often featuring neon lights, cybernetics, and dystopian cityscapes.", previewImageUrl: 'https://placehold.co/100x100/00E5FF/000000/png?text=Cyberpunk' },
        { name: "Steampunk", description: "A retrofuturistic style inspired by 19th-century industrial steam-powered machinery.", previewImageUrl: 'https://placehold.co/100x100/A1887F/FFFFFF/png?text=Steampunk' },
        { name: "Solarpunk", description: "An optimistic vision of the future, focusing on renewable energy, nature, and sustainable technology.", previewImageUrl: 'https://placehold.co/100x100/AED581/000000/png?text=Solarpunk' },
        { name: "Biopunk", description: "Focuses on the unintended consequences of biotechnology, featuring genetic engineering and organic modifications." },
        { name: "Retro-Futurism", description: "A vision of the future from the perspective of an earlier era, often the mid-20th century.", previewImageUrl: 'https://placehold.co/100x100/FFB74D/FFFFFF/png?text=Retro' },
        { name: "Synthwave", description: "A retro aesthetic inspired by 1980s film, video game, and music culture, with neon grids and futuristic cars.", previewImageUrl: 'https://placehold.co/100x100/E040FB/FFFFFF/png?text=Synthwave' },
        { name: "Sci-Fi", description: "A broad style encompassing futuristic technology, space exploration, and scientific concepts." },
        { name: "Eco-Futurism", description: "Explores future societies that have achieved a sustainable and ecological balance." }
    ],
    "🖌️ Painting": [
        { name: "Oil Painting", description: "Rich, deep colors with a visible texture, mimicking traditional oil on canvas.", previewImageUrl: 'https://placehold.co/100x100/8D6E63/FFFFFF/png?text=Oil' },
        { name: "Watercolor", description: "Soft, translucent colors with a fluid and often spontaneous appearance.", previewImageUrl: 'https://placehold.co/100x100/90CAF9/FFFFFF/png?text=Watercolor' },
        { name: "Acrylic Painting", description: "Bold, vibrant colors with a fast-drying, plastic-like finish.", previewImageUrl: 'https://placehold.co/100x100/EF5350/FFFFFF/png?text=Acrylic' },
        { name: "Fresco", description: "A mural painting technique on fresh lime plaster, resulting in a matte, earthy finish." },
        { name: "Encaustic", description: "A style using heated beeswax mixed with colored pigments, known for its layered, textured look." },
        { name: "Tempera", description: "A fast-drying medium using pigment mixed with a water-soluble binder, like egg yolk, with a matte finish." },
        { name: "Pointillism", description: "A technique using tiny dots of color that blend in the viewer's eye.", previewImageUrl: 'https://placehold.co/100x100/FFEE58/000000/png?text=Pointillism' },
        { name: "Palette Knife Painting", description: "A style using a knife instead of a brush to apply thick, textured strokes of paint." },
        { name: "Impasto", description: "A technique where paint is laid on an area of the surface in very thick layers." },
        { name: "Grisaille", description: "A method of painting in monochrome, typically in shades of grey." },
        { name: "Tonalism", description: "An artistic style that emerged in the 1880s characterized by soft, diffused light, and muted tones." },
        { name: "Impressionism", description: "Characterized by small, thin, yet visible brush strokes, and an accurate depiction of light.", previewImageUrl: 'https://placehold.co/100x100/BCAAA4/FFFFFF/png?text=Impression' },
        { name: "Expressionism", description: "A style in which the artist seeks to depict not objective reality but rather the subjective emotions." },
        { name: "Surrealism", description: "Features dream-like, bizarre, and illogical scenes.", previewImageUrl: 'https://placehold.co/100x100/BA68C8/FFFFFF/png?text=Surreal' },
        { name: "Abstract", description: "Uses visual language of shape, form, color, and line to create a composition which may exist with a degree of independence from visual references.", previewImageUrl: 'https://placehold.co/100x100/7986CB/FFFFFF/png?text=Abstract' },
        { name: "Pop Art", description: "Characterized by bold imagery, bright color palettes, and iconography from popular culture.", previewImageUrl: 'https://placehold.co/100x100/FDD835/000000/png?text=Pop%20Art' },
        { name: "Vaporwave", description: "A nostalgic, surrealist aesthetic associated with 80s and 9-s internet culture, glitch art, and cyberpunk tropes." },
        { name: "Color Field Painting", description: "Characterized by large fields of solid, flat color." },
        { name: "Hard-Edge Painting", description: "An abstract style in which abrupt transitions are found between color areas." }
    ],
    "🏛️ Heritage": [
        { name: "Ukiyo-e", description: "Japanese woodblock prints from the Edo period, featuring subjects from history, landscapes, and kabuki actors.", previewImageUrl: 'https://placehold.co/100x100/E57373/FFFFFF/png?text=Ukiyo-e' },
        { name: "Renaissance", description: "A style from the 14th-16th centuries, characterized by realism, humanism, and classical influence." },
        { name: "Baroque", description: "A highly ornate and extravagant style from the 17th century, known for drama, deep color, and intense light." },
        { name: "Medieval", description: "Art of the Middle Ages, often religious, with stylized figures and rich symbolism." },
        { name: "Art Deco", description: "A style from the 1920s and 1930s, characterized by geometric shapes, rich colors, and lavish ornamentation.", previewImageUrl: 'https://placehold.co/100x100/CFB53B/000000/png?text=Art%20Deco' },
        { name: "Art Nouveau", description: "An ornamental style of art, architecture, and design prominent in western Europe and the USA from about 1890 until World War I." },
        { name: "Hudson River School", description: "A mid-19th century American art movement embodied by a group of landscape painters whose aesthetic vision was influenced by Romanticism." },
        { name: "Barbizon School", description: "A movement of painters who were part of the Realism movement, with a focus on landscapes." },
        { name: "Gothic", description: "A style of medieval art that developed in Northern France out of Romanesque art in the 12th century AD." },
        { name: "Minimalist", description: "A style that uses pared-down design elements.", previewImageUrl: 'https://placehold.co/100x100/E0E0E0/000000/png?text=Minimalist' },
        { name: "Line Art", description: "A style consisting of distinct straight or curved lines placed against a (usually plain) background, without gradations in shade or hue.", previewImageUrl: 'https://placehold.co/100x100/212121/FFFFFF/png?text=Line%20Art' },
        { name: "Flat Design", description: "A minimalist design language or design style, commonly used in graphical user interfaces." },
        { name: "Grunge", description: "An aesthetic that is characterized by a messy, unkempt, and distressed appearance." },
        { name: "Liminal Spaces", description: "An aesthetic that refers to the feeling of being in a transitional space, such as an empty hallway or waiting room." },
        { name: "Glitch Art", description: "The practice of using digital or analog errors for aesthetic purposes by either corrupting digital data or physically manipulating electronic devices." },
        { name: "Collage", description: "A piece of art made by sticking various different materials such as photographs and pieces of paper or fabric onto a backing." },
        { name: "Chalkboard", description: "An aesthetic that mimics the look of chalk on a blackboard." },
        { name: "Sketch", description: "A rapidly executed freehand drawing that is not usually intended as a finished work.", previewImageUrl: 'https://placehold.co/100x100/BDBDBD/000000/png?text=Sketch' },
        { name: "Monochrome", description: "An image created using only one color or shades of one color." },
        { name: "Isometric", description: "A method for visually representing three-dimensional objects in two dimensions in technical and engineering drawings." },
        { name: "Info Graphic", description: "A visual representation of information or data, e.g. as a chart or diagram." }
    ],
    "🌌 Fusion": [
        { name: "Cyber-Ghibli", description: "A fusion of the high-tech, dystopian elements of cyberpunk with the enchanting, natural worlds of Studio Ghibli." },
        { name: "Fantasy-Cyberpunk", description: "A blend of traditional fantasy tropes (magic, mythical creatures) with futuristic cyberpunk technology." },
        { name: "Techno-Organic", description: "A style that combines mechanical and technological elements with organic, natural forms." },
        { name: "Neo-Noir", description: "A modern take on the classic film noir style, often with a darker, more cynical tone and a focus on crime and mystery." },
        { name: "Cyberpunk Anime", description: "A popular subgenre of anime and manga that features futuristic, dystopian worlds and cybernetic enhancements." },
        { name: "Steampunk Fantasy", description: "Combines the steam-powered machinery of steampunk with the magical elements of fantasy." },
        { name: "Art Deco Sci-Fi", description: "A fusion of the elegant, geometric style of Art Deco with futuristic science fiction concepts." },
        { name: "Gothic Surrealism", description: "A blend of the dark, mysterious atmosphere of Gothic art with the dream-like, illogical scenes of Surrealism." },
        { name: "Pop Art Mythology", description: "Reimagines mythological figures and stories through the bold, colorful lens of Pop Art." },
        { name: "Minimalist Nature", description: "Depicts natural landscapes and elements using a simplified, minimalist aesthetic." },
        { name: "Baroque Cybernetics", description: "A fusion of the ornate, dramatic style of Baroque art with the high-tech, cybernetic themes of cyberpunk." }
    ],
    "🎨 Drawing": [
        { name: "Pencil", description: "A classic drawing style using graphite pencils, allowing for a wide range of tones and textures.", previewImageUrl: 'https://placehold.co/100x100/9E9E9E/FFFFFF/png?text=Pencil' },
        { name: "Charcoal", description: "A drawing style using charcoal, known for its rich, dark lines and soft, blendable quality.", previewImageUrl: 'https://placehold.co/100x100/424242/FFFFFF/png?text=Charcoal' },
        { name: "Ink", description: "A style using liquid ink, often with pens or brushes, to create bold, high-contrast images.", previewImageUrl: 'https://placehold.co/100x100/212121/FFFFFF/png?text=Ink' },
        { name: "Pastel", description: "A medium in the form of a stick, consisting of pure powdered pigment and a binder." },
        { name: "Marker", description: "A style using markers, known for their vibrant colors and ability to create both sharp lines and broad strokes." },
        { name: "Technical (Architectural Drafting / Blueprints)", description: "A precise, detailed style used for technical drawings, such as blueprints and architectural plans." },
        { name: "Sketch (Loose / Concept Sketch)", description: "A quick, informal drawing, often used to explore ideas and compositions." },
        { name: "Line Art", description: "A style that uses lines to create an image, without shading or color." },
        { name: "Doodle", description: "A simple, unfocused drawing made while a person's attention is otherwise occupied." }
    ],
    "📸 Photo": [
        { name: "Portrait", description: "A photograph of a person or group of people that captures the personality of the subject by using effective lighting, backdrops, and poses." },
        { name: "Landscape", description: "A photograph of natural scenery, such as mountains, valleys, trees, rivers, and forests." },
        { name: "Street", description: "A genre of photography that features the human condition within public places." },
        { name: "Fashion", description: "A genre of photography which is devoted to displaying clothing and other fashion items." },
        { name: "Macro", description: "Extreme close-up photography, usually of very small subjects, in which the size of the subject in the photograph is greater than life size." },
        { name: "Black & White", description: "A photograph where there is no color, only shades of grey." },
        { name: "Film / Analog", description: "Photography that uses a strip or sheet of transparent plastic film base coated on one side with a gelatin emulsion containing microscopically small light-sensitive silver halide crystals." },
        { name: "Aerial / Drone", description: "Photography taken from an aircraft or other flying object." },
        { name: "Wildlife", description: "A genre of photography concerned with documenting various forms of wildlife in their natural habitat." },
        { name: "Sports / Action", description: "A genre of photography that focuses on capturing a moment in an event, such as sports." }
    ],
    "💻 Digital Art": [
        { name: "Pixel", description: "A form of digital art, created through the use of software, where images are edited on the pixel level.", previewImageUrl: 'https://placehold.co/100x100/7E57C2/FFFFFF/png?text=Pixel' },
        { name: "Vector", description: "A form of computer graphics in which visual images are created directly from geometric shapes.", previewImageUrl: 'https://placehold.co/100x100/43A047/FFFFFF/png?text=Vector' },
        { name: "3D Render", description: "The process of creating a 2D image from a 3D model.", previewImageUrl: 'https://placehold.co/100x100/1E88E5/FFFFFF/png?text=3D%20Render' },
        { name: "Matte Painting", description: "A painted representation of a landscape, set, or distant location that allows filmmakers to create the illusion of an environment that is not present at the filming location." },
        { name: "Concept Art", description: "A form of illustration used to convey an idea for use in films, video games, animation, comic books, or other media before it is put into the final product." },
        { name: "Low Poly", description: "A polygon mesh in 3D computer graphics that has a relatively small number of polygons.", previewImageUrl: 'https://placehold.co/100x100/5E35B1/FFFFFF/png?text=Low%20Poly' },
        { name: "CGI", description: "Computer-generated imagery is the application of computer graphics to create or contribute to images in art, printed media, video games, simulators, computer animation and VFX in films, television programs, shorts, commercials, and videos." },
        { name: "Vaporwave", description: "A microgenre of electronic music, a visual art style, and an Internet meme that emerged in the early 2010s." },
        { name: "Cyberpunk", description: "A subgenre of science fiction in a futuristic setting that tends to focus on a 'combination of low-life and high tech.'" },
        { name: "Glitch", description: "The aesthetic of digital errors, created by corrupting the data of pictures." }
    ],
    "👉 Cel‑Shaded": [
        { name: "Disney ", description: "Classic Disney animation aesthetic, with expressive characters, fluid motion, and a timeless, family-friendly feel." },
        { name: "Low Poly ", description: "A minimalist 3D style using a small number of polygons, creating a geometric, abstract look." },
        { name: "Voxel / Minecraft ", description: "A blocky, pixelated art style made of 3D cubes, called voxels, similar to Minecraft." },
        { name: "Cel‑Shaded / Toon Shaded 3D ", description: "A 3D rendering technique to mimic the look of traditional 2D animation or comic books." }
    ],
    "✨ Misc": [
        { name: "Retro", description: "A style imitating trends, modes, and fashions from the past, particularly the 1950s-70s." },
        { name: "Vintage", description: "An aesthetic that represents a previous era, often with a sense of nostalgia and age." },
        { name: "Still Life", description: "Depicts inanimate subject matter, typically a small group of objects." },
        { name: "Landscape Painting", description: "Depicts natural scenery such as mountains, valleys, trees, rivers, and forests." },
        { name: "Figurative Painting", description: "Art that is derived from real object sources and so is, by definition, representational." },
        { name: "Genre Painting", description: "Scenes from everyday life, of ordinary people in work or recreation." },
        { name: "Portraiture", description: "The art of creating a portrait, which is a representation of a particular person." }
    ]
};