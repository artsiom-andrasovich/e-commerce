import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { CategoryList } from "../CategoryList";
import { fetchCategories } from "../categories.actions";

jest.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

jest.mock("../categories.actions", () => ({
  fetchCategories: jest.fn(),
}));

jest.mock("@/i18n", () => ({
  Link: ({ children, href }: any) => <a href={href}>{children}</a>,
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => "/some-path",
}));

jest.mock("next/navigation", () => ({
  usePathname: () => "/category/cat-1",
}));

const mockCategories = [
  { id: "1", name: "Electronics" },
  { id: "2", name: "Books" },
];

describe("CategoryList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders initial categories", () => {
    render(
      <CategoryList initialCategories={mockCategories} initialPage={null} />,
    );
    expect(screen.getByText("Electronics")).toBeInTheDocument();
    expect(screen.getByText("Books")).toBeInTheDocument();
    expect(screen.queryByText("seeMore")).not.toBeInTheDocument();
  });

  it("renders 'See more' button when initialPage is present", () => {
    render(<CategoryList initialCategories={mockCategories} initialPage={2} />);
    expect(screen.getByText("seeMore")).toBeInTheDocument();
  });

  it("fetches next page and appends categories when 'See more' is clicked", async () => {
    const mockFetch = fetchCategories as jest.Mock;
    mockFetch.mockResolvedValue({
      data: [{ id: "3", name: "Toys" }],
      nextPage: null,
    });

    render(<CategoryList initialCategories={mockCategories} initialPage={2} />);

    const button = screen.getByText("seeMore");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Toys")).toBeInTheDocument();
    });

    expect(screen.queryByText("seeMore")).not.toBeInTheDocument();
  });
});
