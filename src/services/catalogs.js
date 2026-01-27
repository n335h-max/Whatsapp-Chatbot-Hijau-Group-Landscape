// Catalog PDFs hosted on GitHub
const BASE_URL = 'https://raw.githubusercontent.com/n335h-max/Whatsapp-Chatbot-Hijau-Group-Landscape/main/public/catalogs';

const catalogs = {
    water_feature: {
        type: 'document',
        url: `${BASE_URL}/water-feature.pdf`,
        filename: 'Hijau_Group_Water_Feature_Catalog.pdf',
        caption_ms: '🌊 Katalog Water Feature - Hijau Group Landscape\n\nTerima kasih! Sila semak katalog kami untuk pelbagai pilihan water feature.\n\nUntuk maklumat lanjut dan harga, sila hubungi Team Sales: 011-1062 9990',
        caption_en: '🌊 Water Feature Catalog - Hijau Group Landscape\n\nThank you! Please check our catalog for various water feature options.\n\nFor more details and pricing, please contact Sales Team: 011-1062 9990'
    },
    planter_box: {
        type: 'document',
        url: `${BASE_URL}/planter-box-bench.pdf`,
        filename: 'Hijau_Group_Planter_Box_Bench_Catalog.pdf',
        caption_ms: '🪴 Katalog Planter Box & Bench - Hijau Group Landscape\n\nTerima kasih! Sila semak katalog kami untuk pelbagai design planter box dan bench.\n\nUntuk quotation dan maklumat lanjut, hubungi Team Sales: 011-1062 9990',
        caption_en: '🪴 Planter Box & Bench Catalog - Hijau Group Landscape\n\nThank you! Please check our catalog for various planter box and bench designs.\n\nFor quotation and more info, contact Sales Team: 011-1062 9990'
    },
    stepping_slabs: {
        type: 'document',
        url: `${BASE_URL}/stepping-slabs.pdf`,
        filename: 'Hijau_Group_Stepping_Slabs_Catalog.pdf',
        caption_ms: '🪨 Katalog Stepping Slabs - Hijau Group Landscape\n\nTerima kasih! Sila semak katalog kami untuk pelbagai corak stepping slabs.\n\nUntuk maklumat lanjut dan harga, hubungi Team Sales: 011-1062 9990',
        caption_en: '🪨 Stepping Slabs Catalog - Hijau Group Landscape\n\nThank you! Please check our catalog for various stepping slabs patterns.\n\nFor more info and pricing, contact Sales Team: 011-1062 9990'
    },
    bohemian: {
        type: 'document',
        url: `${BASE_URL}/bohemian-wall.pdf`,
        filename: 'Hijau_Group_Bohemian_Wall_Catalog.pdf',
        caption_ms: '🧱 Katalog Bohemian Wall - Hijau Group Landscape\n\nTerima kasih! Sila semak katalog kami untuk pilihan Bohemian Wall.\n\nUntuk maklumat lanjut dan harga, hubungi Team Sales: 011-1062 9990',
        caption_en: '🧱 Bohemian Wall Catalog - Hijau Group Landscape\n\nThank you! Please check our catalog for Bohemian Wall options.\n\nFor more info and pricing, contact Sales Team: 011-1062 9990'
    },
    grass: {
        type: 'document',
        url: `${BASE_URL}/grass-catalog.pdf`,
        filename: 'Hijau_Group_Grass_Price_Catalog.pdf',
        caption_ms: '🌱 Katalog Harga Rumput - Hijau Group Landscape\n\n✅ Rumput Tiruan (Artificial Grass) - RM6.00/sqft\n   • Ketebalan: 30mm\n   • Jaminan warna: 7 tahun\n   • Saiz: 1m x 50cm per roll\n\n✅ Philippine Grass - RM3.00/sqft\n   • Ketebalan: 1 inci\n   • Saiz: 27cm x 57cm\n   • Jaminan pertumbuhan 1 bulan pertama\n\n✅ Cow Grass - RM2.00/sqft\n   • Ketebalan: 1 inci\n   • Saiz: 27cm x 57cm\n   • Jaminan pertumbuhan 1 bulan pertama\n\nUntuk quotation dan tempahan, hubungi Team Sales: 011-1062 9990',
        caption_en: '🌱 Grass Price Catalog - Hijau Group Landscape\n\n✅ Artificial Grass - RM6.00/sqft\n   • Thickness: 30mm\n   • Color warranty: 7 years\n   • Size: 1m x 50cm per roll\n\n✅ Philippine Grass - RM3.00/sqft\n   • Thickness: 1 inch\n   • Size: 27cm x 57cm\n   • Growth warranty: First month\n\n✅ Cow Grass - RM2.00/sqft\n   • Thickness: 1 inch\n   • Size: 27cm x 57cm\n   • Growth warranty: First month\n\nFor quotation and orders, contact Sales Team: 011-1062 9990'
    },
    portfolio: {
        type: 'text',
        social_links: {
            tiktok: 'https://www.tiktok.com/@hijaugrouplandscape',
            facebook: 'https://www.facebook.com/share/1CsbhkVNGR/',
            instagram: 'https://www.instagram.com/hijaugroup.landscape',
            threads: 'https://www.threads.com/@hijaugroup.landscape'
        }
    }
};

function getCatalog(type) {
    return catalogs[type] || null;
}

function hasCatalog(type) {
    const catalog = catalogs[type];
    return catalog && catalog.type === 'document' && catalog.url;
}

module.exports = {
    catalogs,
    getCatalog,
    hasCatalog
};
