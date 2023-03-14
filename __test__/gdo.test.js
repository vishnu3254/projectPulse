// import supertest module
const request = require("supertest");

// import app from server
const app = require("../server");

//
test("get all projects under his maintenance", async () => {
  let res = await request(app)
    .get("/gdo/portfolioDashboard")
    .set(
      "Authorization",
      "bearer " +
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEwMCwidXNlclJvbGUiOiJnZG9IZWFkIiwiaWF0IjoxNjc4NTMwNjM0LCJleHAiOjE2NzkzOTQ2MzR9.RzFr2tJbT5DC5wOPOhT1cCuvpMzT1icVIsooaIh2yk8"
    );

  // assertion
  expect(res.status == 200 || res.status == 204).toBeTruthy();
});
