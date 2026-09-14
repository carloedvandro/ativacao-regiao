import { createFileRoute } from "@tanstack/react-router";
import Cidades from "@/pages/Cidades";

export const Route = createFileRoute("/cidades")({
  head: () => ({
    meta: [
      { title: "Ativações por cidade — SmartVoz" },
      {
        name: "description",
        content: "Ativações por cidade com filtros de região, estado e plano na rede SmartVoz.",
      },
      { property: "og:title", content: "Ativações por cidade — SmartVoz" },
      {
        property: "og:description",
        content: "Ativações por cidade com filtros de região, estado e plano na rede SmartVoz.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Cidades,
});
