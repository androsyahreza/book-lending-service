const {
  FailedResponse,
  SuccessResponse,
} = require("../src/app/helpers/api.response");
const { memberValidator } = require("../src/app/validator/validator");
const {
  addMember,
  viewMember,
} = require("../src/app/controllers/member.controller");
const MemberService = require("../src/app/services/member.service");

jest.mock("../src/app/helpers/api.response", () => ({
  FailedResponse: jest.fn(),
  SuccessResponse: jest.fn(),
}));

jest.mock("../src/app/validator/validator", () => ({
  memberValidator: {
    validate: jest.fn(),
  },
}));
jest.mock("../src/app/services/member.service", () => ({
  AddMember: jest.fn(),
  ViewMember: jest.fn(),
}));

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

describe("Add Member endpoint", () => {
  const req = {
    body: {
      name: "name",
    },
  };
  it("Should return 400 if member validation fails", async () => {
    memberValidator.validate = jest.fn().mockReturnValue({
      error: {
        details: "Validation error",
      },
    });
    await addMember(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      FailedResponse(400, "Validation error")
    );
  });
  it("Should return 200 if member successfully added", async () => {
    memberValidator.validate = jest.fn().mockReturnValue({ error: null });
    MemberService.AddMember.mockResolvedValue({
      status: 200,
      message: "Member successfully added",
      data: "data",
    });
    await addMember(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      SuccessResponse(200, "Member successfully added", "data")
    );
  });
  it("Should return 500 if an error occurs", async () => {
    MemberService.AddMember = jest.fn().mockRejectedValue({
      status: 500,
      message: "Error",
    });
    await addMember(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(FailedResponse(500, "Error"));
  });
});

describe("View Member endpoint", () => {
  const req = {
    body: {
      name: "name",
    },
  };
  it("Should return 200 if member successfully viewed", async () => {
    MemberService.ViewMember.mockResolvedValue({
      status: 200,
      message: null,
      data: "data",
    });
    await viewMember(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(SuccessResponse(200, null, "data"));
  });
  it("Should return 500 if an error occurs", async () => {
    MemberService.ViewMember = jest.fn().mockRejectedValue({
      status: 500,
      message: "Error",
    });
    await viewMember(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(FailedResponse(500, "Error"));
  });
});
