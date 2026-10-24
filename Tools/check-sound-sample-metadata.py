import io
import hashlib
import json
import tempfile
import unittest
import wave
from pathlib import Path

from sound_sample_metadata import enrich_sound_manifest, source_sound_metadata, wave_sound_manifest


class SourceSoundMetadataTests(unittest.TestCase):
    def test_native_frame_units(self):
        for rate in (22050, 44100, 48000):
            for channels in (1, 2):
                for width in (1, 2):
                    with self.subTest(rate=rate, channels=channels, width=width):
                        output = io.BytesIO()
                        with wave.open(output, 'wb') as recording:
                            recording.setnchannels(channels)
                            recording.setsampwidth(width)
                            recording.setframerate(rate)
                            recording.writeframes(bytes(17 * channels * width))
                        self.assertEqual(source_sound_metadata(output.getvalue()), {
                            'sourceSampleRate': rate,
                            'sourceFrames': 17,
                            'sourceChannels': channels,
                            'sourceSampleWidth': width,
                        })

    def test_invalid_sample_is_not_guessed(self):
        with self.assertRaises((wave.Error, EOFError)):
            source_sound_metadata(b'not a waveform')

    def fixture(self, root):
        output = io.BytesIO()
        with wave.open(output, 'wb') as recording:
            recording.setnchannels(1)
            recording.setsampwidth(2)
            recording.setframerate(22050)
            recording.writeframes(bytes(17 * 2))
        sample = output.getvalue()
        digest = hashlib.sha256(sample).hexdigest()
        (root / 'original').mkdir()
        (root / 'original' / 'test.snd').write_bytes(b'prefix' + sample)
        (root / 'manifest.json').write_text(json.dumps({'dependencies': {'sound': 'test.snd'}}))
        entry = {'group': 7, 'number': 1, 'offset': 6, 'bytes': len(sample), 'sha256': digest}
        (root / 'snd_directory.json').write_text(json.dumps([entry]))
        return {'7-1': {'file': '7-1.mp3', 'ticks': 1, 'sourceSHA256': digest}}, entry

    def test_enrichment_preserves_existing_fields(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            sounds, entry = self.fixture(root)
            enriched = enrich_sound_manifest(root, sounds)
            self.assertEqual(enriched['7-1'], {
                **sounds['7-1'], 'sourceSampleRate': 22050, 'sourceFrames': 17,
                'sourceChannels': 1, 'sourceSampleWidth': 2,
            })
            self.assertNotIn('sourceFrames', sounds['7-1'])

    def test_enrichment_rejects_wrong_hash_and_bounds(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            sounds, entry = self.fixture(root)
            wrong = {'7-1': {**sounds['7-1'], 'sourceSHA256': 'bad'}}
            with self.assertRaisesRegex(ValueError, 'checksum'):
                enrich_sound_manifest(root, wrong)
            entry['offset'] = -1
            (root / 'snd_directory.json').write_text(json.dumps([entry]))
            with self.assertRaisesRegex(ValueError, 'outside'):
                enrich_sound_manifest(root, sounds)

    def test_grouped_wave_manifest(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            sounds, entry = self.fixture(root)
            public = root / 'public'
            public.mkdir()
            (public / 'common-7-1.wav').write_bytes((root / 'original' / 'test.snd').read_bytes()[6:])
            manifest = wave_sound_manifest(public, 'common-')
            self.assertEqual(manifest['7-1']['sourceFrames'], 17)
            self.assertEqual(manifest['7-1']['file'], 'common-7-1.wav')
            self.assertEqual(manifest['7-1']['nativeSHA256'], sounds['7-1']['sourceSHA256'])
            with self.assertRaisesRegex(ValueError, 'filename'):
                wave_sound_manifest(public)


if __name__ == '__main__':
    unittest.main()
