// Importa o HTML bruto como string via Vite raw import
import rawHtml from "../../public/distribuicao-regiao.html?raw";

export default function DistribuicaoRegiao() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "1080px",
      }}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: rawHtml }}
    />
  );
}
