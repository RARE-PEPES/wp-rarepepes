document.addEventListener('DOMContentLoaded', (event) => {
  const link = document.querySelector('.rs-link');
  if (!link) {
      return;
  }

  const assetName = link.dataset.assetName;
  const tooltip = document.createElement('div');
  tooltip.style.display = 'none';
  tooltip.style.position = 'absolute';
  tooltip.style.background = 'white';
  tooltip.style.border = '1px solid black';
  tooltip.style.padding = '10px';
  link.parentElement.appendChild(tooltip);

  link.addEventListener('mouseover', (event) => {
      fetch('https://data.rarepepes.com/items/nft')
          .then(response => response.json())
          .then(data => {
              const assetData = data.data.find(item => item.asset_name === assetName);
              if (!assetData) {
                  tooltip.textContent = 'No data found for this asset.';
              } else {
                  tooltip.textContent = `Issuer: ${assetData.issuer}, Quantity: ${assetData.quantity}`;
              }
              tooltip.style.display = 'block';
          });
  });

  link.addEventListener('mouseout', (event) => {
      tooltip.style.display = 'none';
  });
});
