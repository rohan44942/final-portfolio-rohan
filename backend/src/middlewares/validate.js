const validateBody = (schema) => (req, _res, next) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    const err = new Error(first?.message || "Invalid request body.");
    err.statusCode = 400;
    return next(err);
  }

  req.body = parsed.data;
  return next();
};

module.exports = validateBody;
