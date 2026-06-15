import { useEffect, useRef } from "react";

// Importa o HTML bruto como string via Vite raw import
import rawHtml from "../../public/distribuicao-regiao.html?raw";

export default function DistribuicaoRegiao() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = rawHtml;

    // Re-executa scripts inline que foram inseridos via innerHTML
    const scripts = container.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) =>
        newScript.setAttribute(attr.name, attr.value)
      );
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        maxWidth: "1080px",
      }}
    />
  );
}
