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

interface Substyle {
    name: string;
    description: string;
    imageUrl: string;
}

export const STYLE_TAXONOMY: { [key: string]: Substyle[] } = {
    "🎞️ Animation": [
        { name: "Anime", description: "Japanese animation style, characterized by vibrant colors, dramatic action, and expressive characters.", imageUrl: "https://i.ibb.co/P9gb6p8/anime.jpg" },
        { name: "Kawaii", description: "Cute, colorful and charming art style with rounded features.", imageUrl: "https://i.ibb.co/Bqc3jB2/kawaii.jpg" },
        { name: "Studio Ghibli", description: "Evokes the hand-drawn, enchanting style of Studio Ghibli films, known for lush landscapes and heartfelt storytelling.", imageUrl: "https://i.ibb.co/Y0L1tW8/studioghibli.jpg" },
        { name: "Disney Style", description: "Classic Disney animation aesthetic, with expressive characters, fluid motion, and a timeless, family-friendly feel.", imageUrl: "https://i.ibb.co/Pmw1d4x/disney.jpg" },
        { name: "Pixar Style", description: "Modern 3D animation of Pixar, known for incredible detail, realistic textures, and emotive character designs.", imageUrl: "https://i.ibb.co/hR2kC4M/pixar.jpg" },
        { name: "2D Animation", description: "Traditional flat animation style, reminiscent of classic cartoons and hand-drawn art.", imageUrl: "https://i.ibb.co/fQdY3R5/2danimation.jpg" },
        { name: "3D Animation", description: "Computer-generated 3D models and environments, offering depth, realism, and complex lighting.", imageUrl: "https://i.ibb.co/3YYT5X2/3danimation.jpg" },
        { name: "Chibi", description: "A super-deformed Japanese style where characters are drawn in an exaggerated, cute, and small form with large heads.", imageUrl: "https://i.ibb.co/K2vD1s5/chibi.jpg" },
        { name: "Comic Book", description: "Mimics Western comic books, with bold outlines, halftone dots (Ben-Day dots), and dynamic paneling.", imageUrl: "https://i.ibb.co/MPr8Gv1/comicbook.jpg" },
        { name: "Manga", description: "Japanese comic art style, typically in black and white with expressive linework and dynamic action.", imageUrl: "https://i.ibb.co/685s9tM/manga-style-preview.jpg" },
        { name: "Modern Anime", description: "Reflects contemporary anime trends, with sharp, detailed visuals and high-fidelity CGI integration.", imageUrl: "https://i.ibb.co/Wc2tXN4/modern-anime.jpg" },
        { name: "Funko Pop", description: "Based on vinyl figures, featuring characters with large, blocky heads and black button eyes.", imageUrl: "https://i.ibb.co/9G7zL6z/funkopop.jpg" },
        { name: "South Park", description: "A crude, cutout animation style, mimicking the look of the iconic television show.", imageUrl: "https://i.ibb.co/TqV42Jj/southpark.jpg" },
        { name: "Minecraft", description: "A blocky, pixelated aesthetic based on the video game, composed of cubes and voxels.", imageUrl: "https://i.ibb.co/qmxY5C2/minecraft.jpg" },
        { name: "Boxes Style", description: "An abstract or surreal style where objects and characters are composed of simple box or cube shapes.", imageUrl: "https://i.ibb.co/2d129F1/boxes.jpg" },
        { name: "GTA 5 Style", description: "Mimics the loading screen art of Grand Theft Auto V, with a stylized, painterly, and graphic novel-like quality.", imageUrl: "https://i.ibb.co/yQxG2C2/gta5.jpg" }
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
        { name: "Art Nouveau", description: "An ornamental style of art, architecture, and design prominent in the 1890s, characterized by intricate linear designs and flowing curves.", imageUrl: "https://i.ibb.co/Qmt44T5/artnouveau.jpg" },
        { name: "Hudson River School", description: "A mid-19th century American art movement embodied by a group of landscape painters whose aesthetic vision was influenced by Romanticism.", imageUrl: "https://i.ibb.co/J3Ffp82/hudsonriver.jpg" },
        { name: "Barbizon School", description: "A group of French painters of the mid-19th century who were part of the Realism movement, known for their landscape painting.", imageUrl: "https://i.ibb.co/zP0dGyP/barbizon.jpg" },
        { name: "Gothic", description: "A style of medieval art that developed in Northern France out of Romanesque art in the 12th century AD, characterized by stained glass and pointed arches.", imageUrl: "https://i.ibb.co/y0LpXfG/gothic.jpg" },
        { name: "Minimalist", description: "An extreme form of abstract art, where art is stripped down to its most fundamental features.", imageUrl: "https://i.ibb.co/yWSt53D/minimalist.jpg" },
        { name: "Line Art", description: "An image that consists of distinct straight or curved lines placed against a (usually plain) background, without gradations in shade or hue.", imageUrl: "https://i.ibb.co/GQLgR1G/lineart.jpg" },
        { name: "Flat Design", description: "A minimalist UI design genre that is currently used in various graphical user interfaces.", imageUrl: "https://i.ibb.co/gJFmF9r/flatdesign.jpg" },
        { name: "Grunge", description: "A distressed, messy, and often dark aesthetic inspired by 1990s alternative rock culture.", imageUrl: "https://i.ibb.co/51bJv2s/grunge.jpg" },
        { name: "Liminal Spaces", description: "An aesthetic that refers to the feeling of being in a transitional space, often empty and uncanny.", imageUrl: "https://i.ibb.co/3k5fC9r/liminal.jpg" },
        { name: "Glitch Art", description: "The practice of using digital or analog errors for aesthetic purposes by either corrupting digital data or physically manipulating electronic devices.", imageUrl: "https://i.ibb.co/hX5DMxT/glitch.jpg" },
        { name: "Collage", description: "A work of art made from an assemblage of different forms, thus creating a new whole.", imageUrl: "https://i.ibb.co/C5SpLvk/collage.jpg" },
        { name: "Chalkboard", description: "Simulates the look of chalk drawings on a blackboard, often with a rustic, hand-drawn feel.", imageUrl: "https://i.ibb.co/D7NqKkR/chalkboard.jpg" },
        { name: "Sketch", description: "A rough or unfinished drawing or painting, often made to assist in making a more finished picture.", imageUrl: "https://i.ibb.co/xLwBFtG/sketch.jpg" },
        { name: "Monochrome", description: "An image created using only one color or shades of one color.", imageUrl: "https://i.ibb.co/sK6Xyy7/monochrome.jpg" },
        { name: "Isometric", description: "A method for visually representing three-dimensional objects in two dimensions.", imageUrl: "https://i.ibb.co/pQ6Mgs4/isometric.jpg" },
        { name: "Info Graphic", description: "A visual representation of information or data, e.g. as a chart or diagram.", imageUrl: "https://i.ibb.co/WcZ4Y9k/infographic.jpg" }
    ],
    "🌌 Fusion": [
        { name: "Cyber-Ghibli", description: "A fusion of high-tech cyberpunk elements with the enchanting, natural worlds of Studio Ghibli.", imageUrl: "https://i.ibb.co/Xz9tNnN/cyberghibli.jpg" },
        { name: "Fantasy-Cyberpunk", description: "Combines traditional fantasy elements like magic and mythical creatures with a futuristic, cybernetic setting.", imageUrl: "https://i.ibb.co/8Y0S4jR/fantasycyberpunk.jpg" },
        { name: "Techno-Organic", description: "A style that blends mechanical and biological elements, creating biomechanical forms.", imageUrl: "https://i.ibb.co/q1zRk1M/technoorganic.jpg" },
        { name: "Neo-Noir", description: "A modern take on the classic film noir style, with dark, moody lighting, and a cynical, pessimistic tone.", imageUrl: "https://i.ibb.co/mR4jWpL/neonoir.jpg" },
        { name: "Cyberpunk Anime", description: "Fuses the aesthetics of Japanese animation with high-tech, dystopian cyberpunk themes.", imageUrl: "https://i.ibb.co/VMyh0q1/cyberpunkanime.jpg" },
        { name: "Steampunk Fantasy", description: "Blends the steam-powered technology of steampunk with classic fantasy elements like elves and dragons.", imageUrl: "https://i.ibb.co/3sJGTgG/steampunkfantasy.jpg" },
        { name: "Art Deco Sci-Fi", description: "A combination of the geometric, elegant style of Art Deco with futuristic science fiction concepts.", imageUrl: "https://i.ibb.co/XjkY6ww/artdecoscifi.jpg" },
        { name: "Gothic Surrealism", description: "Fuses the dark, ornate style of Gothic art with the bizarre, dreamlike imagery of Surrealism.", imageUrl: "https://i.ibb.co/yQj9K9S/gothicsurrealism.jpg" },
        { name: "Pop Art Mythology", description: "Depicts mythological figures and stories using the bold, vibrant style of Pop Art.", imageUrl: "https://i.ibb.co/2d1hV3x/popartmythology.jpg" },
        { name: "Minimalist Nature", description: "A style that represents natural landscapes and elements using simple, minimalist forms and colors.", imageUrl: "https://i.ibb.co/gZk2zHp/minimalistnature.jpg" },
        { name: "Baroque Cybernetics", description: "Merges the ornate, dramatic style of the Baroque period with futuristic cybernetic technology.", imageUrl: "https://i.ibb.co/Wf9yKDC/baroquecybernetics.jpg" }
    ],
    "🎨 Drawing": [
        { name: "Pencil", description: "A style that mimics the look of a graphite pencil drawing, with visible lines and shading.", imageUrl: "https://i.ibb.co/PggY7T7/pencil.jpg" },
        { name: "Charcoal", description: "Creates a rich, dark, and smudgy effect, similar to using charcoal sticks.", imageUrl: "https://i.ibb.co/k3t0kXB/charcoal.jpg" },
        { name: "Ink", description: "A style using bold, black lines and high contrast, like an ink pen or brush drawing.", imageUrl: "https://i.ibb.co/Jj6dYyW/ink.jpg" },
        { name: "Pastel", description: "Soft, powdery colors with a chalky texture, often blended for a smooth finish.", imageUrl: "https://i.ibb.co/mHXfB4N/pastel.jpg" },
        { name: "Marker", description: "Simulates the look of art markers, with vibrant, solid colors and visible stroke lines.", imageUrl: "https://i.ibb.co/WcKxHHZ/marker.jpg" },
        { name: "Technical (Architectural Drafting / Blueprints)", description: "A precise, clean-lined style resembling architectural blueprints or technical drawings.", imageUrl: "https://i.ibb.co/7Kz9gKz/technical.jpg" },
        { name: "Sketch (Loose / Concept Sketch)", description: "A style that looks like a quick, preliminary drawing, often with loose lines and an unfinished quality.", imageUrl: "https://i.ibb.co/xLwBFtG/sketch.jpg" },
        { name: "Line Art", description: "An image made of distinct straight and curved lines, without shading or color gradients.", imageUrl: "https://i.ibb.co/GQLgR1G/lineart.jpg" },
        { name: "Doodle", description: "A whimsical, freeform drawing style, often with playful and imaginative elements.", imageUrl: "https://i.ibb.co/Yd4Bf8p/doodle.jpg" }
    ],
    "📸 Photo": [
        { name: "Portrait", description: "Focuses on capturing the likeness, personality, and mood of a person or group of people.", imageUrl: "https://i.ibb.co/ZTHCFsV/portrait.jpg" },
        { name: "Landscape", description: "Depicts natural scenery such as mountains, valleys, trees, rivers, and forests.", imageUrl: "https://i.ibb.co/N1pXm5p/landscape.jpg" },
        { name: "Street", description: "Captures candid moments of everyday life in public places.", imageUrl: "https://i.ibb.co/6PqjF5q/street.jpg" },
        { name: "Fashion", description: "Showcases clothing and other fashion items, often in an artistic or exotic location.", imageUrl: "https://i.ibb.co/rpxmJ19/fashion.jpg" },
        { name: "Macro", description: "Extreme close-up photography, usually of very small subjects, in which the size of the subject in the photograph is greater than life size.", imageUrl: "https://i.ibb.co/yNf9cW8/macro.jpg" },
        { name: "Black & White", description: "An image where all color has been removed, consisting of shades of grey.", imageUrl: "https://i.ibb.co/3s8s3ft/blackandwhite.jpg" },
        { name: "Film / Analog", description: "Mimics the look of traditional film photography, often with grain, specific color casts, and light leaks.", imageUrl: "https://i.ibb.co/yF3m6tq/film.jpg" },
        { name: "Aerial / Drone", description: "A photograph taken from an elevated position, such as from an aircraft or drone.", imageUrl: "https://i.ibb.co/zXn2pW7/drone.jpg" },
        { name: "Wildlife", description: "Focuses on animals in their natural habitat.", imageUrl: "https://i.ibb.co/GcF4x9G/wildlife.jpg" },
        { name: "Sports / Action", description: "Captures a moment of peak action in a sporting event.", imageUrl: "https://i.ibb.co/bF9gV6q/sports.jpg" }
    ],
    "💻 Digital Art": [
        { name: "Pixel", description: "Art created at the pixel level, with a characteristic blocky, retro video game look.", imageUrl: "https://i.ibb.co/Mh2gW0Y/pixel.jpg" },
        { name: "Vector", description: "Uses mathematical equations to create clean lines and shapes that can be scaled infinitely without losing quality.", imageUrl: "https://i.ibb.co/qJ8Bv12/vector.jpg" },
        { name: "3D Render", description: "A realistic image created from a 3D model using computer software.", imageUrl: "https://i.ibb.co/k0g9S5H/3drender.jpg" },
        { name: "Matte Painting", description: "A painted representation of a landscape, set, or distant location that allows filmmakers to create the illusion of an environment.", imageUrl: "https://i.ibb.co/v4d2yv6/mattepainting.jpg" },
        { name: "Concept Art", description: "A form of illustration used to convey an idea for use in films, video games, animation, or comic books before it is put into the final product.", imageUrl: "https://i.ibb.co/hK8tD6x/conceptart.jpg" },
        { name: "Low Poly", description: "A polygon mesh in 3D computer graphics that has a small number of polygons, creating a distinct, blocky style.", imageUrl: "https://i.ibb.co/9G73Jm3/lowpoly.jpg" },
        { name: "CGI", description: "Computer-Generated Imagery, used for creating realistic special effects and scenes.", imageUrl: "https://i.ibb.co/JdBDb0N/cgi.jpg" },
        { name: "Vaporwave", description: "A nostalgic, surrealist aesthetic associated with 80s and 9-s internet culture, glitch art, and cyberpunk tropes.", imageUrl: "https://i.ibb.co/pLtPZbf/vaporwave.jpg" },
        { name: "Cyberpunk", description: "A futuristic, high-tech, low-life setting, often featuring neon lights, cybernetics, and dystopian cityscapes.", imageUrl: "https://i.ibb.co/s51gR08/cyberpunk.jpg" },
        { name: "Glitch", description: "The aesthetic of digital errors, characterized by visual artifacts and data corruption.", imageUrl: "https://i.ibb.co/hX5DMxT/glitch.jpg" }
    ],
    "👉 Cel‑Shaded": [
        { name: "Disney", description: "Mimics the classic 2D animation style of Disney, with clean lines and expressive characters.", imageUrl: "https://i.ibb.co/Pmw1d4x/disney.jpg" },
        { name: "Low Poly", description: "A 3D style with a small number of polygons, creating a faceted, geometric look with flat shading.", imageUrl: "https://i.ibb.co/9G73Jm3/lowpoly.jpg" },
        { name: "Voxel / Minecraft", description: "A 3D style that uses volumetric pixels (voxels), resulting in a blocky, cubic appearance.", imageUrl: "https://i.ibb.co/qmxY5C2/minecraft.jpg" },
        { name: "Cel‑Shaded / Toon Shaded 3D", description: "A 3D rendering technique that makes the image appear flat, like a cartoon or comic book.", imageUrl: "https://i.ibb.co/JdBDb0N/cgi.jpg" }
    ],
    "✨ Misc": [
        { name: "Retro", description: "An aesthetic that imitates trends, modes, and styles from the recent past, particularly the 1950s-70s.", imageUrl: "https://i.ibb.co/bQw09yH/retro.jpg" },
        { name: "Vintage", description: "An aesthetic that refers to styles from a bygone era, often with a sense of nostalgia and quality.", imageUrl: "https://i.ibb.co/jGMf4kP/vintage.jpg" },
        { name: "Still Life", description: "Depicts inanimate subject matter, typically a small group of objects.", imageUrl: "https://i.ibb.co/zJ3KzS3/stilllife.jpg" },
        { name: "Landscape Painting", description: "The depiction of natural scenery in art.", imageUrl: "https://i.ibb.co/f4Nq7p0/impressionism.jpg" },
        { name: "Figurative Painting", description: "Art that is derived from real object sources, and so is, by definition, representational.", imageUrl: "https://i.ibb.co/18r83Dq/renaissance.jpg" },
        { name: "Genre Painting", description: "A style of painting depicting scenes from ordinary life, both domestic and public.", imageUrl: "https://i.ibb.co/3sJGTgG/steampunkfantasy.jpg" },
        { name: "Portraiture", description: "The art of creating a portrait, which is a representation of a particular person.", imageUrl: "https://i.ibb.co/ZTHCFsV/portrait.jpg" }
    ]
};


export const NUMBER_OF_IMAGES_OPTIONS: string[] = [
    "1",
    "2",
    "3",
    "4"
];

export const MAX_HISTORY_SIZE = 12;