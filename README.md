# Notebook LLM - 3D Animated PDF Summarizer

A beautiful React frontend application that transforms PDFs into interactive conversations using AI-powered summaries and intelligent Q&A features. Built with React Three Fiber for stunning 3D effects and Framer Motion for smooth animations.

## ✨ Features

- **Beautiful 3D Interface**: Interactive 3D blob animations with mouse tracking
- **Glass Morphism Design**: Modern glass-card UI with backdrop blur effects
- **PDF Upload & Analysis**: Drag & drop PDF files for AI-powered summarization
- **Interactive Q&A**: Ask questions about your documents and get intelligent answers
- **Three Theme Modes**: Light, Dark, and Experimental themes with localStorage persistence
- **Responsive Design**: Mobile-first design that adapts to all screen sizes
- **Accessibility**: Keyboard navigation, ARIA labels, and respects `prefers-reduced-motion`
- **Performance Optimized**: Pauses heavy animations on mobile and when tab is hidden

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm

### Installation & Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app will be available at `http://localhost:8080`

## 🎨 Customizing Themes

### Design System Tokens
All visual styling is controlled through CSS custom properties in `src/index.css`:

```css
:root {
  /* Brand Colors (HSL only) */
  --gradient-primary: linear-gradient(135deg, hsl(264 100% 60%), hsl(285 85% 60%), hsl(345 100% 68%), hsl(25 100% 60%));
  --glass-bg: hsl(0 0% 100% / 0.1);
  --blob-primary: hsl(264 100% 60%);
  /* ... */
}
```

### Theme Modes
- **Light**: Clean pastels with soft shadows
- **Dark**: Deep navy (#0B0D17) with vibrant gradients  
- **Experimental**: Neon outlines and condensed layout

## 🎮 3D Elements

### React Three Fiber Setup
The app uses `@react-three/fiber` and `@react-three/drei` for 3D effects:

- **Primary Element**: Animated blob with gradient material
- **Mouse Interaction**: Subtle rotation follows cursor movement
- **Fallback**: CSS 3D layered cards when `prefers-reduced-motion` is enabled
- **Performance**: Low-poly geometry with optimized materials

### Customizing 3D Assets
To replace the procedural blob with a custom model:

1. Place `.glb` file in `public/models/`
2. Update `src/components/Floating3D.tsx`:
```tsx
import { useGLTF } from '@react-three/drei';
// Replace <Sphere> with <primitive object={gltf.scene} />
```

## 📱 Mock API

The app includes a fully functional client-side mock API (`src/mockApi.ts`):

### API Contract
```typescript
// Parse PDF file
mockApi.parse(file: File) → Promise<{
  id: string;
  fileName: string; 
  pages: number;
  summary: string;
}>

// Ask question about document
mockApi.ask(question: string, documentId: string) → Promise<{
  question: string;
  answer: string;
  sourceSnippet: string;
}>
```

### Extending the Mock API
To add real backend integration, replace the mock implementations in `mockApi.ts` with actual API calls to your backend service.

## 🎯 Performance Considerations

- **3D Rendering**: Automatically pauses when `document.hidden` is true
- **Reduced Motion**: Respects user preference and shows CSS fallbacks
- **Mobile Optimization**: Simplified animations on smaller screens
- **Lazy Loading**: Components are code-split for optimal loading

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **3D Graphics**: React Three Fiber + Three.js + @react-three/drei
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS + CSS Custom Properties
- **UI Components**: Shadcn/ui components
- **File Handling**: react-dropzone

## 📦 Project Structure

```
src/
├── components/
│   ├── Floating3D.tsx      # 3D blob component
│   ├── Navbar.tsx          # Navigation with theme toggle
│   ├── ThemeProvider.tsx   # Theme management & persistence
│   ├── UploadPanel.tsx     # PDF drag & drop interface
│   ├── SummaryPanel.tsx    # AI summary display
│   └── QuestionPanel.tsx   # Q&A interface
├── mockApi.ts              # Client-side API simulation
├── index.css               # Design system tokens
└── pages/Index.tsx         # Main application page
```

## 🎨 Design Philosophy

This application follows a **design-first approach** where all styling is centralized in the design system (`index.css` and `tailwind.config.ts`). Components never use ad-hoc styling - everything uses semantic tokens for consistency and maintainability.

## 🐛 Troubleshooting

### 3D Elements Not Appearing
- Check browser WebGL support
- Ensure graphics drivers are updated
- Fallback CSS elements will show for unsupported browsers

### Performance Issues
- Disable 3D effects in browser dev tools: `prefers-reduced-motion: reduce`
- Check console for WebGL context warnings

### Theme Not Persisting
- Ensure localStorage is enabled in browser
- Check browser dev tools → Application → Local Storage

## 📄 License

This project is for demonstration purposes. Customize freely for your own projects.

---

**Built with ❤️ using React, Three.js, and modern web technologies**