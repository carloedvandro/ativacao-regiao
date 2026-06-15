import { createFileRoute } from "@tanstack/react-router";
import distribuicaoImg from "@/assets/distribuicao-regiao.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Distribuição por Região — SmartVoz" },
      { name: "description", content: "Distribuição por região das ativações na rede SmartVoz." },
      { property: "og:title", content: "Distribuição por Região — SmartVoz" },
      { property: "og:description", content: "Distribuição por região das ativações na rede SmartVoz." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
        padding: "24px",
      }}
    >
      <h1 style={{ position: "absolute", left: "-9999px" }}>
        Distribuição por Região — SmartVoz
      </h1>
      <img
        src={distribuicaoImg.url}
        alt="Distribuição por Região — Ativações SmartVoz por região (Norte 7%, Centro-Oeste 10%, Nordeste 14%, Outros/Exterior 16%, Sudeste 25%, Sul 28%). Total de ativações: 46.782."
        style={{ maxWidth: "100%", height: "auto", display: "block" }}
      />
    </main>
  );
}
