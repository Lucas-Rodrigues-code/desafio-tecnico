export function validateBodyMiddleware(schema) {
    return function (req, res, next) {
      console.log("hi")
    const { error } = schema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).send(errors);
    }
    next();
  };
}
