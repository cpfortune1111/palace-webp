import shutil
from pathlib import Path

destination = Path(__file__).resolve().parents[1] / 'Data/System/page-pattern.webp'
shutil.copyfile('E:/3D 2022/LOGO/BG.webp', destination)
print(destination.stat().st_size)

