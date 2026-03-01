import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/Monthly-billing-generator/", // ← 改成你的 repo 名稱（大小寫要一致）
  plugins: [react()],
});
