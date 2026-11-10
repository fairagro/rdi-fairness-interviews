import os, sys
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fair_common_v2 import PILLARS, cohorts, cohort_pillar_means, pillar_score

def main(f1, f2, out):
    survey, fallback, cols = cohorts(f1, f2)
    s_means = cohort_pillar_means(survey, cols)
    f_means = cohort_pillar_means(fallback, cols)
    # landscape baseline = per-repository pillar scores of both cohorts pooled
    pooled = {p: [] for p in PILLARS}
    for rows in (survey, fallback):
        for r in rows:
            for p in PILLARS:
                v, _ = pillar_score(r, cols, p)
                if v is not None: pooled[p].append(v)
    o_means = {p: sum(v) / len(v) for p, v in pooled.items()}
    n_all = len(survey) + len(fallback)
    print("survey  ", {p: round(v, 2) for p, v in s_means.items()})
    print("fallback", {p: round(v, 2) for p, v in f_means.items()})
    print("overall ", {p: round(v, 2) for p, v in o_means.items()})

    labels = [p.capitalize() for p in PILLARS]
    angles = np.linspace(0, 2 * np.pi, len(PILLARS), endpoint=False).tolist(); angles += angles[:1]
    plt.style.use("seaborn-v0_8-whitegrid" if "seaborn-v0_8-whitegrid" in plt.style.available else "default")
    fig, ax = plt.subplots(figsize=(8, 8), subplot_kw=dict(polar=True))
    ax.set_theta_offset(np.pi / 2); ax.set_theta_direction(-1)
    series = [
        (f"Hand-Curated Surveys (n={len(survey)})", s_means, "#118ab2", "o", 0.12, 3, 4),
        (f"Overall Landscape Baseline (n={n_all})", o_means, "#7f8c8d", "D", 0.05, 2, 2),
        (f"re3data Fallback Population (n={len(fallback)})", f_means, "#ef476f", "s", 0.12, 3, 3),
    ]
    for label, means, color, marker, alpha, lw, z in series:
        vals = [means[p] for p in PILLARS]; vals += vals[:1]
        ax.plot(angles, vals, color=color, linewidth=lw, marker=marker, markersize=8, label=label, zorder=z)
        ax.fill(angles, vals, color=color, alpha=alpha, zorder=z - 1)
    ax.set_xticks(angles[:-1]); ax.set_xticklabels(labels, fontsize=13, fontweight="bold", color="#2b2b2b")
    ax.xaxis.grid(True, color="#dbdbdb", linestyle="--", linewidth=1); ax.yaxis.grid(True, color="#e0e0e0", linewidth=0.8)
    ax.set_ylim(0, 5); ax.set_yticks([1, 2, 3, 4, 5]); ax.set_yticklabels(["1", "2", "3", "4", "5"], color="#8c8c8c", size=11, fontweight="semibold")
    ax.set_rlabel_position(45)
    plt.title("FAIR Maturity: Curated Survey vs. Comprehensive Landscape Baseline", size=14, fontweight="bold", color="#1a1a1a", pad=35)
    plt.legend(loc="upper center", bbox_to_anchor=(0.5, -0.06), ncol=3, fontsize=10, frameon=True, facecolor="white", edgecolor="#e0e0e0")
    fig.text(0.5, -0.035, "Pillar score = 5 × (indicators met / indicators assessed); indicators without evidence are excluded from the denominator.",
             ha="center", fontsize=8.5, color="#5b6462")
    os.makedirs(os.path.dirname(out), exist_ok=True)
    plt.savefig(out, dpi=300, bbox_inches="tight"); plt.close()
    print("saved", out)

if __name__ == "__main__":
    here = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    f1 = sys.argv[1] if len(sys.argv) > 2 else os.path.join(here, "data", "NFDI_RDIs_List_Ata - NFDI_RDIs.csv")
    f2 = sys.argv[2] if len(sys.argv) > 2 else os.path.join(here, "data", "NFDI-RDIs List - NFDI_RDIs_enriched.csv")
    main(f1, f2, os.path.join(here, "results", "fair_radar_summary_v2.png"))
