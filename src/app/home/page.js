"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import HeaderLoggedIn from "./_features/header(logged in)";
import Header from "./_features/header";
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

  return (
    localStorage.getItem("authToken") || localStorage.getItem("token") || ""
  );
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const cartItemIds = useMemo(
    () => cartItems.map((item) => item._id),
    [cartItems],
  );

  const clearAuthStorage = () => {
    if (typeof window === "undefined") {
      return;
    }

    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
  };

  const fetchMyOrders = async () => {
    const token = getAuthToken();
    if (!token) {
      return [];
    }

    const response = await axios.get(`${API_BASE}/authentication/order/my`, {
      headers: getAuthHeaders(),
    });

    const list = Array.isArray(response.data) ? response.data : [];
    return list.map(normalizeOrder);
  };

  useEffect(() => {
    const resolveAuth = async () => {
      const token = getAuthToken();

      if (!token) {
        setOrders([]);
        setIsAuthenticated(false);
        return;
      }

      try {
        const myOrders = await fetchMyOrders();
        setOrders(myOrders);
        setIsAuthenticated(true);
      } catch (error) {
        if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          clearAuthStorage();
        }

        setOrders([]);
        setIsAuthenticated(false);
      }
    };

    resolveAuth();
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
          item._id === dish._id
            ? { ...item, quantity: item.quantity + qty }
            : item,
        );
      }

      return [
        ...prev,
        {
          _id: dish._id,
          foodName: dish.foodName,
          ingredients: dish.ingredients || "",
          description: dish.description || "",
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
      prev.map((item) =>
        item._id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const handleDecreaseQty = (id) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item._id === id
            ? { ...item, quantity: Math.max(0, item.quantity - 1) }
            : item,
        )
        .filter((item) => item.quantity > 0),
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
      },
    );

    const createdOrder = response?.data?.order;
    if (createdOrder) {
      setOrders((prev) => [normalizeOrder(createdOrder), ...prev]);
    } else {
      const myOrders = await fetchMyOrders();
      setOrders(myOrders);
    }

    setCartItems([]);
  };

  return (
    <main className="min-h-screen bg-[#3f3f46] text-[#18181b]">
      {isAuthenticated ? (
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
      ) : (
        <Header />
      )}

      <section
        aria-label="Hero Poster"
        className="w-full"
      >
        <Image
          src={HeroImage}
          alt="Hero poster"
          className="h-[280px] w-full object-cover sm:h-[360px] lg:h-[420px]"
          priority
        />
      </section>

      <Menu
        onSelectDish={openDishDetail}
        cartItemIds={isAuthenticated ? cartItemIds : []}
      />
      <Footer />

      <Dialog
        open={Boolean(selectedDish)}
        onOpenChange={() => setSelectedDish(null)}
      >
        <DialogContent className="h-[412px] w-[826px] max-w-none sm:max-w-none border-none bg-transparent p-0 shadow-none [&>button]:right-4 [&>button]:top-4 [&>button]:z-20 [&>button]:flex [&>button]:h-9 [&>button]:w-9 [&>button]:items-center [&>button]:justify-center [&>button]:rounded-full [&>button]:border [&>button]:border-[#18181B] [&>button]:bg-transparent [&>button]:p-0 [&>button]:hover:bg-transparent [&>button]:data-[state=open]:bg-transparent">
          {selectedDish && (
            <div className="grid h-full box-border overflow-hidden rounded-2xl border border-[#E4E4E7] bg-white p-6 sm:grid-cols-[377px_minmax(0,1fr)]">
              <div className="flex items-center justify-center bg-[#f4f4f5]">
                <div className="relative h-[364px] w-[377px] overflow-hidden rounded-xl">
                  <Image
                    src={selectedDish.image || SaladImage}
                    alt={selectedDish.foodName}
                    fill
                    sizes="377px"
                    className="object-fill"
                    unoptimized={Boolean(selectedDish.image)}
                  />
                </div>
              </div>
              <div className="flex h-[364px] flex-col justify-between p-4">
                <DialogHeader className="space-y-2 text-left">
                  <DialogTitle className="text-3xl font-semibold leading-tight text-[#ef4444]">
                    {selectedDish.foodName}
                  </DialogTitle>
                </DialogHeader>
                <p className="mt-2 text-sm leading-6 text-[#52525B]">
                  {selectedDish.ingredients}
                </p>
                <div className="mt-10 flex items-end justify-between gap-14">
                  <div className="min-w-[170px]">
                    <p className="text-xs text-[#71717A]">Total price</p>
                    <p className="whitespace-nowrap text-[30px] font-semibold tabular-nums text-[#18181B]">
                      $
                      {(Number(selectedDish.price || 0) * detailQty).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      className="h-8 w-8 cursor-pointer rounded-full border border-[#E4E4E7] text-sm"
                      onClick={() =>
                        setDetailQty((prev) => Math.max(1, prev - 1))
                      }
                    >
                      -
                    </button>
                    <span className="w-7 text-center text-sm font-medium tabular-nums">
                      {detailQty}
                    </span>
                    <button
                      type="button"
                      className="h-8 w-8 cursor-pointer rounded-full border border-[#18181B] text-sm"
                      onClick={() => setDetailQty((prev) => prev + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <DialogFooter className="mt-4">
                  {isAuthenticated ? (
                    <Button
                      type="button"
                      className="h-10 w-full cursor-pointer rounded-full bg-[#18181B] text-sm font-semibold"
                      onClick={() => {
                        handleAddToCart(selectedDish, detailQty);
                        setSelectedDish(null);
                      }}
                    >
                      Add to cart
                    </Button>
                  ) : (
                    <Button
                      asChild
                      type="button"
                      className="h-10 w-full rounded-full bg-[#18181B] text-sm font-semibold"
                    >
                      <Link href="/login">Log in to order</Link>
                    </Button>
                  )}
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
