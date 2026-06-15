import { createFileRoute } from "@tanstack/react-router";

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
    <iframe
      src="/distribuicao-regiao.html"
      title="Distribuição por Região — SmartVoz"
      style={{ border: 0, width: "100vw", height: "100vh", display: "block" }}
    />
  );
}
