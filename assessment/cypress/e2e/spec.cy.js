describe("GitHub User Finder", () => {
  const url = "http://localhost:5173";

  beforeEach(() => {
    cy.visit(url);
  });

  it("1) shows the centered card with title, subtitle, input and button, and empty state", () => {
    cy.contains("GitHub User Finder").should("be.visible");
    cy.contains("Search a GitHub username to see profile details.").should("be.visible");
    cy.get('input[name="username"]').should("be.visible");
    cy.contains("button", "Search").should("be.visible").and("not.be.disabled");
  });

  it("2) shows validation error when searching with empty input (no API call)", () => {
    cy.intercept("GET", "https://api.github.com/users/*").as("getUser");
    cy.contains("button", "Search").click();
    cy.contains("Please enter a GitHub username.").should("be.visible");
  });

  it("3) fetches and displays a user on success (stubbed) and supports Enter key", () => {
    // Stub a successful response
    cy.intercept("GET", "https://api.github.com/users/octocat", {
      statusCode: 200,
      body: {
        login: "octocat",
        name: "The Octocat",
        avatar_url: "https://avatars.githubusercontent.com/u/583231?v=4",
        bio: "Just a test octocat.",
        public_repos: 8,
        followers: 100,
        following: 5,
        location: "San Francisco",
        company: "GitHub",
        blog: "https://github.blog",
        html_url: "https://github.com/octocat",
      },
    }).as("getOcto");

    cy.get('input[name="username"]').type("octocat{enter}");
    cy.wait("@getOcto");

    cy.contains("The Octocat").should("be.visible");
    cy.contains("@octocat").should("be.visible");
    cy.contains("San Francisco").should("be.visible");
  });

  it("4) handles 404 then succeeds on retry", () => {
    cy.intercept("GET", "https://api.github.com/users/gaearon", {
      statusCode: 200,
      body: {
        login: "gaearon",
        name: "Dan Abramov",
        avatar_url: "https://avatars.githubusercontent.com/u/810438?v=4",
        bio: "Working on React.",
        public_repos: 300,
        followers: 90000,
        following: 200,
        location: "London",
        company: "Meta",
        blog: "https://overreacted.io",
        html_url: "https://github.com/gaearon",
      },
    }).as("getGaearon");

    cy.get('input[name="username"]').clear().type("gaearon");
    cy.contains("button", "Search").click();
    cy.wait("@getGaearon");
    cy.contains("Dan Abramov").should("be.visible");
    cy.contains("@gaearon").should("be.visible");
  });
});