# Minimal Pressable reproduction (Expo SDK 58)

One full-screen `Pressable` imported directly from `react-native`, one counter, and no helper
components. Expo handles the normal `react-native` web alias. Only `App.tsx` and
`index.ts` need to be edited after generating the blank TypeScript template.

## 1. Create the project and add web support

From the parent folder, with Node.js and npm installed:

```powershell
npx create-expo-app@latest pressable-minimal --template blank-typescript@sdk-58 --no-agents-md --yes
cd pressable-minimal
npx expo install react-dom react-native-web @expo/metro-runtime @expo/log-box
npm uninstall expo-status-bar
```

The last command removes the unused status-bar package from the template. It is
optional for the page to work. `--no-agents-md` skips agent configuration files.
Keep `sdk-58` explicit so the starter does not select a different SDK.

## 2. Replace App.tsx

```tsx
import { useState } from 'react';
import { Pressable, Text } from 'react-native';

export default function App() {
  const [presses, setPresses] = useState(0);

  return (
    <Pressable
      style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      onPress={() => setPresses((count) => count + 1)}>
      <Text>Presses: {presses}</Text>
    </Pressable>
  );
}
```

The Pressable fills the screen and centers the counter. Click or tap anywhere on
the screen to increment it.

## 3. Replace index.ts to enable web LogBox

```ts
import { registerRootComponent } from 'expo';
import App from './App';

if (process.env.NODE_ENV !== 'production' && process.env.EXPO_OS === 'web') {
  require('@expo/log-box/lib').setupLogBox();
}

registerRootComponent(App);
```

Keep `"main": "index.ts"` in `package.json` (the template already sets it).
The LogBox setup call must run before `registerRootComponent(App)`. Installing
`@expo/metro-runtime` alone does not initialize the web error UI in this SDK 58
blank entry. This uses the same setup API as Expo Router's SDK 58 entry.

The setup is development-only and web-only. Native Expo Go/development builds
provide their native error UI; this web setup does not configure native LogBox.

## 4. Run in development

```powershell
npm run web
```

If a port is already occupied, choose another:

```powershell
npm run web -- --port 8086
```

After changing the entry file, fully reload the page. Production exports do not
show the development LogBox.

For native devices, run `npm start` and connect using a client compatible with
SDK 58 on the same network. `npm run android` opens an available Android
emulator/device; `npm run ios` requires macOS for the simulator.

## Reproduce the multi-touch error

Reported environment: iPhone XS, iOS 16.7.2, Firefox 160.0.

1. From the repository root, install dependencies and start the web app:

   ```sh
   npm ci
   npx expo start --web --lan
   ```

2. Connect the iPhone to the same network as the computer and open the computer's
   LAN URL in Firefox (for example, `http://<computer-LAN-IP>:8081`, using the port
   shown by Expo).
3. Touch and release the full-screen Pressable with two or more fingers.
4. Observe `Cannot find single active touch` in LogBox.

Expected: multi-touch is handled or cancelled without errors.

So far, this error has only been observed in Firefox on iOS. The page uses the
default Pressable with a counter; no deliberate error is thrown by the app.

## Verify the project

```powershell
npx tsc --noEmit
npx expo install --check
npx expo export --platform all
```

## Sources

- [Expo templates](https://docs.expo.dev/more/create-expo/)
- [Expo web dependencies and development server](https://docs.expo.dev/workflow/web/)
- [Expo errors and warnings](https://docs.expo.dev/debugging/errors-and-warnings/)
- [SDK 58 Expo Router LogBox initialization](https://github.com/expo/expo/blob/sdk-58/packages/expo-router/src/renderRootComponent.tsx#L49-L60)
