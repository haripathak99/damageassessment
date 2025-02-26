import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {
      "@": new URL("./src/", import.meta.url).pathname,
      "@Assets": new URL("./src/assets/", import.meta.url).pathname,
      "@Utils": new URL("./src/utils/", import.meta.url).pathname,
      "@Store": new URL("./src/store/", import.meta.url).pathname,
      "@Schemas": new URL("./src/schemas/", import.meta.url).pathname,
      "@Hooks": new URL("./src/hooks/", import.meta.url).pathname,
      "@Api": new URL("./src/api/", import.meta.url).pathname,
      "@Services": new URL("./src/services/", import.meta.url).pathname,
      "@Constants": new URL("./src/constants/", import.meta.url).pathname,
      "@Queries": new URL("./src/api/queries/", import.meta.url).pathname,
      "@Routes": new URL("./src/routes/", import.meta.url).pathname,
      "@Views": new URL("./src/views/", import.meta.url).pathname,
      "@Components": new URL("./src/components/", import.meta.url).pathname,
      "@UserModule": new URL(
        "./src/modules/user-auth-module/src/",
        import.meta.url
      ).pathname,
    },
  },
});
