const errorHandler = (err, req, res, next) => {
  if (typeof err === "string") {
    return res.status(400).json({ message: err });
  }

  if (err.name === "UnautherizedError") {
    return res.status(401).json({ message: "Invalid token" });
  }

  return res.status(500).json({ message: err.message });
};

module.exports = errorHandler;
