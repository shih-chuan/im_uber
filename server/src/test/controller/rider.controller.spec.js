const { faker } = require("@faker-js/faker");
const { expect } = require("chai");
const sinon = require("sinon");

const riderController = require("../../controller/rider.controller");
const riderService = require("../../services/rider.service");
const response = require("../../utils/response");

describe("Rider controller", () => {
  describe("searchRider", () => {
    let res, json, status;

    beforeEach(() => {
      status = sinon.stub();
      json = sinon.spy();
      res = {
        json,
        status,
      };
      status.returns(res);
    });

    it("should search riders that matches provided lat and long", async function () {
      const req = {
        query: { lat: faker.address.latitude, long: faker.address.longitude },
      };

      const riderStubValue = [
        {
          _id: faker.database.mongodbObjectId(),
          name: faker.name.fullName(),
          profilePic: faker.image.avatar(),
          role: "rider",
          vehicle: {
            color: faker.vehicle.color(),
            model: faker.vehicle.vehicle(),
            number: faker.vehicle.vrm(),
          },
        },
      ];

      const stubValue = {
        type: "Success",
        statusCode: 200,
        message: "Riders found!!",
        riders: riderStubValue,
      };

      const mockedService = sinon.mock(riderService);
      mockedService
        .expects("getRiders")
        .once()
        .callsFake(() => Promise.resolve(stubValue));

      const mockedResponse = sinon.mock(response);
      mockedResponse
        .expects("successResponse")
        .once()
        .callsFake(() => Promise.resolve(stubValue));

      const data = await riderController.searchRider(req, res);

      expect(data).to.not.null;
      expect(data).to.have.property("type");
      expect(data).to.have.property("statusCode");

      expect(data).to.have.property("message");
      expect(data).to.have.property("riders");

      expect(data.type).to.equal("Success");
      expect(data.statusCode).to.equal(200);

      mockedService.verify();
      mockedService.restore();

      mockedResponse.verify();
      mockedResponse.restore();
    });
  });
});
