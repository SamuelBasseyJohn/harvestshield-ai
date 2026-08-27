/* Native modules have no JS implementation under Jest — stub the surface we use. */
jest.mock('react-native-vision-camera', () => ({
  Camera: () => null,
  useCameraDevice: () => ({ id: 'mock-back' }),
  useCameraPermission: () => ({
    hasPermission: true,
    requestPermission: jest.fn(async () => true),
    canRequestPermission: true,
  }),
  usePhotoOutput: () => ({ capturePhoto: jest.fn() }),
}));

jest.mock('react-native-image-picker', () => ({
  launchImageLibrary: jest.fn(async () => ({ didCancel: true })),
}));

jest.mock('@dr.pogodin/react-native-fs', () => ({
  DocumentDirectoryPath: '/data/user/0/com.harvestshield/files',
  mkdir: jest.fn(async () => undefined),
  copyFile: jest.fn(async () => undefined),
  stat: jest.fn(async () => ({ size: 2048 })),
  unlink: jest.fn(async () => undefined),
}));
