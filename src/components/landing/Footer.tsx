import { scrollToId } from "@/lib/smoothScroll";

const links = [
  { label: "Bakes", id: "bakes" },
  { label: "About", id: "about" },
  { label: "News", id: "news" },
  { label: "Contact", id: "contact" },
];

export function Footer() {
  return (
    <footer id="contact" className="pb-6 pt-[120px] lg:pt-[222px]">
      <div className="grid gap-10 lg:grid-cols-[284px_1fr_500px] lg:gap-0">
        <nav className="font-dm space-y-[14px] text-2xl font-bold leading-[31px]">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollToId(l.id)}
              className="block"
              data-cursor="focus"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="font-dm space-y-4 text-base leading-[1.2] text-greyText">
          <div>
            <p className="text-2xl font-bold leading-[1.2] text-deep">/Contact Info</p>
            <p className="mt-2">hello@bakeat.com</p>
            <p>+44 20 1234 5678</p>
          </div>
          <div>
            <p className="text-2xl font-bold leading-[1.2] text-deep">/Address</p>
            <p className="mt-2">21 Bloomsbury Way, WC1A 2TH</p>
          </div>
          <div>
            <p className="text-2xl font-bold leading-[1.2] text-deep">/Time</p>
            <p className="mt-2">Wed-Sun: 8 a.m. - 4 p.m.</p>
            <p>Mon-Tue: CLOSED</p>
          </div>
        </div>

        <img
          src="https://github.com/Kbelony/DK-Shop/blob/main/src/assets/scss/_DSC1423.jpg?raw=true"
          alt=""
          className="h-[300px] w-full object-cover"
        />
      </div>

      <div className="font-dm mt-6 grid grid-cols-2 gap-y-4 text-xs uppercase text-greyText lg:grid-cols-[284px_1fr_500px_auto]">
        <div className="col-span-2 flex gap-6 lg:col-span-1">
          <a href="#">Instagram</a>
          <a href="#">Newsletter</a>
        </div>
        <span className="hidden lg:block" />
        <span>© {new Date().getFullYear()} DK-Shop</span>
        <button
          onClick={() => scrollToId("top")}
          className="justify-self-end uppercase"
          data-cursor="focus"
        >
          Back to top
        </button>
      </div>
    </footer>
  );
}
