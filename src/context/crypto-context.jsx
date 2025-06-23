import { createContext, useContext, useEffect, useState } from "react";
import { fetchAssets, fetchCrypto } from "../services/coinstatsApi";
import { percentDifference } from "../utils/utils";

const CryptoContext = createContext({
  assets: [],
  crypto: [],
  loading: false,
});

const LOCAL_STORAGE_KEY = "crypto-assets";

function loadAssetsFromStorage() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAssetsToStorage(assets) {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(assets));
}

export function CryptoContextProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [crypto, setCrypto] = useState([]);
  const [assets, setAssets] = useState([]);

  function mapAssets(assets, result) {
    return assets.map((asset) => {
      const coin = result.find((c) => c.id === asset.id);

      const currentPrice = coin?.price ?? asset.price;
      return {
        ...asset,
        name: coin?.name ?? asset.id,
        grow: asset.price < currentPrice,
        growPercent: percentDifference(asset.price, currentPrice),
        totalAmount: asset.amount * currentPrice,
        totalProfit: asset.amount * (currentPrice - asset.price),
      };
    });
  }

  useEffect(() => {
    if (!crypto || crypto.length === 0) return;

    const storedAssets = loadAssetsFromStorage();
    setAssets(mapAssets(storedAssets, crypto));
  }, [crypto]);

  useEffect(() => {
    async function preload() {
      setLoading(true);
      const { result } = await fetchCrypto();
      setCrypto(result);
      setLoading(false);
    }
    preload();
  }, []);

  function addAsset(newAsset) {
    const existing = assets.find((a) => a.id === newAsset.id);

    let updatedAssets;

    if (existing) {
      const totalAmount = existing.amount + newAsset.amount;
      const totalCost =
        existing.amount * existing.price + newAsset.amount * newAsset.price;
      const avgPrice = totalCost / totalAmount;

      const mergedAsset = {
        ...existing,
        amount: totalAmount,
        price: avgPrice,
        date: newAsset.date,
      };

      updatedAssets = assets.map((a) =>
        a.id === newAsset.id ? mergedAsset : a
      );
    } else {
      updatedAssets = [...assets, newAsset];
    }

    setAssets(mapAssets(updatedAssets, crypto));
    saveAssetsToStorage(updatedAssets);
  }

  return (
    <CryptoContext.Provider value={{ loading, crypto, assets, addAsset }}>
      {children}
    </CryptoContext.Provider>
  );
}

export default CryptoContext;

export function useCrypto() {
  return useContext(CryptoContext);
}
