import { createFileRoute } from "@tanstack/react-router";
import DashboardRegioes from "@/pages/DashboardRegioes";

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
  return <DashboardRegioes />;
}
