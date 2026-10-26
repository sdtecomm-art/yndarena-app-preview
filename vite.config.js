import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the build also works from a sub-path or as a static preview.
export default defineConfig({ base: './', plugins: [react()] });
