import ApiError from "../utils/ApiError.js";

const validate = (schema) => (req, res, next) => {
  try {
    const parsed = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    
    // Assign validated/transformed data back to request
    if (parsed.body) req.body = parsed.body;
    if (parsed.query) req.query = parsed.query;
    if (parsed.params) req.params = parsed.params;
    
    return next();
  } catch (error) {
    const errorMessage = error.issues
      ? error.issues
          .map((issue) => {
            // Remove leading "body" / "query" / "params" segment for clean error messages
            const pathParts = issue.path.slice(0);
            if (
              pathParts.length > 1 &&
              ["body", "query", "params"].includes(String(pathParts[0]))
            ) {
              pathParts.shift();
            }
            return `${pathParts.join(".")}: ${issue.message}`;
          })
          .join(", ")
      : error.message;
    return next(new ApiError(400, errorMessage));
  }
};

export default validate;
