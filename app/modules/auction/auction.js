export async function fetchAuctions() {
  try {
    const response = await fetch('https://localhost:7076/api/auction/', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error("Ошибка при получении аукционов");
    }

    const auctions = await response.json();
    console.log('Аукционы:', auctions);

    // Можно добавить рендер в DOM
    renderAuctions(auctions);
  } catch (error) {
    console.error('Ошибка при загрузке аукционов:', error);
  }
}

function renderAuctions(auctions) {
  const container = document.querySelector('#auctionsContainer');
  if (!container) return;

  container.innerHTML = ''; // очищаем

  auctions.forEach(auction => {
    const div = document.createElement('div');
    div.className = 'auction-card';
    div.innerHTML = `
      <h3>${auction.title}</h3>
      <p>${auction.description}</p>
      <p>Начальная цена: ${auction.startPrice}</p>
    `;
    container.appendChild(div);
  });
}
