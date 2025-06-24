import { Layout, Card, Statistic, List, Typography, Tag, Grid } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { capitalize } from "../../utils/utils";
import { useContext } from "react";
import CryptoContext from "../../context/crypto-context";
const { Sider } = Layout;
const { useBreakpoint } = Grid;

export default function AppSider() {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const { assets } = useContext(CryptoContext);

  const siderStyle = {
    padding: isMobile ? "0" : "1rem",
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
      {assets.map((asset) => (
        <Card key={asset.id} style={{ marginBottom: "1rem" }}>
          <Statistic
            title={capitalize(asset.id)}
            value={asset.totalAmount}
            precision={2}
            valueStyle={{ color: asset.grow ? "#3f8600" : "#cf1322" }}
            prefix={asset.grow ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
            suffix="$"
          />
          <List
            size="small"
            dataSource={[
              {
                title: "Total Profit:",
                value: asset.totalProfit,
                withTag: true,
              },
              { title: "Asset Amount:", value: asset.amount, isPlain: true },
            ]}
            renderItem={(item) => (
              <List.Item
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "5px",
                  flexWrap: "wrap",
                }}
              >
                <span>{item.title}</span>
                <span>
                  {item.withTag && (
                    <Tag color={asset.grow ? "green" : "red"}>
                      {asset.growPercent}%
                    </Tag>
                  )}
                  {item.isPlain && item.value}
                  {!item.isPlain && (
                    <Typography.Text type={asset.grow ? "success" : "danger"}>
                      {item.value.toFixed(2)}$
                    </Typography.Text>
                  )}
                </span>
              </List.Item>
            )}
          />
        </Card>
      ))}
    </Sider>
  );
}
