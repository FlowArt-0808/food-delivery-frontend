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
    deleteCategory,
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
  const [showCategoryAddedToast, setShowCategoryAddedToast] = useState(false);
  const [categoryDeleteTarget, setCategoryDeleteTarget] = useState(null);
  const [isDeletingCategory, setIsDeletingCategory] = useState(false);
  const [showCategoryDeletedToast, setShowCategoryDeletedToast] = useState(false);

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
      setShowCategoryAddedToast(true);
      setTimeout(() => setShowCategoryAddedToast(false), 2600);
    } catch (error) {
      alert(error?.response?.data?.message || error.message || "Failed to create category");
    } finally {
      setIsSubmittingCategory(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryDeleteTarget?._id) {
      return;
    }

    try {
      setIsDeletingCategory(true);
      await deleteCategory({
        id: categoryDeleteTarget._id,
        categoryName: categoryDeleteTarget.categoryName,
      });

      if (activeCategoryFilter === categoryDeleteTarget._id) {
        setActiveCategoryFilter("all");
      }

      setCategoryDeleteTarget(null);
      setShowCategoryDeletedToast(true);
      setTimeout(() => setShowCategoryDeletedToast(false), 2600);
    } catch (error) {
      alert(error?.response?.data?.message || error.message || "Failed to delete category");
    } finally {
      setIsDeletingCategory(false);
    }
  };

  return (
    <div aria-label="All dishes and their category" className="relative flex flex-col gap-4 bg-[#E4E4E5]">
      {showCategoryAddedToast && (
        <div className="pointer-events-none fixed left-1/2 top-5 z-[130] -translate-x-1/2">
          <div className="flex items-center gap-3 rounded-2xl border border-[#52525B] bg-[#18181B] px-5 py-3 text-sm text-[#FAFAFA] shadow-[0_12px_28px_rgba(0,0,0,0.35)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path
                d="M14.4 1.2L6 10.8L1.6 6.4"
                stroke="#FAFAFA"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p>New Category is being added to the menu</p>
          </div>
        </div>
      )}
      {showCategoryDeletedToast && (
        <div className="pointer-events-none fixed left-1/2 top-5 z-[130] -translate-x-1/2">
          <div className="flex items-center gap-3 rounded-2xl border border-[#52525B] bg-[#18181B] px-5 py-3 text-sm text-[#FAFAFA] shadow-[0_12px_28px_rgba(0,0,0,0.35)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path
                d="M14.4 1.2L6 10.8L1.6 6.4"
                stroke="#FAFAFA"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p>Category has been deleted from the menu</p>
          </div>
        </div>
      )}

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
              onContextMenu={(event) => {
                event.preventDefault();
                if (!hasAuthToken) {
                  return;
                }
                setCategoryDeleteTarget(category);
              }}
              title="Right click to delete this category"
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

      <Dialog open={Boolean(categoryDeleteTarget)} onOpenChange={(open) => !open && setCategoryDeleteTarget(null)}>
        <DialogContent className="w-[340px] rounded-xl border-[#E4E4E7] p-4">
          <DialogHeader>
            <DialogTitle className="text-sm font-semibold text-[#09090B]">Delete category</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[#52525B]">
            Delete <span className="font-semibold text-[#09090B]">{categoryDeleteTarget?.categoryName}</span> category?
          </p>
          <DialogFooter className="!justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setCategoryDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-[#18181B] text-white"
              onClick={handleDeleteCategory}
              disabled={isDeletingCategory}
            >
              {isDeletingCategory ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
