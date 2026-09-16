import { createFileRoute } from "@tanstack/react-router";
import VisaoGrafica from "@/pages/VisaoGrafica";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Espectro Mágico — SmartVoz" },
      { name: "description", content: "Espectro Mágico: visão gráfica das ativações SmartVoz por região, estado, cidade e plano." },
      { property: "og:title", content: "Espectro Mágico — SmartVoz" },
      { property: "og:description", content: "Espectro Mágico: visão gráfica das ativações SmartVoz por região, estado, cidade e plano." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <VisaoGrafica />;
}
