const { FailedResponse, SuccessResponse } = require("../helpers/api.response");
const MemberService = require("../services/member.service");
const status = require("http-status");
const { memberValidator } = require("../validator/validator");

const addMember = async (req, res) => {
  try {
    const memberValidate = memberValidator.validate(req.body);
    const memberValidateError = memberValidate.error;
    if (memberValidateError) {
      res
      .status(status.BAD_REQUEST)
      .send(FailedResponse(status.BAD_REQUEST, memberValidateError.details));
    } else {
      const name = req.body.name;
      const data = { name: name };
      const member = await MemberService.AddMember(data);
      res
        .status(status.OK)
        .json(SuccessResponse(status.OK, "Member Successfully Added", member));
    }
  } catch (error) {
    console.log(error)
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json(FailedResponse(status.INTERNAL_SERVER_ERROR, error));
  }
};

const viewMember = async (req, res) => {
  try {
    const member = await MemberService.ViewMember();
    res.status(status.OK).json(SuccessResponse(status.OK, null, member));
  } catch (error) {
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json(FailedResponse(status.INTERNAL_SERVER_ERROR, error));
  }
};

module.exports = {
  addMember,
  viewMember
};
