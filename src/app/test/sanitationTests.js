const sanitationUtils = require("./../src/utils/sanitationUtils");
const assert = require("assert");

describe("sanitation tests", function () {
  it("#containsAtleastAllProperties returns true when all properties are present", () => {
    assert(
      sanitationUtils.containsAtleastAllProperties(
        { username: "JohnDoe", email: "johndoe@mail.com" },
        ["username", "email"]
      )
    );
    assert(
      sanitationUtils.containsAtleastAllProperties(
        { username: "JohnDoe", email: "johndoe@mail.com" },
        ["username"]
      )
    );
    assert(
      sanitationUtils.containsAtleastAllProperties(
        { username: "JohnDoe", email: "johndoe@mail.com" },
        ["email"]
      )
    );
  });
  it("#containsAtleastAllProperties returns false when not all properties are present", () => {
    assert(
      sanitationUtils.containsAtleastAllProperties(
        { username: "JohnDoe", email: "johndoe@mail.com" },
        ["username", "dateOfBirth"]
      ) === false
    );
    assert(
      sanitationUtils.containsAtleastAllProperties(
        { username: "JohnDoe", email: "johndoe@mail.com" },
        ["email", "lastMessageSent"]
      ) === false
    );
  });

  it("#containsAnyProperties returns true when any property is present", () => {
    assert(
      sanitationUtils.containsAnyProperties(
        { username: "JohnDoe", email: "johndoe@mail.com" },
        ["username", "email"]
      )
    );
    assert(
      sanitationUtils.containsAnyProperties(
        { username: "JohnDoe", email: "johndoe@mail.com" },
        ["username"]
      )
    );
    assert(
      sanitationUtils.containsAnyProperties(
        { username: "JohnDoe", email: "johndoe@mail.com" },
        ["email", "age"]
      )
    );
  });
  it("#containsAnyProperties returns false when any property isn't present", () => {
    assert(
      sanitationUtils.containsAnyProperties(
        { username: "JohnDoe", email: "johndoe@mail.com" },
        []
      ) === false
    );
    assert(
      sanitationUtils.containsAnyProperties(
        { username: "JohnDoe", email: "johndoe@mail.com" },
        ["age", "strength"]
      ) === false
    );
    assert(
      sanitationUtils.containsAnyProperties(
        { username: "JohnDoe", email: "johndoe@mail.com" },
        ["dexterity", "intelligence"]
      ) === false
    );
  });

  it("#containsAnyOtherProperties returns true when any other property is present", () => {
    assert(
      sanitationUtils.containsAnyOtherProperties(
        { username: "JohnDoe", email: "johndoe@mail.com", name: "francis" },
        ["username", "email"]
      )
    );
    assert(
      sanitationUtils.containsAnyOtherProperties(
        {
          username: "JohnDoe",
          email: "johndoe@mail.com",
          joinDate: new Date(),
        },
        ["username"]
      )
    );
    assert(
      sanitationUtils.containsAnyOtherProperties(
        { username: "JohnDoe", email: "johndoe@mail.com", age: 56 },
        ["email"]
      )
    );
  });
  it("#containsAnyOtherProperties returns false when any other property isn't present", () => {
    assert(
      sanitationUtils.containsAnyOtherProperties(
        { username: "JohnDoe", email: "johndoe@mail.com" },
        ["username", "email"]
      ) === false
    );
  });
});
