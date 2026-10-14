import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCart } from "../cart/CartContext";
import { formatPrice } from "../lib/money";

const schema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().regex(/^[+\d][\d\s()-]{6,}$/, "Enter a valid phone number"),
  address: z.string().trim().min(5, "Enter your address"),
  city: z.string().trim().min(2, "Enter your city"),
  state: z.string().trim().min(2, "Enter your state"),
  paymentMethod: z.enum(["card", "transfer", "cash"], { message: "Select a payment method" }),
});

type FormValues = z.infer<typeof schema>;

interface Confirmation {
  name: string;
  orderNumber: string;
  total: number;
}

export default function CheckoutModal({ onClose }: { onClose: () => void }) {
  const { totalPrice, dispatch } = useCart();
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function onSubmit(values: FormValues) {
    setConfirmation({
      name: values.fullName,
      orderNumber: "SF-" + Math.floor(100000 + Math.random() * 900000),
      total: totalPrice,
    });
    dispatch({ type: "clear" });
  }

  const field = (id: keyof FormValues, label: string, type = "text") => (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input id={id} type={type} aria-invalid={!!errors[id]} {...register(id)} />
      {errors[id] && <p className="field-error" role="alert">{errors[id]?.message}</p>}
    </div>
  );

  return (
    <div className="modal" onClick={onClose}>
      <div
        className="modal-content checkout-content"
        role="dialog"
        aria-modal="true"
        aria-label="Checkout"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-modal" onClick={onClose} aria-label="Close checkout">✕</button>
        <h2>Checkout</h2>

        {confirmation ? (
          <div className="order-success" role="status">
            <h2>🎉 Order Confirmed!</h2>
            <p style={{ marginTop: 15 }}>
              Thank you, <strong>{confirmation.name}</strong>.
            </p>
            <p>
              Your order number is: <strong>{confirmation.orderNumber}</strong>
            </p>
            <p>
              Order total: <strong>{formatPrice(confirmation.total)}</strong>
            </p>
            <p style={{ marginTop: 15 }}>This is a demo store, so no payment was taken.</p>
          </div>
        ) : (
          <>
            <p className="checkout-description">Complete your information to place your order.</p>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {field("fullName", "Full Name")}
              {field("email", "Email", "email")}
              {field("phone", "Phone", "tel")}
              {field("address", "Address")}
              <div className="form-row">
                {field("city", "City")}
                {field("state", "State")}
              </div>
              <div className="form-group">
                <label htmlFor="paymentMethod">Payment Method</label>
                <select id="paymentMethod" aria-invalid={!!errors.paymentMethod} {...register("paymentMethod")}>
                  <option value="">Select payment method</option>
                  <option value="card">Credit / Debit Card</option>
                  <option value="transfer">Bank Transfer</option>
                  <option value="cash">Cash on Delivery</option>
                </select>
                {errors.paymentMethod && <p className="field-error" role="alert">{errors.paymentMethod.message}</p>}
              </div>
              <button type="submit" className="checkout-button">Place Order</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
