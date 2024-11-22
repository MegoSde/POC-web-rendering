# Rendering Demonstration Overview

## How to Launch the Demonstration

To run the demonstration in Docker, follow these steps:

1. Ensure you have Docker and Docker Compose installed on your system.
2. Navigate to the directory containing the `docker-compose.yml` file.
3. Run the following command to build and start the services:
   ```bash
   docker-compose up --build
   ```
4. Access the demonstration at http://localhost in your browser.

## Overview
Explore various performance optimization concepts, rendering methods, and image formats implemented in this demonstration. Each concept is detailed below with instructions on how to test and compare them.

### Images

- **`/ssr?img=jpg`**: Demonstrates server-side rendering (SSR) using JPG images. Compare image quality and size.
- **`/ssr?img=png`**: SSR with PNG images, highlighting differences in size and quality compared to JPG and WebP.
- **`/ssr?img=webp`**: SSR with WebP images, showing a modern, optimized format for reduced file size and better performance.
- **`/ssr`**: Default SSR setup using the most optimized settings (WebP images with compression and caching).

---

### Rendering Methods

- **`/ssrc`**: Demonstrates server-side rendering with compression. Observe reduced network payload size compared to uncompressed.
- **`/rcsc`**: Client-side rendering (CSR) with React and compression. Observe how the initial HTML contains minimal content and loads the menu dynamically.
- **`/rcs`**: CSR without compression. Compare with `/rcsc` to see the impact of compression.
- **`/ssg`**: Static site generation (SSG) with compression. This approach pre-renders pages and caches them for 15 minutes. Compare initial load speed and performance against SSR and CSR.

---

### Lazy Loading

- **`/ssr?img=jpg&lazy=false`**: SSR with lazy loading disabled. Observe all images eagerly loaded, resulting in higher initial network load.
- **`/ssr?img=jpg`**: SSR with lazy loading enabled for mobile devices. Use Chrome’s device emulator to test.

---

### Testing and Comparison

Use the following tools to compare performance metrics:

- **Network Load**: Use Chrome DevTools (<kbd>F12</kbd>) to monitor the "Network" tab. Compare the total bytes downloaded for different endpoints.
- **Lighthouse Scores**: Use Chrome’s Lighthouse tool (<kbd>F12</kbd> > Lighthouse tab) to analyze metrics like LCP (Largest Contentful Paint), TTI (Time to Interactive), and CLS (Cumulative Layout Shift). Observe differences when using lazy loading, compression, and image optimizations.
