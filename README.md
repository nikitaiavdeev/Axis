# Axis: Cross-Section Analysis Tool

Axis is a standalone static Svelte application designed to create, manipulate, and analyze cross-sections. The app provides detailed calculations for area, centroid, and moments of inertia. It also supports importing surfaces from .IGES and .STEP file formats for enhanced flexibility.

## Features

- **Cross-Section Creation:** Easily design custom cross-sections using an intuitive interface.
- **Cross-Section Manipulation:** Modify existing designs with simple tools for precise adjustments.
- **Analysis Tools:** Automatically calculate:
  - Area
  - Centroid
  - Moments of inertia (Ix, Iy, and Ixy)
- **File Import Support:** Load surfaces from:
  - `.IGES` files
  - `.STEP` files
- **Visualization:** Interactive visual representation of cross-sections using D3.js.

## Technology Stack

- **Framework:** Svelte
- **Visualization:** D3.js
- **Package Management:** pnpm

## Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js
- svelte v5
- pnpm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/nikitaiavdeev/Axis
   cd axis
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

### Running the App

To start a development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:5173` by default.

### Building for Production

To create a production build:

```bash
pnpm build
```

The build artifacts will be available in the `dist` directory.

### Previewing Production Build

To preview the production build locally:

```bash
pnpm preview
```

## Usage

1. Open the application in your browser.
2. Use the tools provided to design or manipulate cross-sections.
3. Import `.IGES` or `.STEP` files for advanced analysis.
4. View real-time calculations for area, centroid, and moments of inertia.
5. Export or save your designs for future use.

## File Import Support

Axis supports `.IGES` and `.STEP` file formats for surface imports. Ensure your files are correctly formatted to avoid import issues.

## License

Axis is licensed under the [GNU General Public License v3.0](LICENSE).

## Acknowledgments

- **Svelte:** For providing a lightweight and efficient framework.
- **D3.js:** For enabling dynamic and interactive visualizations.

---

Feel free to reach out if you have any questions or need support using Axis!

