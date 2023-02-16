const SuccessResponse = (httpStatus, message, data = null) => {
  return {
    status: httpStatus,
    message: message,
    data,
  };
};

const FailedResponse = (httpStatus, message) => {
  return {
    status: httpStatus,
    message,
    data: null,
  };
};

module.exports = {
  SuccessResponse,
  FailedResponse
}