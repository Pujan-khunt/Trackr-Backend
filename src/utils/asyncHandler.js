const asyncHandler = (requestHandler) => {
  return async function(req, res, next) {
    try {
      await requestHandler(req, res);
    } catch (error) {
      next(error);
    }
  };
};

export default asyncHandler;
