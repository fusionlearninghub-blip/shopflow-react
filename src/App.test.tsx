import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { CartProvider } from "./cart/CartContext";
import { PRODUCTS } from "./test/fixtures";

function renderApp() {
  return render(
    <CartProvider>
      <App />
    </CartProvider>,
  );
}

function mockFetchOk() {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({ ok: true, json: async () => ({ products: PRODUCTS }) }),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("ShopFlow app", () => {
  it("shows products after loading", async () => {
    mockFetchOk();
    renderApp();
    expect(screen.getByText(/loading products/i)).toBeInTheDocument();
    expect(await screen.findByRole("button", { name: "Apple Watch" })).toBeInTheDocument();
    expect(screen.getAllByRole("article")).toHaveLength(3);
  });

  it("shows an error with a retry button when the request fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 500 }));
    renderApp();
    expect(await screen.findByRole("alert")).toHaveTextContent(/unable to load products/i);

    mockFetchOk();
    await userEvent.click(screen.getByRole("button", { name: /try again/i }));
    expect(await screen.findByRole("button", { name: "Apple Watch" })).toBeInTheDocument();
  });

  it("filters products as the user types and shows an empty state", async () => {
    mockFetchOk();
    renderApp();
    await screen.findByRole("button", { name: "Apple Watch" });

    await userEvent.type(screen.getByPlaceholderText(/search products/i), "jeans");
    expect(screen.getAllByRole("article")).toHaveLength(1);

    await userEvent.clear(screen.getByPlaceholderText(/search products/i));
    await userEvent.type(screen.getByPlaceholderText(/search products/i), "zzz");
    expect(screen.getByText(/no products found/i)).toBeInTheDocument();
  });

  it("adds to the cart, updates the count and total, and removes the item", async () => {
    mockFetchOk();
    renderApp();
    await screen.findByRole("button", { name: "Apple Watch" });

    await userEvent.click(screen.getByRole("button", { name: "Add Apple Watch to cart" }));
    await userEvent.click(screen.getByRole("button", { name: "Add Apple Watch to cart" }));
    expect(screen.getByRole("button", { name: /open cart, 2 items/i })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /open cart/i }));
    const cart = screen.getByRole("complementary", { name: "Shopping cart" });
    expect(within(cart).getByTestId("cart-total")).toHaveTextContent("$398.00");

    await userEvent.click(within(cart).getByRole("button", { name: "Remove Apple Watch" }));
    expect(within(cart).getByText(/your cart is empty/i)).toBeInTheDocument();
    expect(within(cart).getByTestId("cart-total")).toHaveTextContent("$0.00");
  });

  it("keeps the cart after a reload (restores from localStorage)", async () => {
    mockFetchOk();
    const first = renderApp();
    await screen.findByRole("button", { name: "Apple Watch" });
    await userEvent.click(screen.getByRole("button", { name: "Add Blue Jeans to cart" }));
    first.unmount();

    renderApp();
    expect(await screen.findByRole("button", { name: /open cart, 1 items/i })).toBeInTheDocument();
  });

  it("opens the product details modal and closes it with Escape", async () => {
    mockFetchOk();
    renderApp();
    await userEvent.click(await screen.findByRole("button", { name: "Apple Watch" }));
    expect(screen.getByRole("dialog", { name: "Apple Watch" })).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("validates checkout fields, then confirms the order and clears the cart", async () => {
    mockFetchOk();
    renderApp();
    await screen.findByRole("button", { name: "Apple Watch" });
    await userEvent.click(screen.getByRole("button", { name: "Add Apple Watch to cart" }));
    await userEvent.click(screen.getByRole("button", { name: /open cart/i }));
    await userEvent.click(screen.getByRole("button", { name: "Checkout" }));

    const dialog = screen.getByRole("dialog", { name: "Checkout" });
    await userEvent.click(within(dialog).getByRole("button", { name: /place order/i }));
    expect(await within(dialog).findAllByRole("alert")).not.toHaveLength(0);

    await userEvent.type(within(dialog).getByLabelText("Full Name"), "Ada Obi");
    await userEvent.type(within(dialog).getByLabelText("Email"), "ada@example.com");
    await userEvent.type(within(dialog).getByLabelText("Phone"), "+2348012345678");
    await userEvent.type(within(dialog).getByLabelText("Address"), "12 Marina Road");
    await userEvent.type(within(dialog).getByLabelText("City"), "Lagos");
    await userEvent.type(within(dialog).getByLabelText("State"), "Lagos");
    await userEvent.selectOptions(within(dialog).getByLabelText("Payment Method"), "transfer");
    await userEvent.click(within(dialog).getByRole("button", { name: /place order/i }));

    expect(await within(dialog).findByText(/order confirmed/i)).toBeInTheDocument();
    expect(within(dialog).getByText("$199.00")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /open cart, 0 items/i })).toBeInTheDocument();
  });
});
