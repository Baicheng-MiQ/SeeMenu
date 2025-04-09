import { MaterialIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
export default function RootLayout() {
  return <Stack>
    <Stack.Screen name="index" options={{ headerShown: false }} />
    <Stack.Screen name="result" options={{ title: 'Menu', headerLeft: () => <MaterialIcons name="arrow-back" size={24} color="black" /> }} />
  </Stack>
}
