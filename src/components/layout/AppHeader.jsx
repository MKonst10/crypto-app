import { Layout, Select, Space, Button } from "antd";
import { useCrypto } from "../../context/crypto-context";
import { useEffect, useState } from "react";
const { Header } = Layout;

const headerStyle = {
  textAlign: "center",
  height: 60,
  padding: "1rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

export default function AppHeader() {
  const [select, setSelect] = useState(false);
  const [modal, setModal] = useState(false);
  const { crypto } = useCrypto();

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
    console.log(value);
  }

  return (
    <Header style={headerStyle}>
      <Select
        style={{ width: "250px" }}
        value="press / to open"
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
      <Button type="primary">Add Asset</Button>
    </Header>
  );
}
