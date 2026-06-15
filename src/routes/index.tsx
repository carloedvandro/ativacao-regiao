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
      <div
        style={{
          width: "100%",
          maxWidth: "1080px",
          aspectRatio: "800 / 500",
          position: "relative",
          overflow: "hidden",
          borderRadius: "10px",
          boxShadow: "0 18px 45px rgba(0,0,0,.12)",
        }}
      >
        <iframe
          src="/distribuicao-regiao.html"
          title="Distribuição por Região — SmartVoz"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            border: "none",
            display: "block",
          }}
        />
      </div>
    </main>
  );
}
