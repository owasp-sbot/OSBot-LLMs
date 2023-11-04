class Calculator {
  add(a, b) {
    return a + b;
  }
}


describe("addition", () => {
  it("adds two numbers together", () => {
    console.log(new Calculator().add)
    var sum = new Calculator().add(1, 2);
    expect(sum).toBe(3);
  });

  it("adds two numbers together...", () => {
    console.log(new Calculator().add)
    var sum = new Calculator().add(1, 2);
    expect(sum).toBe(3);
  });
});

it("adds two numbers together", () => {
    console.log(new Calculator().add)
    var sum = new Calculator().add(1, 2);
    expect(sum).toBe(3);
  });
