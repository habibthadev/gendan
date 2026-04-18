const { register } = require("tsconfig-paths")
const { resolve } = require("path")

require("dotenv/config")

register({
  baseUrl: resolve(__dirname),
  paths: { "@/*": ["dist/*"] },
})
