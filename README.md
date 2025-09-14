# Palawan Integrated Tourism Ecosystem

This project is a comprehensive business plan and investor portal for the Palawan Integrated Tourism, Investment & Infrastructure Ecosystem.

## Project Structure

This project follows a standard front-end application structure to ensure maintainability and scalability.

-   `/public`: Contains static assets like logos, images, `robots.txt`, and `manifest.json`. These files are served directly by the web server.
-   `/src`: Contains all application source code.
    -   `/assets`: Optimized images, SVGs, fonts, and other static assets that are part of the source.
    -   `/components`: Reusable, "pure" UI components that are used across the application.
    -   `/layouts`: Components responsible for the overall page structure, such as headers, footers, and sidebars.
    -   `/lib`: Helper functions, utilities, and data-fetching logic.
    -   `/pages`: Top-level components that represent a page or a major view in the application.
    -   `/styles`: Global stylesheets, CSS variables, or design tokens.
    -   `/types`: Global TypeScript type definitions.
-   `index.html`: The main HTML entry point for the application.
-   `package.json`: Defines project metadata, dependencies, and scripts.
-   `tsconfig.json`: TypeScript compiler configuration.

## Running the Application

This is a static front-end application designed to run without a complex build step. To run it, serve the root directory using a simple local web server.

```bash
# Using Python's built-in server
python3 -m http.server

# Or using Node.js with the 'serve' package
npm install -g serve
serve .
```

Navigate to the provided local URL (e.g., `http://localhost:8000`) in your browser.
