import 'expo-router/entry';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      {/* expo-router will render the app here */}
      {null}
    </AuthProvider>
  );
}

