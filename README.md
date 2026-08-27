# HarvestShield AI

AI-powered plant health intelligence for Nigerian farms.

HarvestShield turns a photograph of a single leaf into a plant health reading:
healthy or diseased, the likely disease, and a confidence score the farmer can
weigh. It is built as a native mobile application, offline-first, with the
inference intended to run entirely on the device.

```
plant image → preprocessing → image classification → healthy / diseased
            → likely disease → confidence score → result
```

---

## Stack

| Layer | Choice |
| --- | --- |
| Runtime | React Native CLI 0.87 (no Expo) |
| Language | TypeScript 6 |
| Navigation | React Navigation 7 — native stack + bottom tabs |
| Styling | `StyleSheet` on a hand-built token system (no NativeWind, no UI kit) |
| Vectors | `react-native-svg` — icons, brand mark and illustrations are drawn, never fetched |
| Camera | `react-native-vision-camera` (+ `react-native-nitro-modules`, `react-native-nitro-image`) |
| Gallery | `react-native-image-picker` — system photo picker, no storage permission |
| Filesystem | `@dr.pogodin/react-native-fs` — copies scans into app-private storage |
| State | React hooks + one `useSyncExternalStore` module store |
| Testing | Jest |

Eleven runtime dependencies beyond React and React Native. No paid services, no
backend, no analytics SDK, no icon fonts, no bundled typefaces.

Android permissions: `INTERNET` and `CAMERA`. Nothing else — the gallery uses
the system photo picker, which grants access to the single chosen item.

---

## Local setup

Prerequisites: Node 20+, a JDK (17-21), Android SDK (platform 36, build-tools 36)
with `ANDROID_HOME` set. For iOS, Xcode and CocoaPods.

The simplest JDK is the one bundled with Android Studio - it tracks IDE updates,
so there is nothing separate to install or keep current:

```bash
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export PATH="$JAVA_HOME/bin:$PATH"
```

```bash
npm install
```

### Run on Android

```bash
npm start          # terminal 1 — Metro
npm run android    # terminal 2 — build, install and launch
```

Or build the APK directly:

```bash
cd android && ./gradlew assembleDebug
# android/app/build/outputs/apk/debug/app-debug.apk
```

> **If Gradle exits immediately with no output and `java -version` prints
> nothing**, macOS is killing the JVM with `SIGKILL (Code Signature Invalid)`.
> This happens when an in-place update rewrites `bin/java` onto a reused inode
> while the kernel still holds the previous binary's code-signing record. The
> bytes are fine - the file just needs a new inode:
>
> ```bash
> B="$JAVA_HOME/bin"
> cp -p "$B/java" "$B/.java.new" && mv -f "$B/.java.new" "$B/java"
> ```
>
> Verify with `shasum -a 256` before and after: the hash is unchanged and the
> vendor signature stays intact (`codesign -v "$B/java"`).

### Run on iOS

```bash
bundle install && bundle exec pod install --project-directory=ios
npm run ios
```

iOS is kept compatible but Android is the primary target for this phase.

### Checks

```bash
npx tsc --noEmit   # types
npm run lint       # eslint
npm test           # jest
```

---

## Project structure

```
src/
  theme/          colour, typography, spacing, radius and elevation tokens
  components/     design-system primitives (Text, Button, Card, Pill, Screen…)
  icons/          24×24 stroke icon set as path data + one Icon component
  navigation/     root stack, tab navigator, custom tab bar
  features/
    onboarding/   splash + three-slide introduction
    home/         primary landing surface
    scan/         capture → preview → analysing
    diagnosis/    result screen
    history/      scan history + shared scan row
    library/      disease library + detail
    profile/      settings and engine status
    comingSoon/   feature registry + the shared Coming Soon screen
  services/       analysis (mocked inference), image acquisition, history store
  data/           disease reference data
  types/          shared domain types
```

### Navigation model

Bottom tabs carry **Home · Library · Scan · History · Profile**, but Scan is not
an ordinary tab. It renders as a raised centre action that pushes a full-screen
flow onto the root stack, so the tab bar disappears during capture and the
result screen owns the whole canvas. Scanning is the product; it gets the
strongest affordance on the screen.

---

## Implementation status

**Working end to end**

- Splash → onboarding → tabbed application shell
- Home with greeting, scan call-to-action, live scan statistics, recent scans
- Full scan journey with **real image acquisition**: live camera capture or
  system photo picker → image preview → staged analysis → diagnosis result
- Diagnosis result: status, disease, animated confidence meter, key indicators,
  ranked alternatives, next steps, disclaimer
- Scan history with grouping, filtering and empty states — new scans persist
  into it for the life of the session
- Disease library: search, crop filters, nine entries, detail screens
- Profile with engine status and settings surfaces
- Six Coming Soon experiences: treatment guidance, ask an agronomist, disease
  alerts, farm management, community, advanced analytics

**Deliberately simulated**

- **Inference.** `src/services/analysis.ts` runs a staged pipeline against a
  small fixture set. The first scan of a session always returns the headline
  case — Cassava, Cassava Mosaic Disease, 94.2% — then varies.
- **Scan images.** Real scans show the actual photograph. `LeafSpecimen` draws
  a vector leaf only for the four seeded demo history rows, which predate the
  camera.
- **History persistence.** The scan *list* is in memory and does not survive a
  cold start. The **photographs do** — see below.

### Scan image storage

Both VisionCamera and image-picker hand back files in `getCacheDir()`, which
Android clears whenever it wants the space. Every accepted image is therefore
copied into app-private storage at
`<app files>/harvestshield/scans/scan_<timestamp>_<seq>.<ext>` before the scan
continues, so a photograph cannot vanish from History or Result mid-session.

This is confined to `src/services/imageSource.ts`; screens only ever see the
normalised `LocalImage`. If the copy fails the scan fails visibly rather than
continuing with a temporary URI that would later render blank. Storage is
app-private, so no storage or media permission is involved and nothing is
written to the public gallery.

**Not started, by design**

Firebase, authentication, backend services, treatment content, model training,
TensorFlow Lite integration.

---

## Future integration notes

### On-device model (TensorFlow Lite)

`src/services/analysis.ts` is the single seam. `runAnalysis(image, onStage)`
already receives the real photograph as a `LocalImage`; nothing above it knows
how the result was produced. Integration is:

1. Train the classifier separately in Python/TensorFlow and export `.tflite`.
2. Bundle it under `android/app/src/main/assets/`.
3. Add a TFLite runtime binding and replace the body of `runAnalysis` — decode
   `image.uri`, resize to 224×224, normalise, invoke, soft-max, map the label
   index onto `src/data/diseases.ts` by `id`. No screen changes are needed.
4. Keep the stage callbacks so the analysing screen stays honest about progress.

Disease ids in `src/data/diseases.ts` are stable and are intended to be the
model's label space.

### Firebase

Not configured. When it is, the natural first uses are anonymous scan
telemetry for the disease-alerts feature and remote model delivery. The history
store (`src/services/historyStore.ts`) exposes a narrow read/write surface that
a persisted or synced implementation can slot behind.

---

## Disclaimer

HarvestShield AI is decision support, not a certified diagnosis. Every result
surface in the app states this. Findings should be confirmed with an extension
officer or agronomist before treatment is applied.
