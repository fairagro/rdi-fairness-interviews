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
    """Loads a file, standardizes the tracking ID, and extracts normalized FAIR columns."""
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

def plot_grouped_bar(file1_path, file2_path, output_path, id_col='RDIID'):
    # 1. Load dataframes and cleanly segment the cohorts
    df1, fair_cols_f1 = get_clean_dataframe(file1_path, id_col)
    df2, fair_cols_f2 = get_clean_dataframe(file2_path, id_col)

    if df1 is None or df2 is None:
        print("❌ Error processing data files.")
        return

    re3data_id_col = 'generalInfo.re3dataIdentifier'
    if re3data_id_col not in df2.columns:
        possible_cols = [c for c in df2.columns if 're3data' in c.lower() and 'id' in c.lower()]
        re3data_id_col = possible_cols[0] if possible_cols else re3data_id_col

    # Cohort A: Hand-Curated Survey Group (f1)
    df_survey = df1[df1[fair_cols_f1].sum(axis=1) > 0].copy()
    f1_has_r3d = df_survey[re3data_id_col].astype(str).str.strip().str.lower().str.startswith('r3d')
    survey_re3_shared_ids = set(df_survey[f1_has_r3d]['SHARED_ID'])

    # Cohort B: re3data Fallback Group (f2)
    df_re3data_all = df2[df2[re3data_id_col].astype(str).str.strip().str.lower().str.startswith('r3d')].copy()
    df_re3data = df_re3data_all[~df_re3data_all['SHARED_ID'].isin(survey_re3_shared_ids)].copy()

    # 2. Extract specific technical indicator sub-names
    # Using columns from f1 as the baseline schema index mapping
    indicator_mappings = []
    for col in fair_cols_f1:
        parts = col.split('.')
        if len(parts) >= 3:
            # Format: "Findability: PidAssignment"
            clean_label = f"{parts[1].capitalize()}: {parts[2]}"
            indicator_mappings.append({'col_f1': col, 'label': clean_label, 'short_name': parts[2].lower()})

    # 3. Calculate separate compliance rates (%) for each indicator per cohort
    plot_data = []
    for item in indicator_mappings:
        # Survey compliance rate
        survey_rate = df_survey[item['col_f1']].mean() * 100
        
        # Match the corresponding column in f2 by locating its matching indicator name part
        f2_col = [c for c in fair_cols_f2 if f".{item['short_name']}" in c.lower()]
        re3data_rate = df_re3data[f2_col[0]].mean() * 100 if f2_col else 0.0
        
        plot_data.append({
            'label': item['label'],
            'survey_rate': survey_rate,
            're3data_rate': re3data_rate,
            'max_rate': max(survey_rate, re3data_rate) # Used for smart sorting
        })

    # Sort indicators logically by highest survey performance for cleaner visualization
    plot_data = sorted(plot_data, key=lambda x: x['max_rate'], reverse=False)

    labels = [x['label'] for x in plot_data]
    survey_rates = [x['survey_rate'] for x in plot_data]
    re3data_rates = [x['re3data_rate'] for x in plot_data]

    # 4. Render Grouped Horizontal Bar Chart Geometry
    plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
    fig, ax = plt.subplots(figsize=(11, 12))
    
    y_positions = np.arange(len(labels))
    bar_height = 0.38  # Width of horizontal bars

    # Render bars with matching palette colors from radar chart (Teal vs Coral)
    rects1 = ax.barh(y_positions + bar_height/2, survey_rates, bar_height, 
                     label=f'RDI-operator Interviews (n={len(df_survey)})', color='#118ab2', alpha=0.95)
    rects2 = ax.barh(y_positions - bar_height/2, re3data_rates, bar_height, 
                     label=f're3data Fallback Population (n={len(df_re3data)})', color='#ef476f', alpha=0.95)

    # 5. Visual Formatting and Labeling Alignment
    ax.set_xlabel('Compliance Rate (%)', fontsize=12, fontweight='bold', labelpad=12, color='#2c3e50')
    ax.set_yticks(y_positions)
    ax.set_yticklabels(labels, fontsize=11, fontweight='semibold', color='#2c3e50')
    ax.set_xlim(0, 105) # Extra margin for text values if needed
    
    ax.xaxis.grid(True, color='#dbdbdb', linestyle='--', linewidth=1)
    ax.yaxis.grid(False) # Turn off horizontal lines to avoid vertical clutter

    # Symmetric legend placement centered below the chart canvas
    ax.legend(loc='upper center', bbox_to_anchor=(0.5, -0.06), ncol=2, 
              fontsize=11, frameon=True, facecolor='white', edgecolor='#e0e0e0')
    
    # Clean padding calculation
    plt.tight_layout()

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

    out_path = 'results/fair_compliance_detailed.png'
    plot_grouped_bar(f1_path, f2_path, out_path)
    print(f"Success! Elegant grouped bar chart saved to {out_path}")