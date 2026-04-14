import { render } from "@testing-library/react";
import App from "../../app/App";

test("renders app without crashing", () => {
  const { container } = render(<App />);
  expect(container).toBeTruthy();
});
