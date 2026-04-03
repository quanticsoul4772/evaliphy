import { defineConfig } from "../dist/index.cjs";

export default defineConfig({
  http:{
    baseUrl: "https://localhost:8080",
    headers: {
      "X-API-Key": "my-secret-test-key"
    }
  },
  timeout: 60000,
  evalDir: './evals'
})
