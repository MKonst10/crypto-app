import { cryptoData, cryptoAssets } from "../assets/data";

export async function fetchCrypto() {
  const response = await fetch("https://openapiv1.coinstats.app/coins", {
    headers: {
      accept: "application/json",
      "X-API-KEY": import.meta.env.VITE_COINSTATS_API_KEY,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`CoinStats API error: ${response.status}\n${errorText}`);
  }

  const data = await response.json();

  console.log("CoinStats API response:", data);

  return { result: data.result };
}

export function fetchAssets() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(cryptoAssets);
    }, 20);
  });
}
