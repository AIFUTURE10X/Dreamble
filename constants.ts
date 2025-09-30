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

export const NUMBER_OF_IMAGES_OPTIONS: string[] = ["1", "2", "3", "4"];
export const MAX_HISTORY_SIZE: number = 50;

export interface Substyle {
    name: string;
    description: string;
    imageUrl: string;
    tags?: string[];
}

export const STYLE_TAXONOMY: { [key: string]: Substyle[] } = {
    "🎞️ Animation": [
        { name: "Anime", description: "Japanese animation style, characterized by vibrant colors, dramatic action, and expressive characters.", imageUrl: "https://i.ibb.co/P9gb6p8/anime.jpg", tags: ["Expressive Characters", "Vibrant Colors"] },
        { name: "Kawaii", description: "Cute, colorful and charming art style with rounded features.", imageUrl: "https://i.ibb.co/Bqc3jB2/kawaii.jpg", tags: ["Cute", "Pastel Colors"] },
        { name: "Studio Ghibli", description: "Evokes the hand-drawn, enchanting style of Studio Ghibli films, known for lush landscapes and heartfelt storytelling.", imageUrl: "https://i.ibb.co/Y0L1tW8/studioghibli.jpg", tags: ["Whimsical", "Natural Settings"] },
        { name: "Disney Style", description: "Classic family-friendly animation with smooth features.", imageUrl: "https://i.ibb.co/Pmw1d4x/disney.jpg", tags: ["Smooth features", "Bright colors"] },
        { name: "Pixar Style", description: "Modern 3D animation of Pixar, known for incredible detail, realistic textures, and emotive character designs.", imageUrl: "https://i.ibb.co/hR2kC4M/pixar.jpg", tags: ["3D Animation", "Detailed Textures"] },
        { name: "2D Animation", description: "Traditional flat animation style, reminiscent of classic cartoons and hand-drawn art.", imageUrl: "https://i.ibb.co/fQdY3R5/2danimation.jpg", tags: ["Flat Design", "Bold Colors"] },
        { name: "3D Animation", description: "Computer-generated 3D models and environments, offering depth, realism, and complex lighting.", imageUrl: "https://i.ibb.co/3YYT5X2/3danimation.jpg" },
        { name: "Chibi", description: "A super-deformed Japanese style where characters are drawn in an exaggerated, cute, and small form with large heads.", imageUrl: "https://i.ibb.co/K2vD1s5/chibi.jpg" },
        { name: "Comic Book", description: "Mimics Western comic books, with bold outlines, halftone dots (Ben-Day dots), and dynamic paneling.", imageUrl: "https://i.ibb.co/6rC6hH8/comic-book.jpg", tags: ["Bold Outlines", "Dynamic Paneling"] },
        { name: "Manga", description: "Japanese comic art style, typically in black and white with expressive linework and dynamic action.", imageUrl: "https://i.ibb.co/dKSmqfD/manga-style-fixed.jpg" },
        { name: "Modern Anime", description: "Contemporary anime style with clean lines, high-definition quality, and modern character designs.", imageUrl: "https://i.ibb.co/hL4gYxQ/modernanime.jpg" },
        { name: "Funko Pop", description: "The distinct style of Funko Pop vinyl figures, with large heads, black eyes, and simple, cute designs.", imageUrl: "https://i.ibb.co/6rW8F2S/funkopop.jpg" },
        { name: "South Park", description: "The simple, construction-paper cutout animation style of the show South Park.", imageUrl: "https://i.ibb.co/MfZt1N1/southpark.jpg" },
        { name: "Minecraft", description: "A blocky, pixelated art style inspired by the video game Minecraft.", imageUrl: "https://i.ibb.co/L8yNSwM/minecraft.jpg" },
        { name: "Boxes Style", description: "A simplified, geometric style using cubes and rectangular prisms to build characters and environments.", imageUrl: "https://i.ibb.co/V9z0D17/boxes.jpg" },
        { name: "GTA 5 Style", description: "Mimics the stylized, slightly gritty, and realistic look of the video game Grand Theft Auto V.", imageUrl: "https://i.ibb.co/wJ2D3T2/gta5.jpg" }
    ],
    "📸 Realism": [
        { name: "Realistic", description: "A style that aims to represent subjects truthfully, without artificiality.", imageUrl: "https://i.ibb.co/mHFR5p6/realistic.jpg" },
        { name: "Photorealistic", description: "Aims to reproduce an image as realistically as a photograph.", imageUrl: "https://i.ibb.co/XWk29d1/photorealistic.jpg" },
        { name: "Hyperrealism", description: "A genre resembling a high-resolution photograph, often with an emphasis on fine details and textures.", imageUrl: "https://i.ibb.co/yqYQZgS/hyperrealism.jpg" },
        { name: "Cinematic", description: "A style that mimics the look of a movie, often with dramatic lighting, specific color grading, and a widescreen feel.", imageUrl: "https://i.ibb.co/qDWMzWj/cinematic.jpg" },
        { name: "HDR (High Dynamic Range)", description: "Creates a more dramatic image with a greater range of detail in both the shadows and highlights.", imageUrl: "https://i.ibb.co/924M4bH/hdr.jpg" }
    ],
    "🔮 Fantasy": [
        { name: "Dark Fantasy", description: "A subgenre that combines fantasy with elements of horror, creating a dark, frightening, and often gloomy atmosphere.", imageUrl: "https://i.ibb.co/Cbf00j6/darkfantasy.jpg" },
        { name: "Fairy Tale", description: "A whimsical and magical style, often featuring fantastical creatures, enchanted forests, and castles.", imageUrl: "https://i.ibb.co/rQ2vL2C/fairytale.jpg" },
        { name: "Mythical", description: "A style inspired by myths, legends, and folklore, often featuring gods, heroes, and epic creatures.", imageUrl: "https://i.ibb.co/zH2Lprp/mythical.jpg" },
        { name: "Dreamlike", description: "A surreal and ethereal style, characterized by soft focus, strange juxtapositions, and a sense of unreality.", imageUrl: "https://i.ibb.co/jGGxWDS/dreamlike.jpg" },
        { name: "Dreamcore", description: "An aesthetic based on dreams and surreal imagery, often with a nostalgic or unsettling feeling.", imageUrl: "https://i.ibb.co/DzdP0H1/dreamcore.jpg" }
    ],
    "🚀 Sci-Fi": [
        { name: "Cyberpunk", description: "A futuristic, high-tech, low-life setting, often featuring neon lights, cybernetics, and dystopian cityscapes.", imageUrl: "https://i.ibb.co/s51gR08/cyberpunk.jpg" },
        { name: "Steampunk", description: "A retrofuturistic style inspired by 19th-century industrial steam-powered machinery.", imageUrl: "https://i.ibb.co/gDFvFnP/steampunk.jpg" },
        { name: "Solarpunk", description: "An optimistic vision of the future, focusing on renewable energy, nature, and sustainable technology.", imageUrl: "https://i.ibb.co/yRkFDGz/solarpunk.jpg" },
        { name: "Biopunk", description: "Focuses on the unintended consequences of biotechnology, featuring genetic engineering and organic modifications.", imageUrl: "https://i.ibb.co/18yGgS1/biopunk.jpg" },
        { name: "Retro-Futurism", description: "A vision of the future from the perspective of an earlier era, often the mid-20th century.", imageUrl: "https://i.ibb.co/Q8M01tW/retrofuturism.jpg" },
        { name: "Synthwave", description: "A retro aesthetic inspired by 1980s film, video game, and music culture, with neon grids and futuristic cars.", imageUrl: "https://i.ibb.co/f2pB1w6/synthwave.jpg" },
        { name: "Sci-Fi", description: "A broad style encompassing futuristic technology, space exploration, and scientific concepts.", imageUrl: "https://i.ibb.co/F8q1ffK/scifi.jpg" },
        { name: "Eco-Futurism", description: "Explores future societies that have achieved a sustainable and ecological balance.", imageUrl: "https://i.ibb.co/jwnYQ4k/ecofuturism.jpg" }
    ],
    "🖌️ Painting": [
        { name: "Oil Painting", description: "Rich, deep colors with a visible texture, mimicking traditional oil on canvas.", imageUrl: "https://i.ibb.co/pZ4tGk4/oilpainting.jpg" },
        { name: "Watercolor", description: "Soft, translucent colors with a fluid and often spontaneous appearance.", imageUrl: "https://i.ibb.co/bFqYVp8/watercolor.jpg" },
        { name: "Acrylic Painting", description: "Bold, vibrant colors with a fast-drying, plastic-like finish.", imageUrl: "https://i.ibb.co/7C96T5x/acrylic.jpg" },
        { name: "Fresco", description: "A mural painting technique on fresh lime plaster, resulting in a matte, earthy finish.", imageUrl: "https://i.ibb.co/pwnLd3G/fresco.jpg" },
        { name: "Encaustic", description: "A style using heated beeswax mixed with colored pigments, known for its layered, textured look.", imageUrl: "https://i.ibb.co/zsywzMj/encaustic.jpg" },
        { name: "Tempera", description: "A fast-drying medium using pigment mixed with a water-soluble binder, like egg yolk, with a matte finish.", imageUrl: "https://i.ibb.co/BGCdM1Y/tempera.jpg" },
        { name: "Pointillism", description: "A technique using tiny dots of color that blend in the viewer's eye.", imageUrl: "https://i.ibb.co/sKkL3gT/pointillism.jpg" },
        { name: "Palette Knife Painting", description: "A style using a knife instead of a brush to apply thick, textured strokes of paint.", imageUrl: "https://i.ibb.co/9p2CcJg/paletteknife.jpg" },
        { name: "Impasto", description: "A technique where paint is laid on an area of the surface in very thick layers.", imageUrl: "https://i.ibb.co/SVS9vjM/impasto.jpg" },
        { name: "Grisaille", description: "A method of painting in monochrome, typically in shades of grey.", imageUrl: "https://i.ibb.co/F5L1GvC/grisaille.jpg" },
        { name: "Tonalism", description: "An artistic style that emerged in the 1880s characterized by soft, diffused light, and muted tones.", imageUrl: "https://i.ibb.co/cwtBF1g/tonalism.jpg" },
        { name: "Impressionism", description: "Characterized by small, thin, yet visible brush strokes, and an accurate depiction of light.", imageUrl: "https://i.ibb.co/f4Nq7p0/impressionism.jpg" },
        { name: "Expressionism", description: "A style in which the artist seeks to depict not objective reality but rather the subjective emotions.", imageUrl: "https://i.ibb.co/3WfK9F9/expressionism.jpg" },
        { name: "Surrealism", description: "Features dream-like, bizarre, and illogical scenes.", imageUrl: "https://i.ibb.co/y5fC0v8/surrealism.jpg" },
        { name: "Abstract", description: "Uses visual language of shape, form, color, and line to create a composition which may exist with a degree of independence from visual references.", imageUrl: "https://i.ibb.co/Qk0VpG1/abstract.jpg" },
        { name: "Pop Art", description: "Characterized by bold imagery, bright color palettes, and iconography from popular culture.", imageUrl: "https://i.ibb.co/mCbL1Qp/popart.jpg" },
        { name: "Vaporwave", description: "A nostalgic, surrealist aesthetic associated with 80s and 9-s internet culture, glitch art, and cyberpunk tropes.", imageUrl: "https://i.ibb.co/pLtPZbf/vaporwave.jpg" },
        { name: "Color Field Painting", description: "Characterized by large fields of solid, flat color.", imageUrl: "https://i.ibb.co/3mNryg6/colorfield.jpg" },
        { name: "Hard-Edge Painting", description: "An abstract style in which abrupt transitions are found between color areas.", imageUrl: "https://i.ibb.co/yS5vBtF/hardedge.jpg" }
    ],
    "🏛️ Heritage": [
        { name: "Ukiyo-e", description: "Japanese woodblock prints from the Edo period, featuring subjects from history, landscapes, and kabuki actors.", imageUrl: "https://i.ibb.co/hZ2vXWj/ukiyoe.jpg" },
        { name: "Renaissance", description: "A style from the 14th-16th centuries, characterized by realism, humanism, and classical influence.", imageUrl: "https://i.ibb.co/18r83Dq/renaissance.jpg" },
        { name: "Baroque", description: "A highly ornate and extravagant style from the 17th century, known for drama, deep color, and intense light.", imageUrl: "https://i.ibb.co/mN7B1D3/baroque.jpg" },
        { name: "Medieval", description: "Art of the Middle Ages, often religious, with stylized figures and rich symbolism.", imageUrl: "https://i.ibb.co/1Mj23bQ/medieval.jpg" },
        { name: "Art Deco", description: "A style from the 1920s and 1930s, characterized by geometric shapes, rich colors, and lavish ornamentation.", imageUrl: "https://i.ibb.co/zNczfM1/artdeco.jpg" },
        { name: "Art Nouveau", description: "An ornamental style of art, architecture, and design prominent in western Europe and the USA from about 1890 until World War I.", imageUrl: "https://i.ibb.co/6yF9v0M/artnouveau.jpg" },
        { name: "Hudson River School", description: "A mid-19th century American art movement embodied by a group of landscape painters whose aesthetic vision was influenced by Romanticism.", imageUrl: "https://i.ibb.co/N2c5Y1J/hudsonriver.jpg" },
        { name: "Barbizon School", description: "A movement of painters who were part of the Realism movement, with a focus on landscapes.", imageUrl: "https://i.ibb.co/RHYyCq7/barbizon.jpg" },
        { name: "Gothic", description: "A style of medieval art that developed in Northern France out of Romanesque art in the 12th century AD.", imageUrl: "https://i.ibb.co/JmBwZ1c/gothic.jpg" },
        { name: "Minimalist", description: "A style that uses pared-down design elements.", imageUrl: "https://i.ibb.co/z4V9Z2f/minimalist.jpg" },
        { name: "Line Art", description: "A style consisting of distinct straight or curved lines placed against a (usually plain) background, without gradations in shade or hue.", imageUrl: "https://i.ibb.co/Rz3yV8C/lineart.jpg" },
        { name: "Flat Design", description: "A minimalist design language or design style, commonly used in graphical user interfaces.", imageUrl: "https://i.ibb.co/J2V82vJ/flatdesign.jpg" },
        { name: "Grunge", description: "An aesthetic that is characterized by a messy, unkempt, and distressed appearance.", imageUrl: "https://i.ibb.co/D8Vw4rQ/grunge.jpg" },
        { name: "Liminal Spaces", description: "An aesthetic that refers to the feeling of being in a transitional space, such as an empty hallway or waiting room.", imageUrl: "https://i.ibb.co/9vj8XwW/liminal.jpg" },
        { name: "Glitch Art", description: "The practice of using digital or analog errors for aesthetic purposes by either corrupting digital data or physically manipulating electronic devices.", imageUrl: "https://i.ibb.co/Zc2C1g3/glitch.jpg" },
        { name: "Collage", description: "A piece of art made by sticking various different materials such as photographs and pieces of paper or fabric onto a backing.", imageUrl: "https://i.ibb.co/K7s3Y2X/collage.jpg" },
        { name: "Chalkboard", description: "An aesthetic that mimics the look of chalk on a blackboard.", imageUrl: "https://i.ibb.co/d6x9zQ1/chalkboard.jpg" },
        { name: "Sketch", description: "A rapidly executed freehand drawing that is not usually intended as a finished work.", imageUrl: "https://i.ibb.co/mD0Yc0d/sketch.jpg" },
        { name: "Monochrome", description: "An image created using only one color or shades of one color.", imageUrl: "https://i.ibb.co/4Tf5tYv/monochrome.jpg" },
        { name: "Isometric", description: "A method for visually representing three-dimensional objects in two dimensions in technical and engineering drawings.", imageUrl: "https://i.ibb.co/Ybf62sW/isometric.jpg" },
        { name: "Info Graphic", description: "A visual representation of information or data, e.g. as a chart or diagram.", imageUrl: "https://i.ibb.co/GCPs0n9/infographic.jpg" }
    ],
    "🌌 Fusion": [
        { name: "Cyber-Ghibli", description: "A fusion of the high-tech, dystopian elements of cyberpunk with the enchanting, natural worlds of Studio Ghibli.", imageUrl: "https://i.ibb.co/Y0L1tW8/studioghibli.jpg" },
        { name: "Fantasy-Cyberpunk", description: "A blend of traditional fantasy tropes (magic, mythical creatures) with futuristic cyberpunk technology.", imageUrl: "https://i.ibb.co/s51gR08/cyberpunk.jpg" },
        { name: "Techno-Organic", description: "A style that combines mechanical and technological elements with organic, natural forms.", imageUrl: "https://i.ibb.co/18yGgS1/biopunk.jpg" },
        { name: "Neo-Noir", description: "A modern take on the classic film noir style, often with a darker, more cynical tone and a focus on crime and mystery.", imageUrl: "https://i.ibb.co/qDWMzWj/cinematic.jpg" },
        { name: "Cyberpunk Anime", description: "A popular subgenre of anime and manga that features futuristic, dystopian worlds and cybernetic enhancements.", imageUrl: "https://i.ibb.co/P9gb6p8/anime.jpg" },
        { name: "Steampunk Fantasy", description: "Combines the steam-powered machinery of steampunk with the magical elements of fantasy.", imageUrl: "https://i.ibb.co/gDFvFnP/steampunk.jpg" },
        { name: "Art Deco Sci-Fi", description: "A fusion of the elegant, geometric style of Art Deco with futuristic science fiction concepts.", imageUrl: "https://i.ibb.co/zNczfM1/artdeco.jpg" },
        { name: "Gothic Surrealism", description: "A blend of the dark, mysterious atmosphere of Gothic art with the dream-like, illogical scenes of Surrealism.", imageUrl: "https://i.ibb.co/JmBwZ1c/gothic.jpg" },
        { name: "Pop Art Mythology", description: "Reimagines mythological figures and stories through the bold, colorful lens of Pop Art.", imageUrl: "https://i.ibb.co/mCbL1Qp/popart.jpg" },
        { name: "Minimalist Nature", description: "Depicts natural landscapes and elements using a simplified, minimalist aesthetic.", imageUrl: "https://i.ibb.co/z4V9Z2f/minimalist.jpg" },
        { name: "Baroque Cybernetics", description: "A fusion of the ornate, dramatic style of Baroque art with the high-tech, cybernetic themes of cyberpunk.", imageUrl: "https://i.ibb.co/mN7B1D3/baroque.jpg" }
    ],
    "🎨 Drawing": [
        { name: "Pencil", description: "A classic drawing style using graphite pencils, allowing for a wide range of tones and textures.", imageUrl: "https://i.ibb.co/mD0Yc0d/sketch.jpg" },
        { name: "Charcoal", description: "A drawing style using charcoal, known for its rich, dark lines and soft, blendable quality.", imageUrl: "https://i.ibb.co/4Tf5tYv/monochrome.jpg" },
        { name: "Ink", description: "A style using liquid ink, often with pens or brushes, to create bold, high-contrast images.", imageUrl: "https://i.ibb.co/Rz3yV8C/lineart.jpg" },
        { name: "Pastel", description: "A medium in the form of a stick, consisting of pure powdered pigment and a binder.", imageUrl: "https://i.ibb.co/f4Nq7p0/impressionism.jpg" },
        { name: "Marker", description: "A style using markers, known for their vibrant colors and ability to create both sharp lines and broad strokes.", imageUrl: "https://i.ibb.co/MPr8Gv1/comicbook.jpg" },
        { name: "Technical (Architectural Drafting / Blueprints)", description: "A precise, detailed style used for technical drawings, such as blueprints and architectural plans.", imageUrl: "https://i.ibb.co/Ybf62sW/isometric.jpg" },
        { name: "Sketch (Loose / Concept Sketch)", description: "A quick, informal drawing, often used to explore ideas and compositions.", imageUrl: "https://i.ibb.co/mD0Yc0d/sketch.jpg" },
        { name: "Line Art", description: "A style that uses lines to create an image, without shading or color.", imageUrl: "https://i.ibb.co/Rz3yV8C/lineart.jpg" },
        { name: "Doodle", description: "A simple, unfocused drawing made while a person's attention is otherwise occupied.", imageUrl: "https://i.ibb.co/K7s3Y2X/collage.jpg" }
    ],
    "📸 Photo": [
        { name: "Portrait", description: "A photograph of a person or group of people that captures the personality of the subject by using effective lighting, backdrops, and poses.", imageUrl: "https://i.ibb.co/pZ4tGk4/oilpainting.jpg" },
        { name: "Landscape", description: "A photograph of natural scenery, such as mountains, valleys, trees, rivers, and forests.", imageUrl: "https://i.ibb.co/N2c5Y1J/hudsonriver.jpg" },
        { name: "Street", description: "A genre of photography that features the human condition within public places.", imageUrl: "https://i.ibb.co/qDWMzWj/cinematic.jpg" },
        { name: "Fashion", description: "A genre of photography which is devoted to displaying clothing and other fashion items.", imageUrl: "https://i.ibb.co/mHFR5p6/realistic.jpg" },
        { name: "Macro", description: "Extreme close-up photography, usually of very small subjects, in which the size of the subject in the photograph is greater than life size.", imageUrl: "https://i.ibb.co/XWk29d1/photorealistic.jpg" },
        { name: "Black & White", description: "A photograph where there is no color, only shades of grey.", imageUrl: "https://i.ibb.co/4Tf5tYv/monochrome.jpg" },
        { name: "Film / Analog", description: "Photography that uses a strip or sheet of transparent plastic film base coated on one side with a gelatin emulsion containing microscopically small light-sensitive silver halide crystals.", imageUrl: "https://i.ibb.co/c8gW5C7/vintage.jpg" },
        { name: "Aerial / Drone", description: "Photography taken from an aircraft or other flying object.", imageUrl: "https://i.ibb.co/jwnYQ4k/ecofuturism.jpg" },
        { name: "Wildlife", description: "A genre of photography concerned with documenting various forms of wildlife in their natural habitat.", imageUrl: "https://i.ibb.co/yRkFDGz/solarpunk.jpg" },
        { name: "Sports / Action", description: "A genre of photography that focuses on capturing a moment in an event, such as sports.", imageUrl: "https://i.ibb.co/924M4bH/hdr.jpg" }
    ],
    "💻 Digital Art": [
        { name: "Pixel", description: "A form of digital art, created through the use of software, where images are edited on the pixel level.", imageUrl: "https://i.ibb.co/L8yNSwM/minecraft.jpg" },
        { name: "Vector", description: "A form of computer graphics in which visual images are created directly from geometric shapes.", imageUrl: "https://i.ibb.co/J2V82vJ/flatdesign.jpg" },
        { name: "3D Render", description: "The process of creating a 2D image from a 3D model.", imageUrl: "https://i.ibb.co/3YYT5X2/3danimation.jpg" },
        { name: "Matte Painting", description: "A painted representation of a landscape, set, or distant location that allows filmmakers to create the illusion of an environment that is not present at the filming location.", imageUrl: "https://i.ibb.co/f4Nq7p0/impressionism.jpg" },
        { name: "Concept Art", description: "A form of illustration used to convey an idea for use in films, video games, animation, comic books, or other media before it is put into the final product.", imageUrl: "https://i.ibb.co/s51gR08/cyberpunk.jpg" },
        { name: "Low Poly", description: "A polygon mesh in 3D computer graphics that has a relatively small number of polygons.", imageUrl: "https://i.ibb.co/LpLwPLK/lowpoly.jpg" },
        { name: "CGI", description: "Computer-generated imagery is the application of computer graphics to create or contribute to images in art, printed media, video games, simulators, computer animation and VFX in films, television programs, shorts, commercials, and videos.", imageUrl: "https://i.ibb.co/hR2kC4M/pixar.jpg" },
        { name: "Vaporwave", description: "A microgenre of electronic music, a visual art style, and an Internet meme that emerged in the early 2010s.", imageUrl: "https://i.ibb.co/pLtPZbf/vaporwave.jpg" },
        { name: "Cyberpunk", description: "A subgenre of science fiction in a futuristic setting that tends to focus on a 'combination of low-life and high tech.'", imageUrl: "https://i.ibb.co/s51gR08/cyberpunk.jpg" },
        { name: "Glitch", description: "The aesthetic of digital errors, created by corrupting the data of pictures.", imageUrl: "https://i.ibb.co/Zc2C1g3/glitch.jpg" }
    ],
    "👉 Cel‑Shaded": [
        { name: "Disney ", description: "Classic Disney animation aesthetic, with expressive characters, fluid motion, and a timeless, family-friendly feel.", imageUrl: "https://i.ibb.co/Pmw1d4x/disney.jpg" },
        { name: "Low Poly ", description: "A minimalist 3D style using a small number of polygons, creating a geometric, abstract look.", imageUrl: "https://i.ibb.co/LpLwPLK/lowpoly.jpg" },
        { name: "Voxel / Minecraft ", description: "A blocky, pixelated art style made of 3D cubes, called voxels, similar to Minecraft.", imageUrl: "https://i.ibb.co/L8yNSwM/minecraft.jpg" },
        { name: "Cel‑Shaded / Toon Shaded 3D ", description: "A 3D rendering technique to mimic the look of traditional 2D animation or comic books.", imageUrl: "https://i.ibb.co/fQdY3R5/2danimation.jpg" }
    ],
    "✨ Misc": [
        { name: "Retro", description: "A style imitating trends, modes, and fashions from the past, particularly the 1950s-70s.", imageUrl: "https://i.ibb.co/mX5qJ1q/retro.jpg" },
        { name: "Vintage", description: "An aesthetic that represents a previous era, often with a sense of nostalgia and age.", imageUrl: "https://i.ibb.co/c8gW5C7/vintage.jpg" },
        { name: "Still Life", description: "Depicts inanimate subject matter, typically a small group of objects.", imageUrl: "https://i.ibb.co/bzzYjLw/stilllife.jpg" },
        { name: "Landscape Painting", description: "Depicts natural scenery such as mountains, valleys, trees, rivers, and forests.", imageUrl: "https://i.ibb.co/f4Nq7p0/impressionism.jpg" },
        { name: "Figurative Painting", description: "Art that is derived from real object sources and so is, by definition, representational.", imageUrl: "https://i.ibb.co/18r83Dq/renaissance.jpg" },
        { name: "Genre Painting", description: "Scenes from everyday life, of ordinary people in work or recreation.", imageUrl: "https://i.ibb.co/SVS9vjM/impasto.jpg" },
        { name: "Portraiture", description: "The art of creating a portrait, which is a representation of a particular person.", imageUrl: "https://i.ibb.co/pZ4tGk4/oilpainting.jpg" }
    ]
};
