"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import NomNomLogoRed from "@/app/_components/icons/NomNomLogoRed";
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

  useEffect(() => {
    setLocationInput(location || "");
  }, [location]);

  useEffect(() => {
    if (!isCartOpen) {
      setPanelError("");
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
      setPanelError("Please write your delivery address!");
      setIsPanelAlertOpen(true);
      return;
    }

    try {
      setIsPlacingOrder(true);
      setPanelError("");
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
                className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="13" viewBox="0 0 11 13" fill="none">
                  <path
                    d="M9.83333 12.5V11.1667C9.83333 10.4594 9.55238 9.78115 9.05228 9.28105C8.55219 8.78095 7.87391 8.5 7.16667 8.5H3.16667C2.45942 8.5 1.78115 8.78095 1.28105 9.28105C0.780951 9.78115 0.5 10.4594 0.5 11.1667V12.5M7.83333 3.16667C7.83333 4.63943 6.63943 5.83333 5.16667 5.83333C3.69391 5.83333 2.5 4.63943 2.5 3.16667C2.5 1.69391 3.69391 0.5 5.16667 0.5C6.63943 0.5 7.83333 1.69391 7.83333 3.16667Z"
                    stroke="#FAFAFA"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {cartNotice && (
        <div className="pointer-events-none fixed left-1/2 top-6 z-[120] -translate-x-1/2">
          <Alert className="w-fit border-[#3f3f46] bg-[#18181B] px-3 py-2 text-[#FAFAFA] shadow-lg">
            <AlertTitle className="text-sm font-medium">{cartNotice}</AlertTitle>
            <AlertDescription className="hidden" />
          </Alert>
        </div>
      )}

      {isCartOpen && (
        <div className="fixed inset-0 z-[90] bg-black/30" onClick={() => setIsCartOpen(false)}>
          <div
            className="absolute inset-y-0 right-0 flex h-full w-full max-w-[372px] flex-col bg-[#F4F4F5] p-2.5 shadow-2xl sm:max-w-[380px]"
            onClick={(e) => e.stopPropagation()}
          >
          <div className="mb-2.5 flex items-center justify-between">
            <div className="flex rounded-full bg-white p-1 text-xs shadow-sm">
              <button
                type="button"
                className={`rounded-full px-4 py-1.5 text-[11px] font-semibold ${activeTab === "cart" ? "bg-[#ef4444] text-white" : "text-[#18181B]"}`}
                onClick={() => setActiveTab("cart")}
              >
                Cart
              </button>
              <button
                type="button"
                className={`rounded-full px-4 py-1.5 text-[11px] font-semibold ${activeTab === "order" ? "bg-[#ef4444] text-white" : "text-[#18181B]"}`}
                onClick={() => setActiveTab("order")}
              >
                Order
              </button>
            </div>
            <button
              type="button"
              className="text-xs text-[#71717A]"
              onClick={() => setIsCartOpen(false)}
            >
              To close area
            </button>
          </div>

          {activeTab === "cart" && (
            <div className="flex flex-1 flex-col space-y-2.5">
              <div className="max-h-[370px] space-y-2 overflow-auto rounded-2xl bg-white p-2">
                {!cartItems.length && (
                  <div className="rounded-xl border p-6 text-center text-sm text-[#71717A]">
                    Your cart is empty.
                  </div>
                )}

                {cartItems.map((item) => (
                  <div key={item._id} className="rounded-xl border border-[#E4E4E7] bg-white p-2.5">
                    <div className="flex gap-2.5">
                      <Image
                        src={item.image || SaladImage}
                        alt={item.foodName}
                        width={72}
                        height={60}
                        className="h-[60px] w-[72px] rounded-lg object-cover"
                        unoptimized={Boolean(item.image)}
                      />
                      <div className="flex flex-1 flex-col justify-between">
                        <p className="line-clamp-1 text-xs font-semibold text-[#ef4444]">{item.foodName}</p>
                        <p className="text-[11px] text-[#71717A]">${Number(item.price || 0).toFixed(2)}</p>
                      </div>
                      <button
                        type="button"
                        className="self-start text-[11px] text-red-500"
                        onClick={() => onRemoveFromCart(item._id)}
                      >
                        x
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        className="h-6 w-6 rounded-full border border-[#E4E4E7] text-[12px]"
                        onClick={() => onDecreaseQty(item._id)}
                      >
                        -
                      </button>
                      <span className="w-4 text-center text-xs">{item.quantity}</span>
                      <button
                        type="button"
                        className="h-6 w-6 rounded-full border border-[#18181B] text-[12px]"
                        onClick={() => onIncreaseQty(item._id)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-2.5">
                <p className="text-xs text-[#71717A]">Delivery location</p>
                <Input
                  className="mt-2 border-[#E4E4E7] text-xs"
                  placeholder="Please write your delivery address!"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                />
              </div>

              <div className="rounded-2xl border border-[#E4E4E7] bg-white p-2.5 text-sm">
                <div className="flex justify-between text-xs text-[#71717A]">
                  <span>Payment info</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="mt-2 flex justify-between text-sm font-semibold">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <Button
                type="button"
                className="h-9 w-full rounded-full bg-[#ef4444] text-sm font-semibold"
                onClick={handleCheckout}
                disabled={isPlacingOrder}
              >
                {isPlacingOrder ? "Ordering..." : "Continue"}
              </Button>
            </div>
          )}

          {activeTab === "order" && (
            <div className="space-y-3 rounded-2xl bg-white p-2">
              {!orders.length && (
                <div className="rounded-xl border p-6 text-center">
                  <p className="text-sm font-semibold text-[#09090B]">No orders yet</p>
                  <p className="mt-1 text-xs text-[#71717A]">Your order history will appear here.</p>
                </div>
              )}

              {orders.map((order) => (
                <div key={order.id || order._id} className="rounded-xl border border-[#E4E4E7] p-3">
                  <p className="text-sm font-semibold">
                    Order #{order.orderNumber || String(order.id || order._id || "").slice(0, 8)}
                  </p>
                  <p className="text-xs text-[#71717A]">{new Date(order.createdAt).toLocaleString()}</p>
                  <p className="mt-1 text-xs text-[#71717A]">
                    Status: {String(order.status || "").charAt(0).toUpperCase() + String(order.status || "").slice(1)}
                  </p>
                  <p className="mt-1 text-sm font-semibold">${Number(order.totalPrice || 0).toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
          </div>
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
        <DialogContent className="max-w-[340px] text-center">
          <DialogHeader>
            <DialogTitle className="text-base">Your order has been successfully placed!</DialogTitle>
          </DialogHeader>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#ef4444] text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M18 3V33M3 18H33" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.0" />
              <path d="M10 18L16 24L27 12" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
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
