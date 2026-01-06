import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders app brand", () => {
  render(<App />);
  // Navbar brand should always render
  expect(screen.getByText(/QuizMaster/i)).toBeInTheDocument();
});
