let nftData;
let assetNamesOnPage = rsData.assetNames // Defined in shortcode.php

fetch('https://data.rarepepes.com/items/nft')
    .then(response => response.json())
    .then(data => {
        nftData = data.data;

        // Preload images for assets present on the page
        nftData.forEach(item => {
            if (assetNamesOnPage.includes(item.asset_name)) {
                const img = new Image();
                img.src = item.img_url;
                item.img_obj = img;
            }
        });

    })
    .catch(error => {
        console.error("Error fetching data:", error);
    });

document.addEventListener('DOMContentLoaded', (event) => {
    const links = document.querySelectorAll('.rs-link');
    if (!links) {
        return;
    }

    document.addEventListener('mousemove', (event) => {
        let mouseX = event.clientX;
        let mouseY = event.clientY;
        const activeTooltip = document.querySelector('.rs-tooltip.active');
        if (activeTooltip) {
            activeTooltip.style.top = `${mouseY - (activeTooltip.offsetHeight + 10)}px`;
            activeTooltip.style.left = `${mouseX - (activeTooltip.offsetWidth / 2)}px`;
        }
    });

    links.forEach((link) => {
        const assetName = link.dataset.assetName;

        const tooltip = document.createElement('div');
        tooltip.className = 'rs-tooltip';
        document.body.appendChild(tooltip);

        link.addEventListener('mouseover', (event) => {
            if (!nftData) {
                tooltip.innerHTML = 'Data is not loaded yet.';
                tooltip.style.display = 'block';
                tooltip.classList.add('active');
                return;
            }
        
            const assetData = nftData.find(item => item.asset_name === assetName);
            if (!assetData) {
                tooltip.innerHTML = 'No data found for this asset.';
            } else {
                tooltip.innerHTML = `
                    <h3>${assetData.asset_name}</h3>
                    <p>Series <strong>${assetData.series}</strong> Card <strong>${assetData.order}</strong></p>
                    `;
                tooltip.appendChild(assetData.img_obj);
                tooltip.innerHTML += `
                    <p>Initially Issued: <strong>${assetData.quantity}</strong></p>
                `;
            }
            tooltip.style.display = 'block';
            tooltip.classList.add('active');
        });

        link.addEventListener('mouseout', (event) => {
            tooltip.style.display = 'none';
            tooltip.classList.remove('active');
        });
    });
});