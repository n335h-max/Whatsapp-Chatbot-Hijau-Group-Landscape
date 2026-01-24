const faqs = [
    {
        topic: 'location',
        keywords_ms: ['lokasi', 'alamat', 'kat mana'],
        keywords_en: ['location', 'address', 'where'],
        answer_ms: "Kami beroperasi di Seremban 2, Negeri Sembilan.",
        answer_en: "We are located at Seremban 2, Negeri Sembilan."
    },
    {
        topic: 'cover_area',
        keywords_ms: ['cover', 'kawasan', 'area'],
        keywords_en: ['cover', 'area', 'coverage'],
        answer_ms: "Negeri Sembilan , Lembah Klang (Kuala Lumpur, Putrajaya serta kawasan utama Selangor seperti Petaling Jaya, Shah Alam, Klang, Subang Jaya, Kajang dan sekitarnya) . Melaka ( Masjid tanah, Ayer Keroh & Simpang Ampat)",
        answer_en: "We cover Negeri Sembilan, Klang Valley (Kuala Lumpur, Putrajaya, and major areas in Selangor like Petaling Jaya, Shah Alam, Klang, Subang Jaya, Kajang, and surrounding areas), and Melaka (Masjid Tanah, Ayer Keroh & Simpang Ampat)."
    },
    {
        topic: 'services',
        keywords_ms: ['servis', 'buat apa'],
        keywords_en: ['service', 'services', 'what do you do'],
        answer_ms: `✅ Konsultasi Landskap
✅ Lukisan 3D & CAD untuk Landskap
✅ Idea Landskap – Hardscape & Softscape
✅ Kerja Pembinaan & Penyelenggaraan Landskap
✅ Renovasi Rumah
✅ Pemasangan Rumput Semula Jadi & Tiruan
✅ Pembinaan Kolam Air (Water Feature)
✅ Pembinaan Tiny House 
✅ Perkhidmatan Pemotongan Pokok & Rumput
✅ Exterior design
✅ Awning ( Rumah & Premis)`,
        answer_en: `✅ Landscape Consultation
✅ 3D & CAD Landscape Drawings
✅ Landscape Ideas – Hardscape & Softscape
✅ Landscape Construction & Maintenance
✅ House Renovation
✅ Natural & Artificial Grass Installation
✅ Water Feature Construction
✅ Tiny House Construction
✅ Tree Cutting & Grass Cutting Services
✅ Exterior Design
✅ Awning (Residential & Commercial)`
    },
    {
        topic: 'design',
        keywords_ms: ['design', 'lukisan', '3d'],
        keywords_en: ['design', 'drawing', '3d'],
        answer_ms: "Ya, design cadangan akan disediakan sebelum kerja bermula bagi memastikan hasil menepati citarasa dan bajet.",
        answer_en: "Yes, a proposed design will be provided before work begins to ensure the result meets your taste and budget."
    },
    {
        topic: 'consultation',
        keywords_ms: ['consultation', 'consult', 'site visit', 'lawatan', 'tempah', 'booking', 'book', 'janji', 'appointment'],
        keywords_en: ['consultation', 'consult', 'site visit', 'visit', 'booking', 'book', 'appointment', 'schedule'],
        answer_ms: "Caj bergantung kepada lokasi dan skop projek. Untuk luar Negeri Sembilan, caj adalah sebanyak RM300. Caj ini akan ditolak jika pelanggan bersetuju meneruskan servis dengan kami.\n\n📅 Untuk tempah konsultasi atau site visit, sila isi borang di:\nhttps://www.hijaugrouplandscape.com.my/contact\n\nAtau hubungi Team Sales kami:\n📞 WhatsApp: 011-1062 9990",
        answer_en: "Charges depend on location and project scope. For outside Negeri Sembilan, the fee is RM300. This fee will be waived if you proceed with our services.\n\n📅 To book a consultation or site visit, please fill in the form at:\nhttps://www.hijaugrouplandscape.com.my/contact\n\nOr contact our Sales Team:\n📞 WhatsApp: 011-1062 9990"
    },
    {
        topic: 'logistics',
        keywords_ms: ['logistik', 'transport', 'luar kawasan'],
        keywords_en: ['logistics', 'transport', 'outstation'],
        answer_ms: "Ya, caj logistik akan dikenakan bergantung kepada jarak dan tempoh kerja.",
        answer_en: "Yes, logistics charges will apply depending on distance and work duration."
    },
    {
        topic: 'small_garden',
        keywords_ms: ['laman kecil'],
        keywords_en: ['small garden', 'tiny garden'],
        answer_ms: "Ya, kami menerima projek laman kecil dan akan cadangkan design yang praktikal serta kemas mengikut bajet pelanggan.",
        answer_en: "Yes, we accept small garden projects and will suggest practical and neat designs according to your budget."
    },
    {
        topic: 'budget',
        keywords_ms: ['bajet', 'pakej'],
        keywords_en: ['budget', 'package', 'price'],
        answer_ms: "Ya, kami boleh cadangkan design mengikut bajet tanpa menjejaskan fungsi dan kualiti. Utk lihat pakej boleh layari website hijaugrouplandscape.com.my.",
        answer_en: "Yes, we can suggest designs according to your budget without compromising function and quality. To view packages, visit hijaugrouplandscape.com.my."
    },
    {
        topic: 'maintenance',
        keywords_ms: ['maintenance', 'penyelenggaraan'],
        keywords_en: ['maintenance'],
        answer_ms: "Ya, kami ada tawarkan servis maintenace berkala (6bulan & 12bulan).",
        answer_en: "Yes, we offer periodic maintenance services (6 months & 12 months)."
    },
    {
        topic: 'water_feature',
        keywords_ms: ['water feature', 'kolam'],
        keywords_en: ['water feature', 'pond', 'pool'],
        answer_ms: "Sila rujuk katalog water feature kami.",
        answer_en: "Please refer to our water feature catalog."
    },
    {
        topic: 'planter_box',
        keywords_ms: ['planter box', 'bench'],
        keywords_en: ['planter box', 'bench'],
        answer_ms: "Sila rujuk katalog planter box kami.",
        answer_en: "Please refer to our planter box catalog."
    },
    {
        topic: 'stepping_slabs',
        keywords_ms: ['stepping', 'slabs'],
        keywords_en: ['stepping', 'slabs'],
        answer_ms: "Sila rujuk katalog stepping slabs kami.",
        answer_en: "Please refer to our stepping slabs catalog."
    },
    {
        topic: 'wood_work',
        keywords_ms: ['kayu'],
        keywords_en: ['wood', 'decking', 'fence'],
        answer_ms: "Ya, kami menyediakan kerja kayu termasuk decking, pagar, pintu, tempat duduk (bench) menggunakan kayu tahan lasak seperti cengal dan balau untuk ketahanan jangka panjang.",
        answer_en: "Yes, we provide woodwork including decking, fences, gates, and benches using durable wood like Cengal and Balau for long-term durability."
    },
    {
        topic: 'grass',
        keywords_ms: ['rumput', 'tiruan', 'harga rumput', 'berapa rumput'],
        keywords_en: ['grass', 'artificial', 'turf', 'grass price'],
        answer_ms: "📋 Harga Rumput:\n\n🌱 Rumput Tiruan - RM6.00/sqft\n• Ketebalan: 30mm\n• Jaminan warna: 7 tahun\n• Lembut & tahan lama\n\n🌾 Philippine Grass - RM3.00/sqft\n• Rumput asli berkualiti\n• Jaminan pertumbuhan 1 bulan\n\n🌿 Cow Grass - RM2.00/sqft\n• Rumput asli ekonomikal\n• Jaminan pertumbuhan 1 bulan\n\nUntuk quotation area anda, hubungi Team Sales: 011-1062 9990",
        answer_en: "📋 Grass Pricing:\n\n🌱 Artificial Grass - RM6.00/sqft\n• Thickness: 30mm\n• 7 years color warranty\n• Soft & durable\n\n🌾 Philippine Grass - RM3.00/sqft\n• Quality natural grass\n• 1 month growth warranty\n\n🌿 Cow Grass - RM2.00/sqft\n• Economical natural grass\n• 1 month growth warranty\n\nFor quotation of your area, contact Sales Team: 011-1062 9990"
    },
    {
        topic: 'process',
        keywords_ms: ['proses', 'bayaran'],
        keywords_en: ['process', 'payment', 'step'],
        answer_ms: `1. Pengiraan kasar keluasan kawasan projek.
2. Penyediaan draf quotation.
3. Pengesahan persetujuan pelanggan dengan bayaran confirmation sebanyak 10%.
4. Lawatan tapak (site visit) untuk pengukuran semula.
5. Pengeluaran invois rasmi.
6. Bayaran sebanyak 50% sebelum kerja dimulakan.`,
        answer_en: `1. Rough calculation of project area.
2. Preparation of draft quotation.
3. Customer confirmation with 10% confirmation payment.
4. Site visit for re-measurement.
5. Issuance of official invoice.
6. 50% payment before work begins.`
    },
    {
        topic: 'duration',
        keywords_ms: ['tempoh', 'lama', 'siap'],
        keywords_en: ['duration', 'how long', 'complete'],
        answer_ms: "Tempoh siap bergantung kepada saiz kawasan dan skop projek. Kebiasaannya mengambil masa beberapa hari hingga beberapa minggu, dan laporan kerja akan dimaklumkan dari masa ke semasa.",
        answer_en: "Completion time depends on the area size and project scope. Usually fits take a few days to a few weeks, and work reports will be updated from time to time."
    },
    {
        topic: 'portfolio',
        keywords_ms: ['contoh', 'hasil', 'media', 'link'],
        keywords_en: ['example', 'result', 'portfolio', 'social', 'link'],
        answer_ms: `Ya, anda boleh lihat di media sosial kami:

TikTok:
https://www.tiktok.com/@hijaugrouplandscape?_r=1&_t=ZS-92vxNeMvHfA

Facebook:
https://www.facebook.com/share/1CsbhkVNGR/?mibextid=wwXIfr

Instagram:
https://www.instagram.com/hijaugroup.landscape?igsh=bmQ4M20wenVxb3pz&utm_source=qr

Threads:
https://www.threads.com/@hijaugroup.landscape?igshid=NTc4MTIwNjQ2YQ==`,
        answer_en: `Yes, you can view our work on our social media:

TikTok:
https://www.tiktok.com/@hijaugrouplandscape?_r=1&_t=ZS-92vxNeMvHfA

Facebook:
https://www.facebook.com/share/1CsbhkVNGR/?mibextid=wwXIfr

Instagram:
https://www.instagram.com/hijaugroup.landscape?igsh=bmQ4M20wenVxb3pz&utm_source=qr

Threads:
https://www.threads.com/@hijaugroup.landscape?igshid=NTc4MTIwNjQ2YQ==`
    }
];

