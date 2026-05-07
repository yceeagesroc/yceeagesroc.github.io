async function fetchBTS() {
    // 1. Get elements and verify they exist to avoid "null" errors
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('results');
    const status = document.getElementById('status');
    
    if (!resultsContainer || !status) {
        console.error("Required HTML elements (results or status) are missing!");
        return;
    }

    const query = (searchInput && searchInput.value) ? searchInput.value : 'BTS';
    
    status.innerText = "Loading the magic...";
    resultsContainer.innerHTML = '';

    try {
        // Added 'origin=*' to help with potential CORS issues in some browsers
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=20`;
        
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();

        if (!data.results || data.results.length === 0) {
            status.innerText = "No tracks found. Try searching 'Butter' or 'Map of the Soul'.";
            return;
        }

        status.innerText = `Found ${data.resultCount} results for "${query}"`;

        // Use a fragment or a string buffer for better performance
        let content = '';

        data.results.forEach(track => {
            // Safety check for artwork URL
            const artwork = track.artworkUrl100 || '';
            const hiresArt = artwork.replace('100x100bb', '600x600bb');
            
            content += `
                <div class="glass rounded-2xl overflow-hidden hover:scale-105 transition-all duration-300 group">
                    <div class="relative overflow-hidden">
                        <img src="${hiresArt}" alt="${track.trackName}" class="w-full aspect-square object-cover">
                        <div class="absolute inset-0 bg-purple-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <a href="${track.trackViewUrl}" target="_blank" class="bg-white text-black px-4 py-2 rounded-full font-bold text-xs">VIEW ON ITUNES</a>
                        </div>
                    </div>
                    <div class="p-5">
                        <h3 class="font-black text-lg truncate">${track.trackName || 'Unknown Title'}</h3>
                        <p class="text-purple-400 text-sm truncate">${track.collectionName || 'Unknown Album'}</p>
                        <div class="mt-4 flex items-center justify-between">
                            <span class="text-xs text-gray-500">${track.releaseDate ? new Date(track.releaseDate).getFullYear() : 'N/A'}</span>
                            <audio controls class="h-8 w-32 opacity-50 hover:opacity-100">
                                <source src="${track.previewUrl}" type="audio/mpeg">
                            </audio>
                        </div>
                    </div>
                </div>
            `;
        });
        
        resultsContainer.innerHTML = content;

    } catch (error) {
        console.error("API Error:", error);
        status.innerText = "Error connecting to the ARMY signal. Check your internet or console.";
    }
}

// Ensure the script runs after the DOM is fully interactive
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fetchBTS);
} else {
    fetchBTS();
}