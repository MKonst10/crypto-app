import { Layout, Select, Space, Button, Modal, Drawer, Grid } from "antd";
import { useCrypto } from "../../context/crypto-context";
import { useEffect, useState } from "react";
import CoinInfoModal from "../CoinInfoModal";
import AddAssetForm from "../AddAssetForm";
const { Header } = Layout;
const { useBreakpoint } = Grid;

export default function AppHeader() {
  const [select, setSelect] = useState(false);
  const [coin, setCoin] = useState(null);
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const { crypto } = useCrypto();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const headerStyle = {
    textAlign: "center",
    height: 60,
    padding: "1rem",
    display: "flex",
    gap: 20,
    justifyContent: "space-between",
    alignItems: "center",
  };

  useEffect(() => {
    const keypress = (event) => {
      if (event.key === "/") {
        setSelect((prev) => !prev);
      }
    };
    document.addEventListener("keypress", keypress);
    return () => document.removeEventListener("keypress", keypress);
  }, []);

  function handleSelect(value) {
    setCoin(crypto.find((c) => c.id === value));
    setModal(true);
  }

  return (
    <Header style={headerStyle}>
      <Select
        style={{ width: "100%", maxWidth: "250px" }}
        value="Press / to open"
        options={crypto.map((coin) => ({
          label: coin.name,
          value: coin.id,
          icon: coin.icon,
        }))}
        open={select}
        onSelect={handleSelect}
        onClick={() => setSelect((prev) => !prev)}
        optionRender={(option) => (
          <Space>
            <img
              style={{ width: 20 }}
              src={option.data.icon}
              alt={option.data.label}
            />{" "}
            {option.data.label}
          </Space>
        )}
      />
      <Button type="primary" onClick={() => setDrawer(true)}>
        Add Asset
      </Button>

      <Modal open={modal} onCancel={() => setModal(false)} footer={null}>
        <CoinInfoModal coin={coin} />
      </Modal>

      <Drawer
        width={isMobile ? "80%" : "40%"}
        title="Add asset"
        open={drawer}
        onClose={() => setDrawer(false)}
        destroyOnHidden
      >
        <AddAssetForm onClose={() => setDrawer(false)} />
      </Drawer>
    </Header>
  );
}
