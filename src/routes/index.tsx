import { createFileRoute } from "@tanstack/react-router";
import VisaoGrafica from "@/pages/VisaoGrafica";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Visão gráfica de ativações — SmartVoz" },
      { name: "description", content: "Visão gráfica das ativações SmartVoz por região, estado, cidade e plano." },
      { property: "og:title", content: "Visão gráfica de ativações — SmartVoz" },
      { property: "og:description", content: "Visão gráfica das ativações SmartVoz por região, estado, cidade e plano." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <VisaoGrafica />;
}
