import { createContext, useContext, useEffect, useState } from "react";
import { fetchAssets, fetchCrypto } from "../services/coinstatsApi";
import { percentDifference } from "../utils/utils";

const CryptoContext = createContext({
  assets: [],
  crypto: [],
  loading: false,
});

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
    async function preload() {
      setLoading(true);
      const { result } = await fetchCrypto();
      const assets = await fetchAssets();

      setCrypto(result);
      setAssets(mapAssets(assets, result));
      setLoading(false);
    }
    preload();
  }, []);

  function addAsset(newAsset) {
    setAssets((prev) => mapAssets([...prev, newAsset], crypto));
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
