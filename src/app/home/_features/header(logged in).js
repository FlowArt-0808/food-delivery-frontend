"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import NomNomLogoRed from "@/app/_components/icons/NomNomLogoRed";
import HumanIcon from "@/app/_components/icons/HumanIcon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SaladImage from "@/app/_components/images/Salad-3.png";

const ORDER_PLACED_ILLUSTRATION_SRC = "/order-success-illustration.png";

const TrayFoodIcon = ({ className = "h-14 w-14", stroke = "#EF4444" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" className={className}>
    <path d="M14 33.5H50" stroke={stroke} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M22 33.5C22 25.216 28.716 18.5 37 18.5C45.284 18.5 52 25.216 52 33.5H22Z"
      stroke={stroke}
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M14 33.5L18 44L45 37.2" stroke={stroke} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M37 15V18.5" stroke={stroke} strokeWidth="3.2" strokeLinecap="round" />
  </svg>
);

const BowlIcon = ({ className = "h-7 w-7", stroke = "#A1A1AA" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4.5 11H19.5" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
    <path
      d="M6.5 11C6.5 14.038 8.962 16.5 12 16.5C15.038 16.5 17.5 14.038 17.5 11"
      stroke={stroke}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M8.5 19H15.5" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M8 4.5C9 5.7 9 7 8 8.2" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 3.8C13 5 13 6.3 12 7.5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
    <path d="M16 4.5C17 5.7 17 7 16 8.2" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ClockIcon = ({ className = "h-7 w-7", stroke = "#A1A1AA" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="1.8" />
    <path d="M12 8V12L15 10" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const MapIcon = ({ className = "h-7 w-7", stroke = "#A1A1AA" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 6L10.5 3L17 6L20 4.5V18L13.5 21L7 18L4 19.5V6Z" stroke={stroke} strokeWidth="1.8" strokeLinejoin="round" />
    <path d="M10.5 3V18M17 6V21" stroke={stroke} strokeWidth="1.8" />
  </svg>
);

const HeaderLoggedIn = ({
  location,
  onSaveLocation,
  cartItems,
  orders,
  onPlaceOrder,
  onIncreaseQty,
  onDecreaseQty,
  onRemoveFromCart,
  cartNotice,
}) => {
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [locationInput, setLocationInput] = useState(location || "");
  const [activeTab, setActiveTab] = useState("cart");
  const [panelError, setPanelError] = useState("");
  const [isPanelAlertOpen, setIsPanelAlertOpen] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [locationError, setLocationError] = useState("");

  const signedInEmail = useMemo(() => {
    if (typeof window === "undefined") {
      return "";
    }

    const token = localStorage.getItem("authToken") || localStorage.getItem("token");
    if (!token) {
      return "";
    }

    try {
      const base64Url = token.split(".")[1];
      if (!base64Url) {
        return "";
      }
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
      const payload = JSON.parse(atob(padded));
      return payload?.email || "";
    } catch {
      return "";
    }
  }, []);

  useEffect(() => {
    setLocationInput(location || "");
  }, [location]);

  useEffect(() => {
    if (!isCartOpen) {
      setPanelError("");
      setLocationError("");
    }
  }, [isCartOpen]);

  const cartTotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0),
    [cartItems]
  );

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleCheckout = async () => {
    if (!cartItems.length) {
      setPanelError("Your cart is empty.");
      setIsPanelAlertOpen(true);
      return;
    }

    if (!locationInput.trim()) {
      setLocationError("Please complete your address");
      return;
    }

    try {
      setIsPlacingOrder(true);
      setPanelError("");
      setLocationError("");
      onSaveLocation(locationInput.trim());
      await onPlaceOrder(locationInput.trim());
      setActiveTab("order");
      setIsSuccessOpen(true);
    } catch (error) {
      setPanelError(error?.response?.data?.message || error.message || "Failed to place order");
      setIsPanelAlertOpen(true);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <header className="w-full bg-[#18181B]">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 py-5 sm:px-8 lg:px-[88px]">
        <div aria-label="Logo and slogan section" className="flex items-center gap-3">
          <NomNomLogoRed />
          <div aria-label="slogan" className="flex flex-col text-white">
            <div className="text-[20px] font-semibold leading-none">
              Nom<span className="text-red-500">Nom</span>
            </div>
            <div className="mt-1 text-[12px] text-white/70">Swift delivery</div>
          </div>
        </div>

        <div aria-label="Buttons section" className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Delivery address"
            className="flex items-center gap-2 rounded-full bg-white px-3 py-2"
            onClick={() => setIsLocationOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="19" viewBox="0 0 15 19" fill="none">
              <path
                d="M14.0833 7.41667C14.0833 12.4167 7.41667 17.4167 7.41667 17.4167C7.41667 17.4167 0.75 12.4167 0.75 7.41667C0.75 5.64856 1.45238 3.95286 2.70262 2.70262C3.95286 1.45238 5.64856 0.75 7.41667 0.75C9.18478 0.75 10.8805 1.45238 12.1307 2.70262C13.381 3.95286 14.0833 5.64856 14.0833 7.41667Z"
                stroke="#EF4444"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.41667 9.91667C8.79738 9.91667 9.91667 8.79738 9.91667 7.41667C9.91667 6.03595 8.79738 4.91667 7.41667 4.91667C6.03596 4.91667 4.91667 6.03595 4.91667 7.41667C4.91667 8.79738 6.03596 9.91667 7.41667 9.91667Z"
                stroke="#EF4444"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="text-sm text-red-500">Delivery address:</p>
            <span className="max-w-[180px] truncate text-sm text-[#71717A]">
              {location || "Add Location"}
            </span>
          </button>

          <button
            type="button"
            aria-label="Shopping"
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white"
            onClick={() => setIsCartOpen((prev) => !prev)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path
                d="M0.5 0.5H1.83333L3.60667 8.78C3.67172 9.08324 3.84045 9.35432 4.08381 9.54657C4.32717 9.73883 4.62994 9.84023 4.94 9.83333H11.46C11.7635 9.83284 12.0577 9.72886 12.294 9.53856C12.5304 9.34825 12.6948 9.08302 12.76 8.78667L13.86 3.83333H2.54667M5.13333 13.1333C5.13333 13.5015 4.83486 13.8 4.46667 13.8C4.09848 13.8 3.8 13.5015 3.8 13.1333C3.8 12.7651 4.09848 12.4667 4.46667 12.4667C4.83486 12.4667 5.13333 12.7651 5.13333 13.1333ZM12.4667 13.1333C12.4667 13.5015 12.1682 13.8 11.8 13.8C11.4318 13.8 11.1333 13.5015 11.1333 13.1333C11.1333 12.7651 11.4318 12.4667 11.8 12.4667C12.1682 12.4667 12.4667 12.7651 12.4667 13.1333Z"
                stroke="#18181B"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ef4444] px-1 text-[10px] text-white">
                {cartCount}
              </span>
            )}
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label="User"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-red-500 p-0"
              >
                <HumanIcon className="h-[13px] w-[11px] shrink-0 translate-y-[0.5px]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[220px]">
              <div className="px-2 py-1.5 text-xs text-[#71717A]">
                Email: <span className="text-[#18181B]">{signedInEmail || "-"}</span>
              </div>
              <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {cartNotice && (
        <div className="pointer-events-none fixed left-1/2 top-6 z-[120] -translate-x-1/2">
          <Alert className="w-fit border-[#3f3f46] bg-[#18181B] px-3 py-2 text-[#FAFAFA] shadow-lg">
            <AlertTitle className="flex items-center gap-2 text-sm font-medium">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#22C55E]">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="7" viewBox="0 0 10 7" fill="none">
                  <path
                    d="M9 1L3.5 6L1 3.72727"
                    stroke="white"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              {cartNotice}
            </AlertTitle>
            <AlertDescription className="hidden" />
          </Alert>
        </div>
      )}

      {isCartOpen && (
        <div className="fixed inset-0 z-[90] bg-black/35" onClick={() => setIsCartOpen(false)}>
          <aside
            className="absolute inset-y-0 right-0 flex h-full w-full max-w-[560px] flex-col gap-4 overflow-hidden bg-[#3F3F46] p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-[#F4F4F5]">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 4H4.5L6.4 13.3C6.48 13.69 6.69 14.04 7.01 14.28C7.33 14.52 7.72 14.65 8.13 14.64H17.03C17.43 14.64 17.82 14.51 18.14 14.27C18.45 14.03 18.66 13.69 18.75 13.31L20 7.6H5.4"
                    stroke="#E4E4E7"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="9" cy="19" r="1.7" stroke="#E4E4E7" strokeWidth="1.8" />
                  <circle cx="17" cy="19" r="1.7" stroke="#E4E4E7" strokeWidth="1.8" />
                </svg>
                <h2 className="text-[24px] font-semibold leading-none">Order detail</h2>
              </div>

              <button
                type="button"
                className="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-[#E4E4E7] text-[#E4E4E7]"
                onClick={() => setIsCartOpen(false)}
                aria-label="Close order detail panel"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M7 7L17 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M17 7L7 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="rounded-full bg-[#F4F4F5] p-1">
              <div className="grid grid-cols-2 gap-1">
                <button
                  type="button"
                  className={`h-12 cursor-pointer rounded-full text-[22px] leading-none ${activeTab === "cart" ? "bg-[#EF4444] text-white" : "text-[#09090B]"}`}
                  onClick={() => setActiveTab("cart")}
                >
                  Cart
                </button>
                <button
                  type="button"
                  className={`h-12 cursor-pointer rounded-full text-[22px] leading-none ${activeTab === "order" ? "bg-[#EF4444] text-white" : "text-[#09090B]"}`}
                  onClick={() => setActiveTab("order")}
                >
                  Order
                </button>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col rounded-[28px] bg-[#F4F4F5] p-5">
              <h3
                className={`text-[26px] font-semibold leading-none ${
                  activeTab === "cart" ? "text-[#71717A]" : "text-[#09090B]"
                }`}
              >
                {activeTab === "cart" ? "My cart" : "Order history"}
              </h3>

              {activeTab === "cart" ? (
                cartItems.length ? (
                  <div className="mt-4 flex min-h-0 flex-1 flex-col gap-3">
                    <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
                      {cartItems.map((item) => (
                        <article key={item._id || item.id} className="border-b border-dashed border-[#A1A1AA] pb-3 last:border-b-0">
                          <div className="flex gap-3">
                            <Image
                              src={item.image || SaladImage}
                              alt={item.foodName}
                              width={120}
                              height={120}
                              className="h-[120px] w-[120px] rounded-2xl object-cover"
                              unoptimized={Boolean(item.image)}
                            />

                            <div className="flex flex-1 flex-col justify-between">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className="line-clamp-1 text-[18px] font-semibold text-[#EF4444]">
                                    {item.foodName}
                                  </p>
                                  <p className="mt-1 line-clamp-2 text-[14px] leading-5 text-[#18181B]">
                                    {item.ingredients || item.description || ""}
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#EF4444] text-[24px] leading-none text-[#EF4444]"
                                  onClick={() => onRemoveFromCart(item._id || item.id)}
                                  aria-label={`Remove ${item.foodName}`}
                                >
                                  ×
                                </button>
                              </div>

                              <div className="mt-2 flex items-center justify-between">
                                <div className="flex items-center gap-4 text-[24px] leading-none text-[#18181B]">
                                  <button
                                    type="button"
                                    className="cursor-pointer"
                                    onClick={() => onDecreaseQty(item._id || item.id)}
                                  >
                                    −
                                  </button>
                                  <span className="min-w-[24px] text-center text-[24px] font-medium">
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    className="cursor-pointer"
                                    onClick={() => onIncreaseQty(item._id || item.id)}
                                  >
                                    +
                                  </button>
                                </div>
                                <p className="text-[34px] font-semibold leading-none text-[#09090B]">
                                  ${Number(item.price || 0).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>

                    <div className="pt-1">
                      <p className="text-[26px] font-semibold leading-none text-[#71717A]">Delivery location</p>
                      <Input
                        className={`mt-3 h-[64px] rounded-2xl px-4 text-[16px] text-[#71717A] placeholder:text-[#71717A] ${
                          locationError ? "border-[#EF4444] focus-visible:ring-[#EF4444]" : "border-[#D4D4D8]"
                        }`}
                        placeholder="Please share your complete address"
                        value={locationInput}
                        onChange={(e) => {
                          setLocationInput(e.target.value);
                          if (locationError && e.target.value.trim()) {
                            setLocationError("");
                          }
                        }}
                      />
                      {locationError && <p className="mt-2 text-sm text-[#EF4444]">{locationError}</p>}
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex flex-1 flex-col items-center justify-center rounded-3xl bg-[#E4E4E7] px-6 py-6 text-center">
                    <div className="mx-auto w-fit">
                      <TrayFoodIcon />
                    </div>
                    <p className="mt-3 text-[22px] font-semibold leading-none text-[#09090B]">Your cart is empty</p>
                    <p className="mx-auto mt-2 max-w-[92%] text-[16px] leading-[1.35] text-[#71717A]">
                      Hungry? 🍔 Add some delicious dishes to your cart and satisfy your cravings!
                    </p>
                  </div>
                )
              ) : orders.length ? (
                <div className="mt-4 min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
                  {orders.map((order) => {
                    const status = String(order.status || "").toLowerCase();
                    const dateLabel = order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString("en-CA").replaceAll("-", "/")
                      : "-";
                    const orderRef = `#${order.orderNumber || String(order.id || "").slice(0, 5)}`;
                    const orderItems = order.items || order.foodOrderItems || [];
                    const statusClass =
                      status === "delivered"
                        ? "bg-[#E4E4E7] text-[#18181B]"
                        : "border border-[#EF4444] bg-transparent text-[#18181B]";

                    return (
                      <article
                        key={order.id || order._id}
                        className="border-b border-dashed border-[#A1A1AA] pb-4 last:border-b-0"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-[24px] font-semibold leading-none text-[#09090B]">
                            ${Number(order.totalPrice || 0).toFixed(2)} ({orderRef})
                          </p>
                          <span
                            className={`inline-flex h-9 items-center rounded-full px-4 text-[16px] font-medium ${statusClass}`}
                          >
                            {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Pending"}
                          </span>
                        </div>

                        <div className="mt-3 space-y-2 text-[16px] text-[#71717A]">
                          {orderItems.map((orderItem, idx) => (
                            <div
                              key={`${order.id || order._id}-${idx}`}
                              className="flex items-center justify-between gap-3"
                            >
                              <div className="flex min-w-0 items-center gap-2">
                                <BowlIcon className="h-7 w-7 shrink-0" />
                                <span className="line-clamp-1">{orderItem.foodName}</span>
                              </div>
                              <span className="shrink-0">x {orderItem.quantity}</span>
                            </div>
                          ))}

                          <div className="flex items-center gap-2">
                            <ClockIcon className="h-7 w-7" />
                            <span>{dateLabel}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <MapIcon className="h-7 w-7" />
                            <span className="line-clamp-1">{order.deliveryAddress || "-"}</span>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-4 flex flex-1 flex-col items-center justify-center rounded-3xl bg-[#E4E4E7] px-6 py-6 text-center">
                  <div className="mx-auto w-fit">
                    <TrayFoodIcon />
                  </div>
                  <p className="mt-3 text-[22px] font-semibold leading-none text-[#09090B]">No Orders Yet?</p>
                  <p className="mx-auto mt-2 max-w-[92%] text-[16px] leading-[1.35] text-[#71717A]">
                    🍕 "You haven't placed any orders yet. Start exploring our menu and satisfy your cravings!"
                  </p>
                </div>
              )}
            </div>

            <div className="shrink-0 rounded-[28px] bg-[#F4F4F5] p-5">
              <h3 className="text-[26px] font-semibold leading-none text-[#71717A]">Payment info</h3>

              <div className="mt-3 space-y-2 text-[18px] text-[#71717A]">
                <div className="flex items-center justify-between">
                  <span>Items</span>
                  <span className="font-medium text-[#09090B]">
                    {cartItems.length ? `$${cartTotal.toFixed(2)}` : "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-[#09090B]">{cartItems.length ? "0.99$" : "-"}</span>
                </div>
              </div>

              <div className="my-3 border-t border-dashed border-[#A1A1AA]" />

              <div className="flex items-center justify-between text-[20px]">
                <span className="text-[#71717A]">Total</span>
                <span className="font-semibold text-[#09090B]">
                  {cartItems.length ? `$${(cartTotal + 0.99).toFixed(2)}` : "-"}
                </span>
              </div>

              <Button
                type="button"
                className={`mt-3 h-11 w-full rounded-full text-[18px] font-medium ${
                  cartItems.length
                    ? "cursor-pointer bg-[#EF4444] text-white hover:bg-[#dc2626]"
                    : "bg-[#E7C7C9] text-white hover:bg-[#E7C7C9]"
                }`}
                onClick={handleCheckout}
                disabled={isPlacingOrder || !cartItems.length}
              >
                {isPlacingOrder ? "Ordering..." : "Checkout"}
              </Button>
            </div>
          </aside>
        </div>
      )}

      <Dialog open={isLocationOpen} onOpenChange={setIsLocationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter location</DialogTitle>
            <DialogDescription>Please write your delivery address!</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Type delivery address"
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
            />
          </div>
          <DialogFooter className="!justify-between">
            <Button type="button" variant="outline" className="rounded-full" onClick={() => setIsLocationOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              className="rounded-full"
              onClick={() => {
                onSaveLocation(locationInput.trim());
                setIsLocationOpen(false);
              }}
            >
              Deliver Here
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        {isSuccessOpen && <div className="fixed inset-0 z-[140] bg-black/40" aria-hidden="true" />}
        <DialogContent className="z-[150] h-[439px] w-[664px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-[36px] border-none bg-[#F3F4F6] p-6 text-center shadow-[0_24px_80px_rgba(0,0,0,0.35)] !flex !flex-col !items-center !justify-between !gap-0">
          <DialogHeader className="w-full !space-y-0 text-center">
            <DialogTitle className="mx-auto w-full text-center whitespace-nowrap text-[22px] font-semibold leading-[1.2] text-[#09090B]">
              Your order has been successfully placed !
            </DialogTitle>
            <DialogDescription className="hidden" />
          </DialogHeader>
          <div className="flex min-h-0 flex-1 items-center justify-center">
            <Image
              src={ORDER_PLACED_ILLUSTRATION_SRC}
              alt="Order placed illustration"
              width={156}
              height={266}
              className="h-[265.7px] w-[156px]"
              priority={false}
            />
          </div>
          <DialogFooter className="!m-0 !w-full !justify-center !px-0 !pb-0 !pt-2">
            <Button
              type="button"
              className="h-[44px] w-[188px] rounded-full bg-[#E4E4E7] px-3 py-2 text-base font-normal text-[#18181B] hover:bg-[#D4D4D8]"
              onClick={() => {
                setIsSuccessOpen(false);
                setIsCartOpen(false);
                setActiveTab("cart");
              }}
            >
              Back to home
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isPanelAlertOpen} onOpenChange={setIsPanelAlertOpen}>
        <DialogContent className="max-w-[360px]">
          <DialogHeader>
            <DialogTitle>Action needed</DialogTitle>
            <DialogDescription>{panelError || "Please complete required fields."}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="!justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setIsPanelAlertOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={() => setIsPanelAlertOpen(false)}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default HeaderLoggedIn;
