import { Hono } from "hono";
import type { AppBindings } from "./types/context.js";
import { requestId } from "./middleware/request-id.js";
import { strictCors } from "./middleware/cors.js";
import { secureHeaders } from "./middleware/security.js";
import { bodySizeLimit } from "./middleware/body-size-limit.js";
import { rateLimit } from "./middleware/rate-limit.js";
import { errorHandler } from "./middleware/error-handler.js";
import { healthRoutes } from "./routes/health.js";
import { productRoutes } from "./routes/products.js";
import { accountRoutes } from "./routes/account.js";
import { cartRoutes } from "./routes/cart.js";
import { contentRoutes } from "./routes/content.js";
import { newsletterRoutes } from "./routes/newsletter.js";
import { discountRoutes } from "./routes/discounts.js";
import { communityRoutes } from "./routes/community.js";
import { orderRoutes } from "./routes/orders.js";

export function createApp() {
  const app = new Hono<AppBindings>();
  app.onError(errorHandler);
  app.use("*", requestId);
  app.use("*", strictCors);
  app.use("*", secureHeaders);
  app.use("*", bodySizeLimit());
  app.use("*", rateLimit());
  app.route("/v1", healthRoutes);
  app.route("/v1", productRoutes);
  app.route("/v1", accountRoutes);
  app.route("/v1", cartRoutes);
  app.route("/v1", contentRoutes);
  app.route("/v1", newsletterRoutes);
  app.route("/v1", discountRoutes);
  app.route("/v1", communityRoutes);
  app.route("/v1", orderRoutes);
  return app;
}

export const app = createApp();
