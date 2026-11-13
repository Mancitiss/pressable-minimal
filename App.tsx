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
