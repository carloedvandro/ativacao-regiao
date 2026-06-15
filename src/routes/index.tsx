import { createFileRoute } from "@tanstack/react-router";
import DistribuicaoRegiao from "@/components/DistribuicaoRegiao";

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
        background: "#f7f0fb",
        padding: "20px",
      }}
    >
      <h1 style={{ position: "absolute", left: "-9999px" }}>
        Distribuição por Região — SmartVoz
      </h1>
      <DistribuicaoRegiao />
    </main>
  );
}
