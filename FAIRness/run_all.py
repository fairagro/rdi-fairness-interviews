import subprocess
import os

# Define the scripts execution list with explicit arguments
scripts = [
    ('scripts/plot_radar.py',  []),
    ('scripts/plot_bar.py', ['data/NFDI_RDIs_List_Ata - NFDI_RDIs.csv'])
]

os.makedirs('results', exist_ok=True)

for script, args in scripts:
    if not os.path.exists(script):
        print(f"Skipping {script}: Target file not found.")
        continue
        
    print(f"\n=========================================")
    print(f"Running: {script} {' '.join(args)}")
    print(f"=========================================")
    
    result = subprocess.run(['python3', script] + args)
    
    if result.returncode != 0:
        print(f"❌ Error occurred while running {script}. Halting execution loop.")
        break
else:
    print("\n✅ Execution complete! All data processing and visualizations generated successfully.")