import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import os
import sys

def normalize_survey_data(val):
    if pd.isna(val): 
        return 0
    if isinstance(val, bool):
        return 1 if val else 0
    val_str = str(val).lower().strip()
    if val_str in ['yes', 'true', '1', '1.0']:
        return 1
    return 0

def get_clean_dataframe(file_path, id_col='RDIID'):
    df = pd.read_csv(file_path)
    
    actual_id_col = None
    for c in df.columns:
        if c.lower().strip() in [id_col.lower(), 'rfid']:
            actual_id_col = c
            break
            
    if actual_id_col is None:
        return None, []
        
    df['SHARED_ID'] = df[actual_id_col].astype(str).str.strip().str.lower()
    
    pillar_names = {'findability', 'accessibility', 'interoperability', 'reusability'}
    fair_cols = []
    for c in df.columns:
        parts = c.split('.')
        if len(parts) >= 3 and parts[0].lower().startswith('fairness') and parts[1].lower() in pillar_names:
            fair_cols.append(c)
            
    for col in fair_cols:
        df[col] = df[col].apply(normalize_survey_data)
        
    return df, fair_cols

def calculate_df_pillar_averages(df, target_cols, pillars):
    """Calculates individual row-level pillar averages (scaled 0-5) for a given dataframe."""
    row_averages = pd.DataFrame(index=df.index)
    row_averages['SHARED_ID'] = df['SHARED_ID']
    
    for p in pillars:
        p_cols = [c for c in target_cols if f'.{p.lower()}.' in c.lower()]
        if p_cols:
            row_averages[p] = df[p_cols].mean(axis=1) * 5
        else:
            row_averages[p] = 0.0
    return row_averages

