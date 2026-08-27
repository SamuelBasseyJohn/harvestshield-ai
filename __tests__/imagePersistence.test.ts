/**
 * @format
 * Persistence is the difference between a scan whose photo survives the
 * session and one that silently blanks out, so the copy, the failure path and
 * the awkward URI shapes all get pinned down here.
 */
import {
  DocumentDirectoryPath,
  copyFile,
  mkdir,
  stat,
  unlink,
} from '@dr.pogodin/react-native-fs';
import {
  ImagePersistenceError,
  SCANS_DIRECTORY,
  extensionFor,
  persistImage,
  resetScanSequence,
  scanFileName,
  toReadablePath,
} from '../src/services/imageSource';
import type { LocalImage } from '../src/types';

const camera: LocalImage = {
  uri: 'file:///data/user/0/com.harvestshield/cache/mrousavy123.jpg',
  width: 1280,
  height: 960,
  type: 'image/jpeg',
  source: 'camera',
};

beforeEach(() => {
  jest.clearAllMocks();
  resetScanSequence();
  (stat as jest.Mock).mockResolvedValue({ size: 2048 });
  (copyFile as jest.Mock).mockResolvedValue(undefined);
});

describe('toReadablePath', () => {
  test('strips the file scheme', () => {
    expect(toReadablePath('file:///tmp/a.jpg')).toBe('/tmp/a.jpg');
  });

  test('decodes spaces and accents so the copy can find the file', () => {
    expect(toReadablePath('file:///tmp/my%20leaf%20photo.jpg')).toBe('/tmp/my leaf photo.jpg');
    expect(toReadablePath('file:///tmp/caf%C3%A9.jpg')).toBe('/tmp/café.jpg');
  });

  test('leaves content uris untouched for the ContentResolver', () => {
    expect(toReadablePath('content://media/external/images/1')).toBe(
      'content://media/external/images/1',
    );
  });

  test('survives a malformed percent escape', () => {
    expect(toReadablePath('file:///tmp/100%.jpg')).toBe('/tmp/100%.jpg');
  });
});

describe('extensionFor', () => {
  test('prefers the mime type', () => {
    expect(extensionFor({ type: 'image/png', fileName: 'x.jpg' })).toBe('png');
    expect(extensionFor({ type: 'image/jpeg' })).toBe('jpg');
  });

  test('falls back to the filename, then to jpg', () => {
    expect(extensionFor({ fileName: 'leaf.WEBP' })).toBe('webp');
    expect(extensionFor({})).toBe('jpg');
    expect(extensionFor({ fileName: 'no-extension' })).toBe('jpg');
  });
});

describe('scanFileName', () => {
  test('repeated scans in the same millisecond do not collide', () => {
    const a = scanFileName({ type: 'image/jpeg' }, 1000);
    const b = scanFileName({ type: 'image/jpeg' }, 1000);
    expect(a).not.toBe(b);
    expect(a.endsWith('.jpg')).toBe(true);
  });
});

describe('persistImage', () => {
  test('copies into app-private storage and returns the durable uri', async () => {
    const result = await persistImage(camera);

    expect(mkdir).toHaveBeenCalledWith(SCANS_DIRECTORY);
    expect(SCANS_DIRECTORY.startsWith(DocumentDirectoryPath)).toBe(true);
    const [from, to] = (copyFile as jest.Mock).mock.calls[0];
    expect(from).toBe('/data/user/0/com.harvestshield/cache/mrousavy123.jpg');
    expect(to.startsWith(`${SCANS_DIRECTORY}/scan_`)).toBe(true);
    expect(result.uri).toBe(`file://${to}`);
  });

  test('keeps every other field of the normalised object', async () => {
    const result = await persistImage(camera);
    expect(result).toMatchObject({
      width: 1280,
      height: 960,
      type: 'image/jpeg',
      source: 'camera',
    });
  });

  test('a gallery content uri is passed through verbatim to the copy', async () => {
    await persistImage({ uri: 'content://media/42', source: 'gallery' });
    expect((copyFile as jest.Mock).mock.calls[0][0]).toBe('content://media/42');
  });

  test('a missing source file fails loudly rather than returning a temp uri', async () => {
    (copyFile as jest.Mock).mockRejectedValue(new Error('ENOENT'));
    await expect(persistImage(camera)).rejects.toBeInstanceOf(ImagePersistenceError);
  });

  test('an empty copy is treated as a failure', async () => {
    (stat as jest.Mock).mockResolvedValue({ size: 0 });
    await expect(persistImage(camera)).rejects.toBeInstanceOf(ImagePersistenceError);
  });

  test('a failed copy leaves no half-written file behind', async () => {
    (copyFile as jest.Mock).mockRejectedValue(new Error('EIO'));
    await expect(persistImage(camera)).rejects.toThrow();
    expect(unlink).toHaveBeenCalled();
  });

  test('two scans land in different files', async () => {
    const first = await persistImage(camera);
    const second = await persistImage(camera);
    expect(first.uri).not.toBe(second.uri);
  });
});
