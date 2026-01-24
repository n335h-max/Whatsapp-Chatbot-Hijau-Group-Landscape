// Enhanced keyword variations for better matching
const faqKeywordVariations = {
    location: ['lokasi', 'location', 'alamat', 'address', 'kat mana', 'where', 'di mana', 'kedai', 'office', 'pejabat'],
    coverage: ['cover', 'kawasan', 'area', 'coverage', 'servis area', 'serve', 'operate', 'beroperasi', 'liputan'],
    services: ['servis', 'service', 'perkhidmatan', 'buat apa', 'what do', 'tawarkan', 'offer', 'provide', 'sediakan'],
    design: ['design', 'lukisan', '3d', 'cad', 'drawing', 'plan', 'pelan', 'reka bentuk'],
    consultation: ['consultation', 'consult', 'site visit', 'lawatan', 'visit', 'tinjau', 'survey', 'tempah', 'booking', 'book', 'janji', 'appointment', 'schedule', 'meet', 'jumpa'],
    pricing: ['harga', 'price', 'berapa', 'how much', 'cost', 'kos', 'bayaran', 'payment', 'charge', 'caj'],
    budget: ['bajet', 'budget', 'murah', 'cheap', 'affordable', 'pakej', 'package'],
    small_garden: ['laman kecil', 'small', 'tiny', 'kecil', 'mini'],
    maintenance: ['maintenance', 'penyelenggaraan', 'maintain', 'servis berkala', 'periodic'],
    water_feature: ['water feature', 'kolam', 'pond', 'pool', 'air'],
    planter_box: ['planter', 'box', 'bench', 'bangku'],
    stepping: ['stepping', 'slabs', 'batu loncatan', 'walkway'],
    wood: ['kayu', 'wood', 'decking', 'timber', 'cengal', 'balau', 'fence', 'pagar'],
    grass: ['rumput', 'grass', 'tiruan', 'artificial', 'turf', 'asli', 'natural', 'cowgrass', 'philippine'],
    process: ['proses', 'process', 'cara', 'how', 'step', 'langkah', 'bayaran', 'payment'],
    duration: ['tempoh', 'duration', 'lama', 'how long', 'siap', 'complete', 'bila siap', 'masa'],
    portfolio: ['contoh', 'example', 'hasil', 'result', 'portfolio', 'kerja', 'project', 'projek', 'gambar', 'photo', 'media', 'social', 'fb', 'ig', 'tiktok', 'link']
};

// Calculate similarity between two strings (simple fuzzy match)
function similarity(s1, s2) {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    
    if (longer.length === 0) return 1.0;
    
    // Check if one string contains the other
    if (longer.includes(shorter)) return 0.8;
    
    // Simple character match ratio
    const matches = shorter.split('').filter(char => longer.includes(char)).length;
    return matches / longer.length;
}

// Find best matching topic
function findBestMatch(message) {
    const lowerMsg = message.toLowerCase().trim();
    let bestMatch = null;
    let bestScore = 0;

    for (const [topic, keywords] of Object.entries(faqKeywordVariations)) {
        for (const keyword of keywords) {
            // Exact match or contains
            if (lowerMsg.includes(keyword) || keyword.includes(lowerMsg)) {
                const score = keyword.length / lowerMsg.length; // Prefer longer matches
                if (score > bestScore) {
                    bestScore = score;
                    bestMatch = topic;
                }
            }
            
            // Fuzzy match for typos
            const sim = similarity(lowerMsg, keyword);
            if (sim > 0.7 && sim > bestScore * 0.9) {
                bestScore = sim;
                bestMatch = topic;
            }
        }
    }

    return bestScore > 0.5 ? bestMatch : null;
}

module.exports = {
    faqKeywordVariations,
    findBestMatch
};
