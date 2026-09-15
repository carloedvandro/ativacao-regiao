import { createFileRoute } from "@tanstack/react-router";
import DashboardRegioes from "@/pages/DashboardRegioes";

export const Route = createFileRoute("/painel")({
  head: () => ({
    meta: [
      { title: "Produção em tempo real — SmartVoz" },
      { name: "description", content: "Produção de ativações SmartVoz em tempo real por região, estado e cidade." },
      { property: "og:title", content: "Produção em tempo real — SmartVoz" },
      { property: "og:description", content: "Produção de ativações SmartVoz em tempo real por região, estado e cidade." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DashboardRegioes,
});