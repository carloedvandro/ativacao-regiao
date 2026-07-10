import { useEffect, useState } from "react";
import { regioesBase, type Regiao } from "@/data/dados";

function clone(regs: Regiao[]): Regiao[] {
  return regs.map((r) => ({
    ...r,
    estados: r.estados.map((e) => ({
      ...e,
      cidades: e.cidades.map((c) => ({ ...c })),
    })),
  }));
}

export function withPercent(regs: Regiao[]): Regiao[] {
  const total = regs.reduce((s, r) => s + r.total, 0) || 1;
  return regs.map((r) => ({ ...r, percentual: (r.total / total) * 100 }));
}

/**
 * Simula ativações em tempo real: a cada 3s, escolhe uma região aleatória
 * ponderada pelo tamanho e incrementa +1 numa cidade dela.
 */
export function useLiveRegioes(intervalMs = 3000) {
  const [regioes, setRegioes] = useState<Regiao[]>(() => withPercent(clone(regioesBase)));
  const [lastUpdate, setLastUpdate] = useState<{ regiao: string; when: number } | null>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setRegioes((prev) => {
        const next = clone(prev);
        const weights = next.map((r) => r.total);
        const sum = weights.reduce((s, v) => s + v, 0);
        let pick = Math.random() * sum;
        let idx = 0;
        for (let i = 0; i < weights.length; i++) {
          pick -= weights[i];
          if (pick <= 0) {
            idx = i;
            break;
          }
        }
        const reg = next[idx];
        const est = reg.estados[Math.floor(Math.random() * reg.estados.length)];
        const cid = est.cidades[Math.floor(Math.random() * est.cidades.length)];
        const plano = ["gb50", "gb80", "gb100"][Math.floor(Math.random() * 3)] as
          | "gb50"
          | "gb80"
          | "gb100";
        cid[plano] += 1;
        reg.total += 1;
        reg.hoje += 1;
        setLastUpdate({ regiao: reg.nome, when: Date.now() });
        return withPercent(next);
      });
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return { regioes, lastUpdate };
}