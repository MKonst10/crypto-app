import { Layout, Grid } from "antd";
import { useContext } from "react";
import CryptoContext from "../../context/crypto-context";
import AssetCard from "../AssetCard";
const { Sider } = Layout;
const { useBreakpoint } = Grid;

export default function AppSider() {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const { assets } = useContext(CryptoContext);

  const siderStyle = {
    padding: isMobile ? "0" : "1rem",
    display: isMobile ? "none" : "block",
  };

  if (!assets.length) {
    return null;
  }

  return (
    <Sider
      width="25%"
      style={siderStyle}
      collapsed={isMobile}
      collapsedWidth="0"
      trigger={null}
    >
      <AssetCard />
    </Sider>
  );
}
