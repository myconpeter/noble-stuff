async function fetchCryptoData() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,tether,stellar,ripple,litecoin,dogecoin,binancecoin,shiba-inu,tron,cardano,solana,polygon-ecosystem-token,algorand,official-trump,pepe"
    );
    const data = await res.json();

    data.forEach((coin) => {
      const id = coin.id.replaceAll("-", "_"); // match your element IDs
      const priceElem = document.getElementById(`${id}_price`);

      const predictElem = document.getElementById(`${id}_predict`);

      // ✅ Update Price
      if (priceElem) {
        priceElem.textContent = `$ ${coin.current_price.toLocaleString()}`;
      }

      // ✅ Update 24h Trend
      if (predictElem) {
        const change = coin.price_change_percentage_24h?.toFixed(2);
        let arrow, color;

        if (change > 0) {
          arrow = '<i class="bi bi-caret-up-fill pe-2"></i>';
          color = "green";
        } else if (change < 0) {
          arrow = '<i class="bi bi-caret-down-fill pe-2"></i>';
          color = "red";
        } else {
          arrow = '<i class="bi bi-dash pe-2"></i>';
          color = "gray";
        }

        predictElem.innerHTML = `${arrow}${change}%`;
        predictElem.style.color = color;
      }
    });
  } catch (err) {
    console.error("Error fetching crypto data:", err);
  }
}

// Initial load
fetchCryptoData();

// Refresh every 60 seconds
setInterval(fetchCryptoData, 60000);
