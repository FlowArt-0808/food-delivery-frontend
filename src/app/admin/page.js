"use client";

import { FoodMenu } from "./_features/foodmenu";
import { Order } from "./_features/order";
import { useRouter } from "next/navigation";
import { useAdminContext } from "../_provider/adminProvider";
import NomNomLogoRed from "@/app/_components/icons/NomNomLogoRed";

const FoodMenuIcon = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const OrdersIcon = ({ className = "h-6 w-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className={className}>
    <path
      d="M3 6.5H13V16.5H3V6.5ZM13 9.5H17L20.5 12.5V16.5H13V9.5Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <circle cx="7" cy="17.8" r="1.8" stroke="currentColor" strokeWidth="1.8" />
    <circle cx="16.8" cy="17.8" r="1.8" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const Admin = () => {
  const { setOrderMenu, setFoodMenu, orderMenu, foodMenu } = useAdminContext();

  const router = useRouter();
  const goToHomePage = () => {
    router.push("/home");
  };

  const activateFoodMenu = () => {
    setFoodMenu(true);
    setOrderMenu(false);
  };

  const activateOrderMenu = () => {
    setOrderMenu(true);
    setFoodMenu(false);
  };

  return (
    <div className="relative flex min-h-screen w-full bg-[#E4E4E5]">
      <aside
        aria-label="Navigation"
        className="flex w-[280px] shrink-0 flex-col border-r border-[#D4D4D8] bg-[#F4F4F5] px-10 py-8"
      >
        <button
          type="button"
          aria-label="Logo and Slogan section"
          className="flex w-full cursor-pointer items-center gap-3 text-left"
          onClick={goToHomePage}
        >
          <NomNomLogoRed className="h-[38px] w-[46px] shrink-0" />
          <div aria-label="Logo name and Slogan" className="flex flex-col">
            <p className="text-[20px] font-semibold leading-none text-[#18181B]">
              Nom<span className="text-[#EF4444]">Nom</span>
            </p>
            <p className="mt-1 text-[12px] font-normal leading-none text-[#71717A]">Swift delivery</p>
          </div>
        </button>

        <nav className="mt-12 flex w-full flex-col gap-4">
          <button
            type="button"
            aria-label="Food Menu"
            className={`flex h-14 w-full cursor-pointer items-center gap-4 rounded-full px-5 text-left text-[18px] font-medium ${
              foodMenu && !orderMenu
                ? "bg-[#18181B] text-white"
                : "text-[#18181B] hover:bg-[#E4E4E7]"
            }`}
            onClick={activateFoodMenu}
          >
            <FoodMenuIcon className="h-6 w-6 shrink-0" />
            <span>Food menu</span>
          </button>

          <button
            type="button"
            aria-label="Orders of users"
            className={`flex h-14 w-full cursor-pointer items-center gap-4 rounded-full px-5 text-left text-[18px] font-medium ${
              orderMenu && !foodMenu
                ? "bg-[#18181B] text-white"
                : "text-[#18181B] hover:bg-[#E4E4E7]"
            }`}
            onClick={activateOrderMenu}
          >
            <OrdersIcon className="h-6 w-6 shrink-0" />
            <span>Orders</span>
          </button>
        </nav>
      </aside>

      <main className="min-w-0 flex-1">
        {foodMenu && !orderMenu && <FoodMenu />}
        {orderMenu && !foodMenu && <Order />}
      </main>
    </div>
  );
};

export default Admin;
