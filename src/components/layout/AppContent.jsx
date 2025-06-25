import { Layout, Typography, Grid, Divider, Flex } from "antd";
import { useCrypto } from "../../context/crypto-context";
import PortfolioChart from "../PortfolioChart";
import AssetsTable from "../AssetsTable";
import AssetCard from "../AssetCard";
const { Content } = Layout;
const { useBreakpoint } = Grid;

export default function AppContent() {
  const { assets, crypto } = useCrypto();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const cryptoPriceMap = crypto.reduce((acc, c) => {
    acc[c.id] = c.price;
    return acc;
  }, {});

  const contentStyle = {
    textAlign: "center",
    minHeight: "calc(100vh - 60px)",
    color: "#fff",
    backgroundColor: "#001529",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 30,
  };

  return (
    <Content style={contentStyle}>
      {assets.length > 0 ? (
        <>
          {" "}
          <Typography.Title
            level={3}
            style={{ alignSelf: "flex-start", color: "#fff" }}
          >
            Portfolio:{" "}
            {assets
              .map((asset) => asset.amount * cryptoPriceMap[asset.id])
              .reduce((acc, val) => (acc += val), 0)
              .toFixed(2)}
            $
          </Typography.Title>
          <PortfolioChart />
          <AssetsTable />
          {isMobile && (
            <Flex gap="middle" vertical style={{ width: "100%" }}>
              <AssetCard />
            </Flex>
          )}
        </>
      ) : (
        <>
          <Typography.Title
            level={3}
            style={{
              textAlign: "center",
              color: "#fff",
              marginTop: "50%",
              margin: "auto",
            }}
          >
            Add your first asset
          </Typography.Title>
        </>
      )}
    </Content>
  );
}
