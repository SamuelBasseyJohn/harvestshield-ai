import {
  DocumentDirectoryPath,
  copyFile,
  mkdir,
  stat,
  unlink,
} from '@dr.pogodin/react-native-fs';
import {
  launchImageLibrary,
  type Asset,
  type ImagePickerResponse,
} from 'react-native-image-picker';
import type { Photo } from 'react-native-vision-camera';
import type { LocalImage } from '../types';

/**
 * The only module in the app that knows which native libraries produce images.
 *
 * Screens consume `LocalImage` and stay unaware of VisionCamera and
 * image-picker entirely, so either can be swapped without touching the UI.
 */

/** Raised when the user picked something but we could not read it. */
export class ImageSourceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ImageSourceError';
  }
}

/**
 * Raised when an accepted image could not be copied into persistent storage.
 *
 * This is deliberately fatal to the scan: continuing with the original URI
 * would hand the user a scan whose photograph can vanish from History the
 * moment Android reclaims the cache.
 */
export class ImagePersistenceError extends Error {
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = 'ImagePersistenceError';
  }
}

/**
 * App-private storage. Not the cache directory: both VisionCamera's temporary
 * file and image-picker's copy land in `getCacheDir()`, which Android clears
 * whenever it wants the space back.
 *
 * Nothing here is world-readable, so no storage permission is involved.
 */
export const SCANS_DIRECTORY = `${DocumentDirectoryPath}/harvestshield/scans`;

/**
 * Converts an image URI into something the filesystem layer can open.
 *
 * `content://` URIs are resolved by Android's ContentResolver and must be
 * passed through untouched. `file://` URIs are percent-encoded, so a path
 * containing spaces or accents has to be decoded back into a real path.
 */
export const toReadablePath = (uri: string): string => {
  if (uri.startsWith('content://')) return uri;
  const path = uri.startsWith('file://') ? uri.slice('file://'.length) : uri;
  try {
    return decodeURIComponent(path);
  } catch {
    // A stray '%' that is not an escape sequence — use the path as given.
    return path;
  }
};

const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/heic': 'heic',
  'image/heif': 'heif',
};

/** Best-effort extension from the mime type, then the filename, then jpg. */
export const extensionFor = (image: Pick<LocalImage, 'type' | 'fileName'>): string => {
  const fromType = image.type ? EXTENSIONS[image.type.toLowerCase()] : undefined;
  if (fromType) return fromType;
  const match = image.fileName?.match(/\.([A-Za-z0-9]{1,5})$/);
  return match ? match[1].toLowerCase() : 'jpg';
};

let sequence = 0;

/**
 * Collision-safe within a session and across restarts: the timestamp separates
 * runs, the counter separates scans taken inside the same millisecond.
 */
export const scanFileName = (
  image: Pick<LocalImage, 'type' | 'fileName'>,
  now: number = Date.now(),
): string => `scan_${now}_${(sequence++).toString(36)}.${extensionFor(image)}`;

/** Test hook so filename assertions are deterministic. */
export const resetScanSequence = () => {
  sequence = 0;
};

/**
 * Copies an accepted image into app-private storage and returns the same
 * normalised object pointing at the durable copy.
 *
 * Throws rather than falling back to the temporary URI — see
 * {@linkcode ImagePersistenceError}.
 */
export const persistImage = async (image: LocalImage): Promise<LocalImage> => {
  const destination = `${SCANS_DIRECTORY}/${scanFileName(image)}`;
  try {
    await mkdir(SCANS_DIRECTORY);
    await copyFile(toReadablePath(image.uri), destination);
    const info = await stat(destination);
    if (!Number(info.size)) {
      throw new Error('the copied file is empty');
    }
  } catch (error) {
    // Never leave a half-written file behind to be rendered later.
    await unlink(destination).catch(() => undefined);
    throw new ImagePersistenceError(
      'The photo could not be saved to this device. Please try again.',
      error,
    );
  }
  return { ...image, uri: `file://${destination}` };
};

/**
 * VisionCamera returns a bare filesystem path; RN's <Image> needs a URL.
 * Kept exported so it can be unit tested without a native module.
 */
export const toFileUri = (path: string): string =>
  path.startsWith('file://') || path.startsWith('content://') ? path : `file://${path}`;

/**
 * Normalises a captured photo, saving it to a temporary file so the rest of
 * the app can treat it like any other local image.
 *
 * The native `Photo` holds a large native buffer, so it is always disposed —
 * including when saving fails.
 */
export const fromCameraPhoto = async (photo: Photo): Promise<LocalImage> => {
  try {
    const path = await photo.saveToTemporaryFileAsync();
    return persistImage({
      uri: toFileUri(path),
      width: photo.width,
      height: photo.height,
      type: 'image/jpeg',
      source: 'camera',
    });
  } finally {
    photo.dispose();
  }
};

/** Normalises one image-picker asset. Exported for testing. */
export const fromPickerAsset = (asset: Asset): LocalImage | null => {
  if (!asset.uri) return null;
  return {
    uri: asset.uri,
    width: asset.width,
    height: asset.height,
    fileName: asset.fileName,
    type: asset.type,
    source: 'gallery',
  };
};

/**
 * Interprets an image-picker response.
 *
 * Cancellation is a normal outcome and resolves to null; only a genuine
 * failure throws. Exported separately from `pickFromGallery` so the branching
 * is testable without the native picker.
 */
export const readPickerResponse = (response: ImagePickerResponse): LocalImage | null => {
  if (response.didCancel) return null;
  if (response.errorCode) {
    throw new ImageSourceError(
      response.errorMessage ?? `Image picker failed (${response.errorCode})`,
    );
  }
  const asset = response.assets?.[0];
  return asset ? fromPickerAsset(asset) : null;
};

/**
 * Opens the system photo picker for a single image.
 *
 * On modern Android this is the OS photo picker, which grants access to just
 * the chosen item — so no storage permission is requested at any point.
 * Resolves null if the user backs out.
 */
export const pickFromGallery = async (): Promise<LocalImage | null> => {
  const response = await launchImageLibrary({
    mediaType: 'photo',
    selectionLimit: 1,
    includeBase64: false,
    // We only ever read the file locally; nothing is uploaded.
    includeExtra: false,
  });
  const picked = readPickerResponse(response);
  // image-picker copies the selection into getCacheDir(), which Android
  // auto-cleans, so the gallery path needs persisting just like the camera.
  return picked ? persistImage(picked) : null;
};
