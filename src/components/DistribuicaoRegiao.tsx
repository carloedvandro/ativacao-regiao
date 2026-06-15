import { useEffect, useRef } from "react";
import rawHtml from "../../public/distribuicao-regiao.html?raw";

export default function DistribuicaoRegiao() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || host.shadowRoot) return;

    const shadow = host.attachShadow({ mode: "open" });
    shadow.innerHTML = rawHtml;

    // Re-executa scripts inline que foram inseridos via innerHTML
    const scripts = shadow.querySelectorAll("script");
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
