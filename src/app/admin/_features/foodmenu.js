"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useFoodCategoryContext } from "../../_provider/foodCategoryProvider";
import { Dishmenu } from "../_components/dishmenu";

export const FoodMenu = () => {
  const {
    categories,
    loading,
    error,
    fetchMenu,
    createCategory,
    createFood,
    updateFood,
    deleteFood,
    uploadDishImage,
    hasAuthToken,
  } = useFoodCategoryContext();
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("all");

  useEffect(() => {
    fetchMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalFoodNumber = useMemo(
    () => categories.reduce((sum, category) => sum + (category.foods?.length || 0), 0),
    [categories]
  );

  const visibleCategories = useMemo(() => {
    if (activeCategoryFilter === "all") {
      return categories;
    }

    return categories.filter((category) => category._id === activeCategoryFilter);
  }, [activeCategoryFilter, categories]);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      setIsSubmittingCategory(true);
      await createCategory(categoryName);
      setCategoryName("");
      setIsCategoryDialogOpen(false);
    } catch (error) {
      alert(error?.response?.data?.message || error.message || "Failed to create category");
    } finally {
      setIsSubmittingCategory(false);
    }
  };

  return (
    <div aria-label="All dishes and their category" className="relative flex flex-col gap-4 bg-[#E4E4E5]">
      {!hasAuthToken && (
        <div className="mx-6 mt-6 rounded-md border border-[#fca5a5] bg-[#fff1f2] px-4 py-3 text-sm text-[#9f1239]">
          You are not logged in. Please log in first to add categories or dishes.
        </div>
      )}

      <div aria-label="Dishes category" className="mx-5 mt-5 flex flex-col gap-2.5 rounded-xl bg-[#FFF] p-3">
        <p className="text-[15px] font-semibold text-[#09090B]">Dishes category</p>

        <div aria-label="Category button grid" className="flex flex-wrap items-center gap-1">
          <button
            className={`flex h-6 w-fit items-center gap-1 rounded-full border px-2.5 text-[10px] font-medium ${
              activeCategoryFilter === "all"
                ? "border-[#EF4444] text-[#EF4444]"
                : "border-[#D4D4D8] text-[#18181B]"
            }`}
            onClick={() => setActiveCategoryFilter("all")}
          >
            All dishes
            <div className="rounded-full bg-[#18181B] px-1.5 py-0.5 text-[8px] font-semibold text-[#FAFAFA]">
              {totalFoodNumber}
            </div>
          </button>

          {categories.map((category) => (
            <button
              className={`flex h-6 w-fit items-center gap-1 rounded-full border px-2.5 text-[10px] font-medium ${
                activeCategoryFilter === category._id
                  ? "border-[#EF4444] text-[#EF4444]"
                  : "border-[#D4D4D8] text-[#18181B]"
              }`}
              key={category._id}
              onClick={() => setActiveCategoryFilter(category._id)}
            >
              {category.categoryName}
              <div className="rounded-full bg-[#18181B] px-1.5 py-0.5 text-[8px] font-semibold text-[#FAFAFA]">
                {category.foods?.length || 0}
              </div>
            </button>
          ))}

          <button
            aria-label="Category adder button"
            className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setIsCategoryDialogOpen(true)}
            disabled={!hasAuthToken}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M5.16667 0.5V9.83333M0.5 5.16667H9.83333" stroke="#FAFAFA" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div aria-label="The dishes" className="mx-5 mb-6 flex flex-col gap-4">
        {loading && <p className="text-sm text-[#52525B]">Loading categories and dishes...</p>}
        {!loading && error && <p className="text-sm text-red-500">{error}</p>}

        {!loading && categories.length === 0 && (
          <p className="text-sm text-[#52525B]">No categories yet. Add one to get started.</p>
        )}

        {visibleCategories.map((category) => (
          <Dishmenu
            key={category._id}
            category={category}
            allCategories={categories}
            onCreateFood={createFood}
            onUpdateFood={updateFood}
            onDeleteFood={deleteFood}
            onUploadDishImage={uploadDishImage}
            isAuthenticated={hasAuthToken}
          />
        ))}
      </div>

      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="w-[300px] rounded-xl border-[#E4E4E7] p-4">
          <form onSubmit={handleCreateCategory} className="flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle className="text-sm font-semibold text-[#09090B]">Add new category</DialogTitle>
            </DialogHeader>

            <Input
              type="text"
              placeholder="Type category name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />

            <DialogFooter className="!justify-end">
              <Button type="submit" className="h-8 rounded-md bg-[#18181B] px-3 text-xs" disabled={isSubmittingCategory || !hasAuthToken}>
                {isSubmittingCategory ? "Adding..." : "Add category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
