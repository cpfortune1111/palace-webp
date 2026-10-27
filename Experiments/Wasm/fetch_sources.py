"""Fetch immutable source snapshots into a private, initially empty directory."""
import argparse, hashlib, io, json, pathlib, urllib.request, zipfile

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--destination', required=True)
    args = parser.parse_args()
    destination = pathlib.Path(args.destination).resolve()
    site = pathlib.Path(__file__).resolve().parents[2]
    if destination == site or site in destination.parents:
        parser.error('Use a private destination outside the published site.')
    if destination.exists() and any(destination.iterdir()):
        parser.error('Destination must be empty; existing files are never overwritten.')
    lock = json.loads(pathlib.Path(__file__).with_name('source-lock.json').read_text())
    # Verify both archives completely before writing either snapshot.
    snapshots = []
    for source in lock['sources']:
        url = 'https://codeload.github.com/' + source['repository'] + '/zip/' + source['commit']
        data = urllib.request.urlopen(url, timeout=180).read()
        contents = []
        with zipfile.ZipFile(io.BytesIO(data)) as archive:
            prefix = archive.namelist()[0]
            for entry in source['files']:
                relative = pathlib.PurePosixPath(entry['path'])
                if relative.is_absolute() or '..' in relative.parts:
                    raise ValueError('Unsafe source path')
                if entry['mode'] != '100644' and entry['mode'] != '100755':
                    raise ValueError('Unsupported source file mode')
                content = archive.read(prefix + entry['path'])
                actual = hashlib.sha1(b'blob ' + str(len(content)).encode() + b'\0' + content).hexdigest()
                # Git archive may apply export EOL attributes. Accept normalization
                # only when it reconstructs the exact locked Git blob bytes.
                if actual != entry['sha']:
                    normalized = content.replace(b'\r\n', b'\n')
                    normalized_hash = hashlib.sha1(b'blob ' + str(len(normalized)).encode() + b'\0' + normalized).hexdigest()
                    if normalized_hash == entry['sha']:
                        content, actual = normalized, normalized_hash
                if actual != entry['sha']:
                    raise ValueError('Source hash mismatch: ' + entry['path'])
                contents.append((entry['path'], content))
        snapshots.append((source, contents))
    receipt = []
    for source, contents in snapshots:
        for name, content in contents:
            target = destination / source['name'] / name
            target.parent.mkdir(parents=True, exist_ok=True)
            target.write_bytes(content)
        receipt.append(dict(name=source['name'], commit=source['commit'], files=len(contents), verified=True))
    (destination / 'verification.json').write_text(json.dumps(receipt, indent=2))
    print(json.dumps(receipt, indent=2))

if __name__ == '__main__':
    main()
