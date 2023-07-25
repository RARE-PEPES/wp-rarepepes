let nftData;
let assetNamesOnPage = rsData.assetNames; // Defined in shortcode.php
let activeTooltip = null;
let documentTouchTriggered = false;

// Fetch data from server
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

// Preload images from fetched data
const preloadImages = () => {
    nftData.forEach(item => {
        if (assetNamesOnPage.includes(item.asset_name)) {
            const img = new Image();
            img.src = item.img_url;
            item.img_obj = img;
        }
    });
}

// Generate tooltip HTML
const generateTooltipHTML = (assetData) => {
    if (!assetData) {
        return 'No data found for this asset.';
    } else {
        return `
            <h3>${assetData.asset_name}</h3>
            <p>Series <strong>${assetData.series}</strong>&nbsp; Card <strong>${assetData.order}</strong></p>
            <img src="${assetData.img_obj.src}" alt="${assetData.asset_name}" />
            <p>Initially Issued: <strong>${assetData.quantity}</strong></p>
        `;
    }
}

// Update tooltip position on the screen
const updateTooltipPosition = (tooltip, event) => {
    let mouseX = event.clientX;
    let mouseY = event.clientY;
    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;
    const viewportWidth = window.innerWidth;

    tooltip.style.top = mouseY < 400 ? `${mouseY + 10}px` : `${mouseY - (tooltipHeight + 10)}px`;
    tooltip.style.left = mouseX + tooltipWidth / 2 > viewportWidth ? `${viewportWidth - tooltipWidth - 10}px` 
                        : mouseX - tooltipWidth / 2 < 0 ? '10px'
                        : `${mouseX - (tooltipWidth / 2)}px`;
}

// Tooltip Mouse Handler
const linkMouseHandler = (tooltip, link, event, isClick = false) => {
    if (!nftData) {
        tooltip.innerHTML = 'Data is not loaded yet.';
        return;
    }

    if (isClick) {
        event.stopPropagation();

        if (activeTooltip === tooltip) {
            tooltip.style.display = 'none';
            activeTooltip = null;
        } else {
            if (documentTouchTriggered) {
                documentTouchTriggered = false;
            } else {
                tooltip.style.display = 'block';
                if (activeTooltip) activeTooltip.style.display = 'none';
                activeTooltip = tooltip;
            }
        }
    } else {
        tooltip.style.display = 'block';
        activeTooltip = tooltip;
    }

    updateTooltipPosition(tooltip, event);
}

// Create tooltip element
const createTooltipElement = (assetName) => {
    const tooltip = document.createElement('div');
    tooltip.className = 'rs-tooltip';
    document.body.appendChild(tooltip);
    const assetData = nftData.find(item => item.asset_name === assetName);
    tooltip.innerHTML = generateTooltipHTML(assetData);
    return tooltip;
}

// Initialize tooltips for all the links on the page
const initTooltips = () => {
    const links = document.querySelectorAll('.rs-link');
    const isTouchDevice = 'ontouchstart' in document.documentElement;

    links.forEach((link) => {
        const tooltip = createTooltipElement(link.dataset.assetName);

        if (isTouchDevice) {
            link.addEventListener('click', (event) => {
                event.stopPropagation();
                event.preventDefault();
                linkMouseHandler(tooltip, link, event, true);
            });
        } else {
            link.addEventListener('mouseover', (event) => {
                linkMouseHandler(tooltip, link, event);
            });
            link.addEventListener('mouseout', () => {
                tooltip.style.display = 'none';
                activeTooltip = null;
            });
            link.addEventListener('mousemove', (event) => {
                updateTooltipPosition(tooltip, event);
            });
        }
    });

    // close tooltip on touchstart anywhere on the document that is not the link
    if (isTouchDevice) {
        document.addEventListener('touchstart', (event) => {
            if (!event.target.classList.contains('rs-link') && activeTooltip) {
                activeTooltip.style.display = 'none';
                activeTooltip = null;
            }
        });
    }
}

// When the document is loaded, fetch data and initialize tooltips
document.addEventListener('DOMContentLoaded', async () => {
    await fetchData();
    initTooltips();
});
