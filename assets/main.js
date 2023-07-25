let nftData;
let assetNamesOnPage = rsData.assetNames; // Defined in shortcode.php

const fetchData = async () => {
    try {
        const response = await fetch('https://data.rarepepes.com/items/nft');
        const data = await response.json();
        nftData = data.data;
        preloadImages();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

const preloadImages = () => {
    nftData.forEach(item => {
        if (assetNamesOnPage.includes(item.asset_name)) {
            const img = new Image();
            img.src = item.img_url;
            item.img_obj = img;
        }
    });
}

const updateTooltipPosition = (event) => {
    let mouseX = event.clientX;
    let mouseY = event.clientY;
    const activeTooltip = document.querySelector('.rs-tooltip.active');
    
    if (activeTooltip) {
        const tooltipWidth = activeTooltip.offsetWidth;
        const tooltipHeight = activeTooltip.offsetHeight;
        const viewportWidth = window.innerWidth;

        // If tooltip overflows to the top, place below cursor
        if (mouseY < 400) {
            activeTooltip.style.top = `${mouseY + 10}px`;
        } else {
            activeTooltip.style.top = `${mouseY - (tooltipHeight + 10)}px`;
        }

        // If tooltip overflows to the sides, place at edge of viewport
        if (mouseX + tooltipWidth / 2 > viewportWidth) {
            activeTooltip.style.left = `${viewportWidth - tooltipWidth - 10}px`; // 10px padding from right
        }
        else if (mouseX - tooltipWidth / 2 < 0) {
            activeTooltip.style.left = '10px'; // 10px padding from left
        }
        
        // Normal centered positioning
        else {
            activeTooltip.style.left = `${mouseX - (tooltipWidth / 2)}px`;
        }
    }
}

const linkMouseOverHandler = (tooltip, link) => {
    if (!nftData) {
        tooltip.innerHTML = 'Data is not loaded yet.';
        tooltip.style.display = 'block';
        tooltip.classList.add('active');
        return;
    }

    const assetName = link.dataset.assetName;
    const assetData = nftData.find(item => item.asset_name === assetName);
    if (!assetData) {
        tooltip.innerHTML = 'No data found for this asset.';
    } else {
        tooltip.innerHTML = `
            <h3>${assetData.asset_name}</h3>
            <p>Series <strong>${assetData.series}</strong>&nbsp; Card <strong>${assetData.order}</strong></p>
            `;
        tooltip.appendChild(assetData.img_obj);
        tooltip.innerHTML += `
            <p>Initially Issued: <strong>${assetData.quantity}</strong></p>
        `;
    }
    tooltip.style.display = 'block';
    tooltip.classList.add('active');
}

const linkMouseOutHandler = (tooltip) => {
    tooltip.style.display = 'none';
    tooltip.classList.remove('active');
}

const initTooltips = () => {
    const links = document.querySelectorAll('.rs-link');
    if (!links) {
        return;
    }

    document.addEventListener('mousemove', updateTooltipPosition);

    links.forEach((link) => {
        const tooltip = document.createElement('div');
        tooltip.className = 'rs-tooltip';
        document.body.appendChild(tooltip);

        link.addEventListener('mouseover', () => linkMouseOverHandler(tooltip, link));
        link.addEventListener('mouseout', () => linkMouseOutHandler(tooltip));
    });
}

document.addEventListener('DOMContentLoaded', async (event) => {
    await fetchData();
    initTooltips();
});
