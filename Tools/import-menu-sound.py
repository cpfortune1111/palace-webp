from pathlib import Path
import subprocess

source = Path(r'E:\3D 2022\SFX')
target = Path(__file__).resolve().parents[1] / 'Data' / 'Sound'
target.mkdir(parents=True, exist_ok=True)
encoder = Path(r'C:\Users\jeffy\AppData\Local\Programs\BilibiliVideoDownload\resources\app.asar.unpacked\node_modules\ffmpeg-static\ffmpeg.exe')
names = ['logo.wav', 'select-mode.wav', 'select-settings.wav', 'btn-click.wav', 'btn-back.wav', 'acs-add.wav', 'acs-minus.wav', 'select.wav', 'BGM-report.flac']
for name in names:
    original = source / name
    output = target / (original.stem + '.mp3')
    bitrate = '192k' if original.suffix == '.flac' else '128k'
    subprocess.run([str(encoder), '-y', '-hide_banner', '-loglevel', 'error', '-i', str(original), '-map_metadata', '-1', '-codec:a', 'libmp3lame', '-b:a', bitrate, str(output)], check=True)
    print(name, original.stat().st_size, '->', output.stat().st_size)
print('Compressed', len(names), 'menu sounds')


