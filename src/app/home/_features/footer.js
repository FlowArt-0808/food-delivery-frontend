import Facebook from "@/app/_components/icons/Facebook";
import Instagram from "@/app/_components/icons/Instagram";

const Footer = () => {
  return (
    <footer className="w-full bg-[#18181b] text-white">
      <div className="overflow-hidden bg-[#ef4444] py-4">
        <p className="whitespace-nowrap text-center text-sm font-medium tracking-wide sm:text-base">
          Fresh fast delivered - Fresh fast delivered - Fresh fast delivered - Fresh fast delivered
        </p>
      </div>

      <div className="mx-auto w-full max-w-[1440px] px-4 pb-12 pt-12 sm:px-8 lg:px-[88px]">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_3fr]">
          <div>
            <p className="text-2xl font-semibold leading-none">
              Nom<span className="text-[#ef4444]">Nom</span>
            </p>
            <p className="mt-2 text-sm text-[#a1a1aa]">Swift delivery</p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-4">
            <div className="space-y-3">
              <p className="text-xs font-medium tracking-wide text-[#71717a]">NOMNOM</p>
              <p className="text-[#fafafa]">Home</p>
              <p className="text-[#fafafa]">Contact us</p>
              <p className="text-[#fafafa]">Delivery zone</p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-medium tracking-wide text-[#71717a]">MENU</p>
              <p className="text-[#fafafa]">Appetizers</p>
              <p className="text-[#fafafa]">Salads</p>
              <p className="text-[#fafafa]">Pizzas</p>
              <p className="text-[#fafafa]">Main dishes</p>
            </div>

            <div className="space-y-3 pt-6 sm:pt-0">
              <p className="text-[#fafafa]">Side dish</p>
              <p className="text-[#fafafa]">Brunch</p>
              <p className="text-[#fafafa]">Desserts</p>
              <p className="text-[#fafafa]">Beverages</p>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-medium tracking-wide text-[#71717a]">FOLLOW US</p>
              <div className="flex gap-4">
                <Facebook />
                <Instagram />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[#3f3f46] pt-6 text-xs text-[#71717a] sm:text-sm">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <p>Copy Right 2024 @ Nomnom LLC</p>
            <p>Privacy policy</p>
            <p>Terms and condition</p>
            <p>Cookie policy</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
