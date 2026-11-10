import os, sys
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fair_common_v2 import cohorts, indicator_rate

def main(f1, f2, out):
    survey, fallback, cols = cohorts(f1, f2)
    rows = []
    for c in cols:
        parts = c.split("."); label = f"{parts[1].capitalize()}: {parts[2]}"
        sr, sn, st = indicator_rate(survey, c); fr, fn, ft = indicator_rate(fallback, c)
        rows.append(dict(label=label, s=sr, sn=sn, st=st, f=fr, fn=fn, ft=ft,
                         key=max(sr if sr is not None else -1, fr if fr is not None else -1)))
        fmt = lambda v: " n/a" if v is None else f"{round(v):>4}"
        print(f"{parts[2]:26s} survey {fmt(sr)} ({sn}/{st})   fallback {fmt(fr)} ({fn}/{ft})")
    rows.sort(key=lambda r: r["key"])
    labels = [r["label"] for r in rows]
    plt.style.use("seaborn-v0_8-whitegrid" if "seaborn-v0_8-whitegrid" in plt.style.available else "default")
    fig, ax = plt.subplots(figsize=(11, 12)); y = np.arange(len(labels)); h = 0.38
    ax.barh(y + h / 2, [r["s"] or 0 for r in rows], h, label=f"RDI-operator Interviews (n={len(survey)})", color="#118ab2", alpha=0.95)
    ax.barh(y - h / 2, [r["f"] or 0 for r in rows], h, label=f"re3data Fallback Population (n={len(fallback)})", color="#ef476f", alpha=0.95)
    for i, r in enumerate(rows):
        if r["f"] is None:
            ax.text(1.5, i - h / 2, f"not assessable from re3data (0/{r['ft']} with evidence)", va="center", ha="left", fontsize=9, color="#ef476f", style="italic")
        elif r["fn"] < r["ft"]:
            ax.text(r["f"] + 1, i - h / 2, f"n={r['fn']}", va="center", fontsize=8, color="#5b6462")
        if r["s"] is None:
            ax.text(1.5, i + h / 2, f"not assessed (0/{r['st']})", va="center", ha="left", fontsize=9, color="#118ab2", style="italic")
        elif r["sn"] < r["st"]:
            ax.text(r["s"] + 1, i + h / 2, f"n={r['sn']}", va="center", fontsize=8, color="#5b6462")
    ax.set_xlabel("Compliance rate (% of repositories with evidence meeting the criterion)", fontsize=12, fontweight="bold", labelpad=12, color="#2c3e50")
    ax.set_yticks(y); ax.set_yticklabels(labels, fontsize=11, fontweight="semibold", color="#2c3e50"); ax.set_xlim(0, 105)
    ax.xaxis.grid(True, color="#dbdbdb", linestyle="--", linewidth=1); ax.yaxis.grid(False)
    ax.legend(loc="upper center", bbox_to_anchor=(0.5, -0.06), ncol=2, fontsize=11, frameon=True, facecolor="white", edgecolor="#e0e0e0")
    plt.tight_layout(); os.makedirs(os.path.dirname(out), exist_ok=True)
    plt.savefig(out, dpi=300, bbox_inches="tight"); plt.close(); print("saved", out)

if __name__ == "__main__":
    here = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    f1 = sys.argv[1] if len(sys.argv) > 2 else os.path.join(here, "data", "NFDI_RDIs_List_Ata - NFDI_RDIs.csv")
    f2 = sys.argv[2] if len(sys.argv) > 2 else os.path.join(here, "data", "NFDI-RDIs List - NFDI_RDIs_enriched.csv")
    main(f1, f2, os.path.join(here, "results", "fair_compliance_detailed_v2.png"))