def plot_radar(file1_path, file2_path, output_path, id_col='RDIID'):
    # 1. Load dataframes
    df1, fair_cols_f1 = get_clean_dataframe(file1_path, id_col)
    df2, fair_cols_f2 = get_clean_dataframe(file2_path, id_col)

    if df1 is None or df2 is None:
        print("❌ Error processing files. Execution halted.")
        return

    re3data_id_col = 'generalInfo.re3dataIdentifier'
    if re3data_id_col not in df2.columns:
        possible_cols = [c for c in df2.columns if 're3data' in c.lower() and 'id' in c.lower()]
        re3data_id_col = possible_cols[0] if possible_cols else re3data_id_col

    print("\n🔍 --- DATASET VALIDATION AND METRICS LOG ---")
    
    # 2. Group 1: Hand-Curated Survey Data (File 1)
    df_survey = df1[df1[fair_cols_f1].sum(axis=1) > 0].copy()
    f1_has_r3d = df_survey[re3data_id_col].astype(str).str.strip().str.lower().str.startswith('r3d')
    survey_re3_shared_ids = set(df_survey[f1_has_r3d]['SHARED_ID'])
    
    print(f"📋 File 1 (Survey Gold-Standard):")
    print(f"   Total valid records: {len(df_survey)}")
    print(f"   └─ Contains re3data IDs (r3d...): {len(survey_re3_shared_ids)}")
    print(f"   └─ Does NOT contain re3data IDs : {len(df_survey) - len(survey_re3_shared_ids)}")

    # 3. Group 2: re3data Fallback Population (File 2)
    if re3data_id_col in df2.columns:
        f2_has_r3d_initial = df2[re3data_id_col].astype(str).str.strip().str.lower().str.startswith('r3d')
        df_re3data_all = df2[f2_has_r3d_initial].copy()
        total_re3_in_f2 = len(df_re3data_all)
        
        df_re3data = df_re3data_all[~df_re3data_all['SHARED_ID'].isin(survey_re3_shared_ids)].copy()
        leftover_re3 = len(df_re3data)
        print(f"\n🌐 File 2 (re3data Automated Source):")
        print(f"   Total initial re3data records (start with 'r3d'): {total_re3_in_f2}")
        print(f"   Records masked out (strictly matching the re3 records in File 1): -{total_re3_in_f2 - leftover_re3}")
        print(f"   🔥 Final re3data-only records remaining for plot : {leftover_re3}")
    else:
        print(f"\n❌ Error: Target column '{re3data_id_col}' missing from File 2.")
        return

    pillars = ['Findability', 'Accessibility', 'Interoperability', 'Reusability']

    # 4. Group 3: Compute Overall Landscape Baseline
    # Pre-calculate row averages per repository for clean alignment
    survey_scores = calculate_df_pillar_averages(df_survey, fair_cols_f1, pillars)
    fallback_scores = calculate_df_pillar_averages(df_re3data, fair_cols_f2, pillars)
    
    # Combine data sets dynamically: take survey scores as ground truth, append unique fallbacks
    combined_scores = pd.concat([survey_scores, fallback_scores]).drop_duplicates(subset=['SHARED_ID'], keep='first')
    total_landscape_count = len(combined_scores)
    print(f"\n🌍 Comprehensive Landscape Baseline:")
    print(f"   📊 Total unique repositories combined: {total_landscape_count}")
    print("---------------------------------------------\n")

    # 5. Radar Plot Setup
    angles = np.linspace(0, 2 * np.pi, len(pillars), endpoint=False).tolist()
    angles += angles[:1]

    plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
    fig, ax = plt.subplots(figsize=(8, 8), subplot_kw=dict(polar=True))
    ax.set_theta_offset(np.pi / 2)
    ax.set_theta_direction(-1)

    # 3-Layer configurations with a neutral gray for the baseline layer
    comparison_configs = [
        {
            'label': f'Hand-Curated Surveys (n={len(df_survey)})',
            'type': 'df_calc', 'df': df_survey, 'cols': fair_cols_f1,
            'color': '#118ab2', 'marker': 'o', 'alpha': 0.12, 'lw': 3, 'z': 4
        },
        {
            'label': f'Overall Landscape Baseline (n={total_landscape_count})',
            'type': 'pre_calc', 'df': combined_scores, 'cols': None,
            'color': '#7f8c8d', 'marker': 'D', 'alpha': 0.05, 'lw': 2, 'z': 2
        },
        {
            'label': f're3data Fallback Population (n={leftover_re3})',
            'type': 'df_calc', 'df': df_re3data, 'cols': fair_cols_f2,
            'color': '#ef476f', 'marker': 's', 'alpha': 0.12, 'lw': 3, 'z': 3
        }
    ]

    for cfg in comparison_configs:
        if cfg['type'] == 'df_calc':
            pillar_avg = {}
            for p in pillars:
                p_cols = [c for c in cfg['cols'] if f'.{p.lower()}.' in c.lower()]
                pillar_avg[p] = cfg['df'][p_cols].mean(axis=1).mean() * 5 if p_cols else 0
        else:
            # Grab from precalculated combined framework matrix columns directly
            pillar_avg = {p: cfg['df'][p].mean() for p in pillars}

        values = [pillar_avg[p] for p in pillars]
        values += values[:1]

        ax.plot(angles, values, color=cfg['color'], linewidth=cfg['lw'], 
                marker=cfg['marker'], markersize=8, label=cfg['label'], zorder=cfg['z'])
        ax.fill(angles, values, color=cfg['color'], alpha=cfg['alpha'], zorder=cfg['z']-1)

    # 6. Aesthetic Formatting
    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(pillars, fontsize=13, fontweight='bold', color='#2b2b2b')
    ax.xaxis.grid(True, color='#dbdbdb', linestyle='--', linewidth=1)
    ax.yaxis.grid(True, color='#e0e0e0', linestyle='-', linewidth=0.8)

    ax.set_ylim(0, 5)
    ax.set_yticks([1, 2, 3, 4, 5])
    ax.set_yticklabels(['1', '2', '3', '4', '5'], color='#8c8c8c', size=11, fontweight='semibold')
    ax.set_rlabel_position(45) 

    plt.title('FAIR Maturity: Curated Survey vs. Comprehensive Landscape Baseline', size=14, fontweight='bold', color='#1a1a1a', pad=35)
    plt.legend(loc='upper center', bbox_to_anchor=(0.5, -0.08), ncol=3, fontsize=10, frameon=True, facecolor='white', edgecolor='#e0e0e0')
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    plt.savefig(output_path, dpi=300, bbox_inches='tight')
    plt.close()

if __name__ == '__main__':
    if len(sys.argv) >= 3:
        f1_path = sys.argv[1]
        f2_path = sys.argv[2]
    else:
        f1_path = 'data/NFDI_RDIs_List_Ata - NFDI_RDIs.csv'
        f2_path = 'data/NFDI-RDIs List - NFDI_RDIs_enriched.csv'

    out_path = 'results/fair_radar_summary.png'
    plot_radar(f1_path, f2_path, out_path)
    print(f"Success! Three-tier multi-dimensional radar plot generated and saved to {out_path}")