/**
 * @format
 * The image abstraction is the boundary between two native libraries and the
 * rest of the app, so its normalisation and its cancel/error branching are the
 * parts worth pinning down.
 */
import {
  ImageSourceError,
  fromPickerAsset,
  readPickerResponse,
  toFileUri,
} from '../src/services/imageSource';

describe('toFileUri', () => {
  test('adds the scheme to a bare VisionCamera path', () => {
    expect(toFileUri('/data/user/0/com.harvestshield/cache/x.jpg')).toBe(
      'file:///data/user/0/com.harvestshield/cache/x.jpg',
    );
  });

  test('leaves an already-qualified uri alone', () => {
    expect(toFileUri('file:///tmp/a.jpg')).toBe('file:///tmp/a.jpg');
    expect(toFileUri('content://media/1')).toBe('content://media/1');
  });
});

describe('fromPickerAsset', () => {
  test('normalises a gallery asset', () => {
    expect(
      fromPickerAsset({
        uri: 'content://media/42',
        width: 800,
        height: 600,
        fileName: 'leaf.jpg',
        type: 'image/jpeg',
      }),
    ).toEqual({
      uri: 'content://media/42',
      width: 800,
      height: 600,
      fileName: 'leaf.jpg',
      type: 'image/jpeg',
      source: 'gallery',
    });
  });

  test('rejects an asset with no uri', () => {
    expect(fromPickerAsset({ fileName: 'broken.jpg' })).toBeNull();
  });
});

describe('readPickerResponse', () => {
  test('cancellation is not an error', () => {
    expect(readPickerResponse({ didCancel: true })).toBeNull();
  });

  test('an empty selection is not an error', () => {
    expect(readPickerResponse({ assets: [] })).toBeNull();
  });

  test('a picker failure throws with its message', () => {
    expect(() =>
      readPickerResponse({ errorCode: 'others', errorMessage: 'no access' }),
    ).toThrow(ImageSourceError);
    expect(() => readPickerResponse({ errorCode: 'others' })).toThrow(/others/);
  });

  test('returns the first asset when several arrive', () => {
    const image = readPickerResponse({
      assets: [{ uri: 'content://a' }, { uri: 'content://b' }],
    });
    expect(image?.uri).toBe('content://a');
    expect(image?.source).toBe('gallery');
  });
});
