"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAdminContext } from "@/app/_provider/adminProvider";

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

const normalizeStatus = (status) => String(status || "pending").toLowerCase();
const toTitleCase = (status) => {
  const value = normalizeStatus(status);
  return value.charAt(0).toUpperCase() + value.slice(1);
};

export const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("Pending");
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState("");
  const [singleOrderId, setSingleOrderId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { handleDeliveryButton, isDeliveryButtonClicked, setIsDeliveryButtonClicked } =
    useAdminContext();
  const PAGE_SIZE = 10;

  const fetchOrders = async () => {
    const token = getAuthToken();
    if (!token) {
      setError("Please log in as admin first.");
      setOrders([]);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${API_BASE}/authentication/order`, {
        headers: getAuthHeaders(),
      });
      const list = Array.isArray(response.data) ? response.data : [];
      setOrders(list);
      setCurrentPage(1);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const totalItems = orders.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * PAGE_SIZE;
  const pageOrders = orders.slice(pageStart, pageStart + PAGE_SIZE);

  const allSelected = useMemo(
    () => pageOrders.length > 0 && pageOrders.every((item) => selectedOrderIds.includes(item._id)),
    [pageOrders, selectedOrderIds]
  );

  const toggleAll = (checked) => {
    const pageIds = pageOrders.map((item) => item._id);
    setSelectedOrderIds((prev) => {
      if (checked) {
        return [...new Set([...prev, ...pageIds])];
      }

      return prev.filter((id) => !pageIds.includes(id));
    });
  };

  const toggleOne = (id, checked) => {
    setSelectedOrderIds((prev) =>
      checked ? [...new Set([...prev, id])] : prev.filter((item) => item !== id)
    );
  };

  const handleSaveDeliveryState = async () => {
    const targetIds = singleOrderId ? [singleOrderId] : selectedOrderIds;

    if (!targetIds.length) {
      setError("Select at least one order.");
      return;
    }

    try {
      setIsSavingStatus(true);
      setError("");
      await axios.patch(
        `${API_BASE}/authentication/order/status`,
        {
          orderIds: targetIds,
          status: normalizeStatus(selectedStatus),
        },
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
        }
      );

      setIsDeliveryButtonClicked(false);
      setSingleOrderId("");
      setSelectedOrderIds([]);
      await fetchOrders();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to update order status");
    } finally {
      setIsSavingStatus(false);
    }
  };

  const getStatusPillClass = (status) => {
    const normalized = normalizeStatus(status);
    if (normalized === "delivered") {
      return "border-[#86EFAC] bg-white text-[#18181B]";
    }
    if (normalized === "cancelled") {
      return "border-[#D4D4D8] bg-white text-[#18181B]";
    }
    return "border-[#F87171] bg-white text-[#18181B]";
  };

  const handleRowStatusChange = async (orderId, nextStatus) => {
    if (!orderId) {
      return;
    }

    try {
      setUpdatingOrderId(orderId);
      setError("");

      await axios.patch(
        `${API_BASE}/authentication/order/status`,
        {
          orderIds: [orderId],
          status: normalizeStatus(nextStatus),
        },
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
        }
      );

      setOrders((prev) =>
        prev.map((item) =>
          item._id === orderId ? { ...item, status: normalizeStatus(nextStatus) } : item
        )
      );
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Failed to update order status");
    } finally {
      setUpdatingOrderId("");
    }
  };

  const openBulkStatusDialog = () => {
    setSingleOrderId("");
    setSelectedStatus("Pending");
    handleDeliveryButton();
  };

  const buildPageList = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    if (safePage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (safePage >= totalPages - 3) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "...", safePage - 1, safePage, safePage + 1, "...", totalPages];
  };

  const pageItems = buildPageList();

  return (
    <div className="m-6 flex flex-col gap-4">
      {error && (
        <div className="rounded-md border border-[#fca5a5] bg-[#fff1f2] px-4 py-2 text-sm text-[#9f1239]">
          {error}
        </div>
      )}

      <div className="rounded-md border border-[#e5e4e6] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="flex flex-col">
            <p className="text-xl font-semibold text-[#09090B]">Orders</p>
            <p className="text-xs text-[#71717B]">{totalItems} items</p>
          </div>

          <Button
            aria-label="Delivery state changer"
            className="rounded-full bg-[#18181B]"
            onClick={openBulkStatusDialog}
          >
            Change delivery state
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="bg-[#E4E4E7] text-left text-[#09090B]">
              <tr>
                <th className="p-4">
                  <Checkbox
                    className="cursor-pointer border-[#09090B]"
                    checked={allSelected}
                    onCheckedChange={(checked) => toggleAll(Boolean(checked))}
                  />
                </th>
                <th className="p-4">No.</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Food</th>
                <th className="p-4">Date</th>
                <th className="p-4">Total</th>
                <th className="p-4">Delivery Address</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {!loading && orders.length === 0 && (
                <tr className="border-t border-[#E4E4E7]">
                  <td className="p-4 text-sm text-[#71717A]" colSpan={8}>
                    No orders yet.
                  </td>
                </tr>
              )}

              {loading && (
                <tr className="border-t border-[#E4E4E7]">
                  <td className="p-4 text-sm text-[#71717A]" colSpan={8}>
                    Loading orders...
                  </td>
                </tr>
              )}

              {pageOrders.map((item) => (
                <tr key={item._id} className="border-t border-[#E4E4E7]">
                  <td className="p-4 align-top">
                    <Checkbox
                      className="cursor-pointer border-[#09090B]"
                      checked={selectedOrderIds.includes(item._id)}
                      onCheckedChange={(checked) => toggleOne(item._id, Boolean(checked))}
                    />
                  </td>
                  <td className="p-4 align-top">{item.orderNumber || "-"}</td>
                  <td className="p-4 align-top">{item.user?.firstName || item.user?.email || "-"}</td>
                  <td className="p-4 align-top">
                    {(item.foodOrderItems || [])
                      .map((orderItem) => `${orderItem?.food?.foodName || "Unknown"} x${orderItem?.quantity || 0}`)
                      .join(", ") || "-"}
                  </td>
                  <td className="p-4 align-top">
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}
                  </td>
                  <td className="p-4 align-top">${Number(item.totalPrice || 0).toFixed(2)}</td>
                  <td className="p-4 align-top">{item.deliveryAddress || "-"}</td>
                  <td className="p-4 align-top">
                    <Select
                      value={normalizeStatus(item.status)}
                      onValueChange={(value) => handleRowStatusChange(item._id, value)}
                      disabled={updatingOrderId === item._id}
                    >
                      <SelectTrigger
                        className={`h-11 min-w-[146px] cursor-pointer rounded-full px-4 text-[15px] font-semibold shadow-none ${getStatusPillClass(
                          item.status
                        )}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent align="end" className="w-[146px] rounded-2xl border-[#E4E4E7] bg-white p-1">
                        <SelectItem value="delivered" className="cursor-pointer rounded-xl text-[15px]">
                          Delivered
                        </SelectItem>
                        <SelectItem value="pending" className="cursor-pointer rounded-xl text-[15px]">
                          Pending
                        </SelectItem>
                        <SelectItem value="cancelled" className="cursor-pointer rounded-xl text-[15px]">
                          Cancelled
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog
        open={isDeliveryButtonClicked}
        onOpenChange={(open) => {
          setIsDeliveryButtonClicked(open);
          if (!open) {
            setSingleOrderId("");
          }
        }}
      >
        <DialogContent className="w-91">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-[#09090B]">
              Change delivery state
            </DialogTitle>
          </DialogHeader>

          <div className="flex gap-3">
            {[
              "Delivered",
              "Pending",
              "Cancelled",
            ].map((status) => (
              <button
                key={status}
                className={`rounded-full border px-3 py-2 text-sm cursor-pointer ${
                  selectedStatus === status
                    ? "border-red-500 bg-[#E11D48]/10 text-red-500"
                    : "bg-[#F4F4F5]"
                }`}
                onClick={() => setSelectedStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>

          <DialogFooter>
            <Button type="button" className="w-full rounded-full" onClick={handleSaveDeliveryState} disabled={isSavingStatus}>
              {isSavingStatus ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Pagination className="justify-end">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage((prev) => Math.max(1, prev - 1));
              }}
            />
          </PaginationItem>
          {pageItems.map((pageItem, index) => (
            <PaginationItem key={`${pageItem}-${index}`}>
              {pageItem === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  isActive={safePage === pageItem}
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(Number(pageItem));
                  }}
                >
                  {pageItem}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentPage((prev) => Math.min(totalPages, prev + 1));
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
