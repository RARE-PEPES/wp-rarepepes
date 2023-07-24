document.addEventListener('DOMContentLoaded', (event) => {
  const links = document.querySelectorAll('.rs-link');
  if (!links) {
      return;
  }

  links.forEach((link) => {
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
                      tooltip.innerHTML = 'No data found for this asset.';
                  } else {
                      tooltip.innerHTML = `
                          <h3>${assetData.asset_name}</h3>
                          <p>Series <strong>${assetData.series}</strong> Card <strong>${assetData.order}</strong></p>
                          <img src="${assetData.img_url}" alt="${assetData.asset_name}" />
                          <p>Initially Issued: <strong>${assetData.quantity}</strong></p>
                      `;
                  }
                  tooltip.style.display = 'block';
              });
      });

      link.addEventListener('mouseout', (event) => {
          tooltip.style.display = 'none';
      });
  });
});
