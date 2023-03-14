// import app
const app = require("../server");

const request = require("supertest");

// TESTS FOR PROJECTMANAGER-API

// test for adding project updates by project manager
test("project updates should be added to database", async () => {
  // act
  let res = await request(app)
    .post("/projectManager-api/projectManager/projectUpdates/20")
    .send({
      projectId: 20,
      projectManager: 101,
      date: "2023/03/10",
      projectStatusUpdate: "New feature updated",
      scheduleStatus: "Red",
      resourcingStatus: "Green",
      qualityStatus: "Green",
      waitingForClient: "no",
    })
    .set(
      "Authorization",
      "bearer " +
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwMSwidXNlclJvbGUiOiJwcm9qZWN0TWFuYWdlciIsImlhdCI6MTY3ODUzMDY3NCwiZXhwIjoxNjc5Mzk0Njc0fQ.JTB8v0AZ7QytnIMc3y1QNdm-g5ZgSs5A5QDL4v1pgBg"
    );

  // assertions
  expect(res.status).toBe(201);
});

// test for get projects for projectManager
test("all the projects associated with projectManager should be read", async () => {
  // act
  let res = await request(app)
    .delete("/projectManager-api/projectManager/projectUpdates/3")
    .set(
      "Authorization",
      "bearer " +
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwMSwidXNlclJvbGUiOiJwcm9qZWN0TWFuYWdlciIsImlhdCI6MTY3ODUzMDY3NCwiZXhwIjoxNjc5Mzk0Njc0fQ.JTB8v0AZ7QytnIMc3y1QNdm-g5ZgSs5A5QDL4v1pgBg"
    );

  // assertion
  expect(res.status).toBe()
});