const findFaq = (message) => {
    const lowerMsg = message.toLowerCase();

    for (const faq of faqs) {
        // Check if any keyword matches (both English and Malay)
        const matchesEnglish = faq.keywords_en.some(keyword => lowerMsg.includes(keyword));
        const matchesMalay = faq.keywords_ms.some(keyword => lowerMsg.includes(keyword));

        if (matchesEnglish || matchesMalay) {
            // Return bilingual answer (both Malay and English)
            return `${faq.answer_ms}\n\n${faq.answer_en}`;
        }
    }
    return null;
};

const findFaqByTopic = (topic) => {
    // Map topic names to FAQ topics
    const topicMap = {
        'location': 'location',
        'coverage': 'cover_area',
        'services': 'services',
        'design': 'design',
        'consultation': 'consultation',
        'pricing': 'budget',
        'budget': 'budget',
        'small_garden': 'small_garden',
        'maintenance': 'maintenance',
        'water_feature': 'water_feature',
        'planter_box': 'planter_box',
        'stepping': 'stepping_slabs',
        'wood': 'wood_work',
        'grass': 'grass',
        'process': 'process',
        'duration': 'duration',
        'portfolio': 'portfolio'
    };

    const faqTopic = topicMap[topic] || topic;
    const faq = faqs.find(f => f.topic === faqTopic);
    
    if (faq) {
        return `${faq.answer_ms}\n\n${faq.answer_en}`;
    }
    
    return null;
};

module.exports = {
    findFaq,
    findFaqByTopic,
    faqs
};
