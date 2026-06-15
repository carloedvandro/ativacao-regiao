import { useEffect, useRef } from "react";

export default function DistribuicaoRegiao() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    fetch("/distribuicao-regiao.html")
      .then((res) => res.text())
      .then((html) => {
        container.innerHTML = html;
        // Re-execute inline scripts
        const scripts = container.querySelectorAll("script");
        scripts.forEach((oldScript) => {
          const newScript = document.createElement("script");
          Array.from(oldScript.attributes).forEach((attr) =>
            newScript.setAttribute(attr.name, attr.value)
          );
          newScript.appendChild(document.createTextNode(oldScript.innerHTML));
          oldScript.parentNode?.replaceChild(newScript, oldScript);
        });
      })
      .catch(() => {
        container.innerHTML =
          '<p style="padding:20px;color:#21004B">Erro ao carregar o conteúdo.</p>';
      });
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: "1080px",
        aspectRatio: "800 / 500",
        position: "relative",
      }}
    />
  );
}
