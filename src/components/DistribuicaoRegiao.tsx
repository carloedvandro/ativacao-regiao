import { useEffect, useRef } from "react";

// Importa o HTML bruto como string via Vite raw import
import rawHtml from "../../public/distribuicao-regiao.html?raw";

function extractBodyContent(html: string): { css: string; body: string } {
  const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  const css = styleMatch ? styleMatch[1] : "";

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const body = bodyMatch ? bodyMatch[1] : html;

  return { css, body };
}

export default function DistribuicaoRegiao() {
  const styleRef = useRef<HTMLStyleElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const { css, body } = extractBodyContent(rawHtml);

    // Remove estilos antigos se existirem
    if (styleRef.current && styleRef.current.parentNode) {
      styleRef.current.parentNode.removeChild(styleRef.current);
    }

    // Injeta o CSS em um <style> scoped ao container
    const styleEl = document.createElement("style");
    styleEl.textContent = css;
    styleRef.current = styleEl;
    document.head.appendChild(styleEl);

    // Injeta o conteúdo do body
    container.innerHTML = body;

    // Re-executa scripts inline
    const scripts = container.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) =>
        newScript.setAttribute(attr.name, attr.value)
      );
      newScript.appendChild(document.createTextNode(oldScript.innerHTML));
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });

    return () => {
      if (styleRef.current && styleRef.current.parentNode) {
        styleRef.current.parentNode.removeChild(styleRef.current);
      }
    };
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
