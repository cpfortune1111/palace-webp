"""Reuse the existing presentation and control markup without the JS battle runtime."""
import pathlib,re
here=pathlib.Path(__file__).resolve().parent;root=here.parents[1];source=(root/'index.html').read_text(encoding='utf-8')
style=re.search(r'<style>(.*?)</style>',source,re.S).group(0);imports=re.search(r'<script type="importmap">.*?</script>',source,re.S).group(0);body=source.split('<body>',1)[1].split('<script type="module">',1)[0]
html='<!doctype html><html><head><meta charset="utf-8"><base href="../../"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"><title>Moon Palace WASM Preview</title><link rel="icon" href="data:,">'+style+imports+'</head><body>'+body+'<script type="module" src="Experiments/Wasm/host-ui.js?battle-ready=2"></script></body></html>'
(here/'play.html').write_text(html,encoding='utf-8')
