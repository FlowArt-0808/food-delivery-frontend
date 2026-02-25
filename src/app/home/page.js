"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import HeaderLoggedIn from "./_features/header(logged in)";
import Footer from "./_features/footer";
import { Menu } from "./_features/menu";
import HeroImage from "../_components/images/SpecialDealOfferAd.png";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SaladImage from "../_components/images/Salad-3.png";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:999";

const getAuthToken = () => {
  if (typeof window === "undefined") {
    return "";
  }

  return localStorage.getItem("authToken") || localStorage.getItem("token") || "";
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const normalizeOrder = (order) => ({
  id: order?._id || order?.id,
  orderNumber: Number(order?.orderNumber || 0),
  createdAt: order?.createdAt,
  status: order?.status || "pending",
  deliveryAddress: order?.deliveryAddress || "",
  totalPrice: Number(order?.totalPrice || 0),
  items: Array.isArray(order?.foodOrderItems)
    ? order.foodOrderItems.map((item) => ({
        id: item?._id,
        quantity: Number(item?.quantity || 0),
        foodName: item?.food?.foodName || "Unknown food",
      }))
    : [],
});

const Home = () => {
  const [location, setLocation] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cartNotice, setCartNotice] = useState("");
  const [selectedDish, setSelectedDish] = useState(null);
  const [detailQty, setDetailQty] = useState(1);

  const cartItemIds = useMemo(() => cartItems.map((item) => item._id), [cartItems]);

  const fetchMyOrders = async () => {
    const token = getAuthToken();
    if (!token) {
      return;
    }

    try {
      const response = await axios.get(`${API_BASE}/authentication/order/my`, {
        headers: getAuthHeaders(),
      });

      const list = Array.isArray(response.data) ? response.data : [];
      setOrders(list.map(normalizeOrder));
    } catch (error) {
      console.error("Failed to load orders:", error?.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const openDishDetail = (dish) => {
    setSelectedDish(dish);
    setDetailQty(1);
  };

  const handleAddToCart = (dish, qty = 1) => {
    if (!dish?._id) {
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === dish._id);
      if (existing) {
        return prev.map((item) =>
          item._id === dish._id ? { ...item, quantity: item.quantity + qty } : item
        );
      }

      return [
        ...prev,
        {
          _id: dish._id,
          foodName: dish.foodName,
          price: Number(dish.price || 0),
          quantity: qty,
          image: dish.image || "",
        },
      ];
    });

    setCartNotice("Food is being added to the cart!");
    setTimeout(() => {
      setCartNotice("");
    }, 1800);
  };

  const handleIncreaseQty = (id) => {
    setCartItems((prev) =>
      prev.map((item) => (item._id === id ? { ...item, quantity: item.quantity + 1 } : item))
    );
  };

  const handleDecreaseQty = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item._id === id ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const handlePlaceOrder = async (deliveryAddress) => {
    const payloadItems = cartItems.map((item) => ({
      foodId: item._id,
      quantity: item.quantity,
    }));

    const response = await axios.post(
      `${API_BASE}/authentication/order`,
      {
        deliveryAddress,
        items: payloadItems,
      },
      {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      }
    );

    const createdOrder = response?.data?.order;
    if (createdOrder) {
      setOrders((prev) => [normalizeOrder(createdOrder), ...prev]);
    } else {
      await fetchMyOrders();
    }

    setCartItems([]);
  };

  return (
    <main className="min-h-screen bg-[#3f3f46] text-[#18181b]">
      <HeaderLoggedIn
        location={location}
        onSaveLocation={setLocation}
        cartItems={cartItems}
        orders={orders}
        onPlaceOrder={handlePlaceOrder}
        onIncreaseQty={handleIncreaseQty}
        onDecreaseQty={handleDecreaseQty}
        onRemoveFromCart={handleRemoveFromCart}
        cartNotice={cartNotice}
      />

      <section className="mx-auto w-full max-w-[1440px] px-4 pb-6 pt-4 sm:px-8 lg:px-[88px]">
        <div className="relative overflow-hidden rounded-3xl">
          <Image
            src={HeroImage}
            alt="Special deal offer"
            className="h-[280px] w-full object-cover sm:h-[360px] lg:h-[420px]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#18181bcc] via-[#18181b88] to-transparent px-6 py-8 sm:px-10 sm:py-12">
            <div className="max-w-[560px] text-white">
              <p className="mb-3 inline-flex rounded-full border border-white/30 bg-black/20 px-3 py-1 text-xs font-medium tracking-wide">
                Fresh fast delivered
              </p>
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
                Fastest delivery, best menu in your neighborhood
              </h1>
              <p className="mt-4 text-sm text-white/85 sm:text-base">
                Order in minutes and get your favorites delivered hot and fresh.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Menu onSelectDish={openDishDetail} cartItemIds={cartItemIds} />
      <Footer />

      <Dialog open={Boolean(selectedDish)} onOpenChange={() => setSelectedDish(null)}>
        <DialogContent className="max-w-[860px] border-none bg-transparent p-0 shadow-none [&>button]:right-4 [&>button]:top-4 [&>button]:z-20 [&>button]:rounded-full [&>button]:bg-white/90 [&>button]:p-1">
          {selectedDish && (
            <div className="grid overflow-hidden rounded-2xl border border-[#E4E4E7] bg-white sm:grid-cols-[1.15fr_1fr]">
              <div className="bg-[#f4f4f5] p-2 sm:p-3">
                <Image
                  src={selectedDish.image || SaladImage}
                  alt={selectedDish.foodName}
                  width={760}
                  height={460}
                  className="h-[240px] w-full rounded-xl object-cover sm:h-[300px]"
                  unoptimized={Boolean(selectedDish.image)}
                />
              </div>
              <div className="flex flex-col justify-between p-4 sm:p-5">
                <DialogHeader className="space-y-2 text-left">
                  <DialogTitle className="text-3xl font-semibold leading-tight text-[#ef4444]">
                    {selectedDish.foodName}
                  </DialogTitle>
                </DialogHeader>
                <p className="mt-2 text-sm leading-6 text-[#52525B]">{selectedDish.ingredients}</p>
                <div className="mt-10 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-[#71717A]">Total price</p>
                    <p className="text-[30px] font-semibold text-[#18181B]">${(Number(selectedDish.price || 0) * detailQty).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="h-8 w-8 rounded-full border border-[#E4E4E7] text-sm"
                      onClick={() => setDetailQty((prev) => Math.max(1, prev - 1))}
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{detailQty}</span>
                    <button
                      type="button"
                      className="h-8 w-8 rounded-full border border-[#18181B] text-sm"
                      onClick={() => setDetailQty((prev) => prev + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <DialogFooter className="mt-4">
                  <Button
                    type="button"
                    className="h-10 w-full rounded-full bg-[#18181B] text-sm font-semibold"
                    onClick={() => {
                      handleAddToCart(selectedDish, detailQty);
                      setSelectedDish(null);
                    }}
                  >
                    Add to cart
                  </Button>
                </DialogFooter>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default Home;
