import { useEffect, useRef } from "react";

export default function DistribuicaoRegiao() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || host.shadowRoot) return;

    fetch("/distribuicao-regiao.html")
      .then((res) => res.text())
      .then((html) => {
        const shadow = host.attachShadow({ mode: "open" });
        shadow.innerHTML = html;

        // Re-executa scripts inline que foram inseridos via innerHTML
        const scripts = shadow.querySelectorAll("script");
        scripts.forEach((oldScript) => {
          const newScript = document.createElement("script");
          Array.from(oldScript.attributes).forEach((attr) =>
            newScript.setAttribute(attr.name, attr.value)
          );
          newScript.appendChild(
            document.createTextNode(oldScript.innerHTML)
          );
          oldScript.parentNode?.replaceChild(newScript, oldScript);
        });
      })
      .catch(() => {
        if (host.shadowRoot) {
          host.shadowRoot.innerHTML =
            '<p style="padding:20px;color:#21004B">Erro ao carregar o conteúdo.</p>';
        }
      });
  }, []);

  return (
    <div
      ref={hostRef}
      style={{
        width: "100%",
        maxWidth: "1080px",
        aspectRatio: "800 / 500",
        position: "relative",
        overflow: "hidden",
        borderRadius: "10px",
        boxShadow: "0 18px 45px rgba(0,0,0,.12)",
      }}
    />
  );
}
