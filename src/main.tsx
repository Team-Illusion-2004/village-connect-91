
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Directly render the App component without StrictMode for fewer rendering cycles
createRoot(document.getElementById("root")!).render(<App />);
