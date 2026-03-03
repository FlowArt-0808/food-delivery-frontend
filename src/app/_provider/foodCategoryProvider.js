"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_BASE } from "@/lib/api-base";

const FoodCategoryContext = createContext(null);

export const useFoodCategoryContext = () => {
  const context = useContext(FoodCategoryContext);
  if (!context) {
    throw new Error("useFoodCategoryContext must be used inside a <FoodCategoryProvider>");
  }
  return context;
};

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

const ensureAuthToken = () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Please log in first. Missing authorization token.");
  }
  return token;
};

export const FoodCategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMenu = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${API_BASE}/authentication/menu`);
      setCategories(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to fetch menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const createCategory = async (categoryName) => {
    if (!categoryName?.trim()) {
      throw new Error("Category name is required");
    }

    ensureAuthToken();

    await axios.post(
      `${API_BASE}/authentication/foodCategory`,
      { categoryName: categoryName.trim() },
      { headers: { "Content-Type": "application/json", ...getAuthHeaders() } }
    );

    await fetchMenu();
  };

  const deleteCategory = async ({ id, categoryName }) => {
    ensureAuthToken();

    if (!id && !categoryName) {
      throw new Error("Category identifier is required");
    }

    try {
      await axios.delete(`${API_BASE}/authentication/foodCategory`, {
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        data: { id, categoryName },
      });
    } catch (err) {
      const apiMessage = err?.response?.data?.message || "Failed to delete category";
      const apiError = err?.response?.data?.error;
      throw new Error(apiError ? `${apiMessage}: ${apiError}` : apiMessage);
    }

    await fetchMenu();
  };

  const updateCategory = async ({ id, categoryName }) => {
    ensureAuthToken();

    if (!id || !categoryName?.trim()) {
      throw new Error("Category id and category name are required");
    }

    try {
      await axios.patch(
        `${API_BASE}/authentication/foodCategory`,
        { id, categoryName: categoryName.trim() },
        { headers: { "Content-Type": "application/json", ...getAuthHeaders() } }
      );
    } catch (err) {
      const apiMessage = err?.response?.data?.message || "Failed to update category";
      const apiError = err?.response?.data?.error;
      throw new Error(apiError ? `${apiMessage}: ${apiError}` : apiMessage);
    }

    await fetchMenu();
  };

  const uploadDishImage = async (file) => {
    if (!file) {
      return "";
    }

    ensureAuthToken();

    const imageData = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    try {
      const response = await axios.post(
        `${API_BASE}/authentication/upload-image`,
        { imageData },
        { headers: { "Content-Type": "application/json", ...getAuthHeaders() } }
      );

      return response?.data?.imageUrl || "";
    } catch (err) {
      const apiMessage = err?.response?.data?.message || "Failed to upload image";
      const apiError = err?.response?.data?.error;
      throw new Error(apiError ? `${apiMessage}: ${apiError}` : apiMessage);
    }
  };

  const createFood = async ({ foodName, price, ingredients, category, image }) => {
    ensureAuthToken();

    try {
      await axios.post(
        `${API_BASE}/authentication/food`,
        { foodName, price, ingredients, category, image },
        { headers: { "Content-Type": "application/json", ...getAuthHeaders() } }
      );
    } catch (err) {
      const apiMessage = err?.response?.data?.message || "Failed to create food";
      const apiError = err?.response?.data?.error;
      throw new Error(apiError ? `${apiMessage}: ${apiError}` : apiMessage);
    }

    await fetchMenu();
  };

  const updateFood = async ({ id, foodName, price, ingredients, category, image }) => {
    ensureAuthToken();

    try {
      await axios.patch(
        `${API_BASE}/authentication/food`,
        { id, foodName, price, ingredients, category, image },
        { headers: { "Content-Type": "application/json", ...getAuthHeaders() } }
      );
    } catch (err) {
      const apiMessage = err?.response?.data?.message || "Failed to update food";
      const apiError = err?.response?.data?.error;
      throw new Error(apiError ? `${apiMessage}: ${apiError}` : apiMessage);
    }

    await fetchMenu();
  };

  const deleteFood = async ({ id, foodName }) => {
    ensureAuthToken();

    try {
      await axios.delete(`${API_BASE}/authentication/food`, {
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        data: { id, foodName },
      });
    } catch (err) {
      const apiMessage = err?.response?.data?.message || "Failed to delete food";
      const apiError = err?.response?.data?.error;
      throw new Error(apiError ? `${apiMessage}: ${apiError}` : apiMessage);
    }

    await fetchMenu();
  };

  const value = useMemo(
    () => ({
      categories,
      loading,
      error,
      fetchMenu,
      createCategory,
      deleteCategory,
      updateCategory,
      uploadDishImage,
      createFood,
      updateFood,
      deleteFood,
      hasAuthToken: Boolean(getAuthToken()),
    }),
    [categories, loading, error]
  );

  return <FoodCategoryContext.Provider value={value}>{children}</FoodCategoryContext.Provider>;
};
