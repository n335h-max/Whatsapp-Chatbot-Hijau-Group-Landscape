// Catalog image URLs (upload these images to a public URL or use Imgur/Cloudinary)
const catalogs = {
    water_feature: {
        images: [
            // Add your water feature catalog image URLs here
            // Example: 'https://example.com/water-feature-1.jpg'
        ],
        caption_ms: '🌊 Katalog Water Feature Hijau Group Landscape\n\nUntuk maklumat lanjut dan harga, sila hubungi Team Sales.',
        caption_en: '🌊 Water Feature Catalog - Hijau Group Landscape\n\nFor more details and pricing, please contact our Sales Team.'
    },
    planter_box: {
        images: [
            // Add your planter box catalog image URLs here
        ],
        caption_ms: '🪴 Katalog Planter Box & Bench\n\nPelbagai design dan saiz tersedia. Hubungi Team Sales untuk quotation.',
        caption_en: '🪴 Planter Box & Bench Catalog\n\nVarious designs and sizes available. Contact Sales Team for quotation.'
    },
    stepping_slabs: {
        images: [
            // Add your stepping slabs catalog image URLs here
        ],
        caption_ms: '🪨 Katalog Stepping Slabs\n\nBerbagai corak dan material tersedia. Hubungi Team Sales untuk info lanjut.',
        caption_en: '🪨 Stepping Slabs Catalog\n\nVarious patterns and materials available. Contact Sales Team for more info.'
    },
    portfolio: {
        images: [
            // Add portfolio showcase images here
        ],
        caption_ms: '📸 Sebahagian hasil kerja kami\n\nLihat lebih banyak di media sosial kami!',
        caption_en: '📸 Some of our completed projects\n\nSee more on our social media!'
    }
};

function getCatalog(type) {
    return catalogs[type] || null;
}

function hasCatalog(type) {
    const catalog = catalogs[type];
    return catalog && catalog.images && catalog.images.length > 0;
}

module.exports = {
    catalogs,
    getCatalog,
    hasCatalog
};
