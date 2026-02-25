import Image from "next/image";
import SaladImage from "../../_components/images/Salad-3.png";

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path d="M6 1V11M1 6H11" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="10" viewBox="0 0 13 10" fill="none">
    <path
      d="M11.6667 1L4.33333 8.33333L1 5"
      stroke="#E4E4E7"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Submenu = ({ title, dishes = [], onSelectDish, cartItemIds = [] }) => {
  const visibleDishes = dishes.slice(0, 6);

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-[#18181b]">{title}</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleDishes.map((dish) => (
          <article
            key={`${title}-${dish._id || dish.foodName}`}
            className="cursor-pointer rounded-3xl border border-[#e4e4e7] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            onClick={() => onSelectDish?.(dish)}
          >
            <div className="relative overflow-hidden rounded-2xl">
              <Image
                src={dish.image || SaladImage}
                alt={dish.foodName || "Dish"}
                width={700}
                height={400}
                className="h-[180px] w-full object-cover"
                unoptimized={Boolean(dish.image)}
              />
              <button
                type="button"
                className={`absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full shadow-md transition ${
                  cartItemIds.includes(dish._id)
                    ? "bg-[#18181B]"
                    : "bg-white hover:bg-[#f4f4f5]"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectDish?.(dish);
                }}
              >
                {cartItemIds.includes(dish._id) ? <CheckIcon /> : <PlusIcon />}
              </button>
            </div>

            <div className="mt-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base font-semibold text-[#18181b]">{dish.foodName}</h3>
                <span className="text-sm font-semibold text-[#ef4444]">${dish.price}</span>
              </div>
              <p className="mt-2 text-sm text-[#71717a]">{dish.ingredients}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
