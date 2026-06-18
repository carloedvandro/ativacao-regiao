import { regioesBase, fmt } from "@/data/dados";

export default function EstadosDaRegiao({ regiaoNome }: { regiaoNome: string }) {
  const regiao = regioesBase.find((r) => r.nome === regiaoNome) ?? regioesBase[0];
  const estados = regiao.estados.map((e) => ({
    nome: e.nome,
    total: e.cidades.reduce((s, c) => s + c.gb50 + c.gb80 + c.gb100, 0),
  }));

  return (
    <section className="mt-6 border rounded-2xl p-5 shadow-sm">
      <h2 className="text-2xl font-black">
        Estados da Região Selecionada:{" "}
        <span style={{ color: regiao.cor }}>{regiao.nome.toUpperCase()}</span>
      </h2>
      <div className="mt-5 divide-y">
        {estados.map((e) => (
          <div key={e.nome} className="flex justify-between py-3">
            <span className="font-semibold">{e.nome}</span>
            <span className="font-black" style={{ color: regiao.cor }}>{fmt(e.total)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}