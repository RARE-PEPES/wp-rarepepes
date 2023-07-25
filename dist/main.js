let nftData;
let assetNamesOnPage = rsData.assetNames; // Defined in shortcode.php
let activeTooltip = null;
let documentTouchTriggered = false;

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

const linkMouseHandler = (tooltip, link, event, isClick = false) => {
    if (!nftData) {
        tooltip.innerHTML = 'Data is not loaded yet.';
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

    if (isClick) {
        // Prevent the document's touchstart event from getting triggered
        event.stopPropagation();

        if (activeTooltip === tooltip) {
            tooltip.style.display = 'none';
            activeTooltip = null;
        } else {
            if (documentTouchTriggered) {
                // Do not reopen tooltip if documentTouchTriggered is true
                documentTouchTriggered = false; // reset flag
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

const updateTooltipPosition = (tooltip, event) => {
    // Positioning logic
    let mouseX = event.clientX;
    let mouseY = event.clientY;
    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;
    const viewportWidth = window.innerWidth;

    // If tooltip overflows to the top, place below cursor
    if (mouseY < 400) {
        tooltip.style.top = `${mouseY + 10}px`;
    } else {
        tooltip.style.top = `${mouseY - (tooltipHeight + 10)}px`;
    }

    // If tooltip overflows to the sides, place at edge of viewport
    if (mouseX + tooltipWidth / 2 > viewportWidth) {
        tooltip.style.left = `${viewportWidth - tooltipWidth - 10}px`; // 10px padding from right
    }
    else if (mouseX - tooltipWidth / 2 < 0) {
        tooltip.style.left = '10px'; // 10px padding from left
    }

    // Normal centered positioning
    else {
        tooltip.style.left = `${mouseX - (tooltipWidth / 2)}px`;
    }
}

const initTooltips = () => {
    const links = document.querySelectorAll('.rs-link');
    if (!links) {
        return;
    }

    const isTouchDevice = 'ontouchstart' in document.documentElement;

    links.forEach((link) => {
        const tooltip = document.createElement('div');
        tooltip.className = 'rs-tooltip';
        document.body.appendChild(tooltip);

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

document.addEventListener('DOMContentLoaded', async (event) => {
    await fetchData();
    initTooltips();
});
