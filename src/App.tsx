import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { GlassIconReveal } from "@/components/ui/liquid-glass-logo-reveal";
import InteractiveNebulaShader from "@/components/ui/liquid-shader";

const pub = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

const NAV = [
  ["#about", "О нас"],
  ["#tariffs", "Тарифы"],
  ["#events", "Зал"],
  ["#games", "Игры"],
  ["#menu", "Меню"],
  ["#contacts", "Контакты"],
];

const TITLES = {
  стол: "Забронировать стол",
  время: "Забронировать время",
  мероприятие: "Обсудить мероприятие",
};

const MAP =
  "https://yandex.ru/maps/?text=%D0%A1%D0%B0%D0%BD%D0%BA%D1%82-%D0%9F%D0%B5%D1%82%D0%B5%D1%80%D0%B1%D1%83%D1%80%D0%B3%2C%20%D0%A1%D1%80%D0%B5%D0%B4%D0%BD%D0%B8%D0%B9%20%D0%BF%D1%80%D0%BE%D1%81%D0%BF%D0%B5%D0%BA%D1%82%20%D0%92.%D0%9E.%2C%2027%D0%B1";

const MAP_SCRIPT =
  "https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A3bd39f312118fcf6f4ab3cecbe9a2bebafe8e7666108f8782730b89a2f7c65b4&width=100%25&height=566&lang=ru_RU&scroll=true";

function VenueMap({ cropped = false }: { cropped?: boolean }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = host.current;
    if (!node) return;
    const script = document.createElement("script");
    script.async = true;
    script.charset = "utf-8";
    script.src = MAP_SCRIPT;
    node.appendChild(script);
    return () => {
      node.replaceChildren();
    };
  }, []);

  return (
    <div className={`overflow-hidden rounded-[32px] ${cropped ? "h-[318px]" : "h-[566px]"}`}>
      <div
        ref={host}
        className={
          cropped
            ? "h-[566px] w-[480px] grayscale [&_iframe]:h-[566px] [&_iframe]:w-[480px] [&_iframe]:border-0"
            : "h-full w-[calc(100%+72px)] grayscale [&_iframe]:h-full [&_iframe]:w-full [&_iframe]:border-0"
        }
      />
    </div>
  );
}

type BookKind = keyof typeof TITLES;

const REEL: [string, string, boolean][] = [
  [pub("/Photo/8.webp"), "Гостья River Haze с кальяном", false],
  [pub("/Photo/1.webp"), "Бармен наливает коктейль", true],
  [pub("/Photo/6.webp"), "PlayStation и два геймпада", false],
  [pub("/Photo/3.webp"), "Полка с настольными играми", false],
  [pub("/Photo/7.webp"), "Настольные игры крупным планом", false],
];

const band = "px-4 py-16 md:px-8 md:py-32";

function LinkButton({
  children,
  onClick,
  dim = false,
  className = "",
}: {
  children: ReactNode;
  onClick: () => void;
  dim?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`type-label cursor-pointer border-0 border-b bg-transparent pb-2 ${
        dim ? "border-transparent text-[var(--rh-mute)]" : "border-current"
      } hover:text-heat ${className}`}
    >
      {children}
    </button>
  );
}

function Ticker() {
  return (
    <div className="ticker-track flex w-max">
      {[0, 1].map((i) => (
        <span key={i} className="type-label mute px-4 whitespace-nowrap md:px-0">
          Кальян — PlayStation — Караоке — Настолки — Чай без лимита — До 06:00 —{" "}
        </span>
      ))}
    </div>
  );
}

function Index({ n, label }: { n: string; label: string }) {
  return (
    <p className="type-label mb-4 flex items-baseline gap-4">
      <span>{n}</span>
      <span className="mute">{label}</span>
    </p>
  );
}

const SPLASH_TILE = 360;
const SPLASH_LOGO = 0.72 * 0.955;

function splashLogoPx(width: number, height: number) {
  const tile = Math.min(SPLASH_TILE, Math.min(width, height) / 1.75);
  return SPLASH_LOGO * tile * (80 / 58);
}

function useSplashLogoSize() {
  const [size, setSize] = useState(176);
  useEffect(() => {
    const measure = () => setSize(splashLogoPx(window.innerWidth, window.innerHeight));
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  return size;
}

const NARROW = "(max-width: 53.999rem)";

function useNarrow() {
  const [narrow, setNarrow] = useState(() => window.matchMedia(NARROW).matches);
  useEffect(() => {
    const media = window.matchMedia(NARROW);
    const sync = () => setNarrow(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return narrow;
}

type Fold = "events" | "ps" | "games" | "menu" | "bar";

const FOLD_BY_HASH: Partial<Record<string, Fold>> = {
  "#events": "events",
  "#games": "ps",
  "#menu": "menu",
};

type Shot = { src: string; left: string; top: string; width: string; height: string };

const FULL: Shot = { src: "", left: "0", top: "0", width: "100%", height: "100%" };
const CROP_C: Shot = { src: "/mobile/bubble-c.png", left: "-0.59%", top: "-1.74%", width: "100%", height: "112.45%" };
const CROP_48: Shot = { src: "/mobile/cover-48.png", left: "-6.818%", top: "-6.818%", width: "112.5%", height: "112.5%" };
const CROP_47: Shot = { src: "/mobile/cover-47.png", left: "-18.075%", top: "0", width: "134.94%", height: "104.82%" };
const CROP_50: Shot = { src: "/mobile/cover-50.png", left: "-55.229%", top: "-8.952%", width: "210.03%", height: "118.14%" };

const PS_BUBBLES: { left: number; top: number; size: number; shots: Shot[] }[] = [
  { left: 45, top: 53.81, size: 59, shots: [{ ...FULL, src: "/mobile/bubble-a.png" }] },
  { left: 307, top: 53.81, size: 78, shots: [{ ...FULL, src: "/mobile/bubble-b.png" }] },
  { left: 138, top: 28.81, size: 137, shots: [CROP_C] },
  { left: 281, top: 218.81, size: 88, shots: [CROP_48] },
  { left: 74.5, top: 139.31, size: 53, shots: [CROP_47] },
  { left: 39, top: 227.31, size: 105, shots: [CROP_50] },
  { left: 184, top: 222.81, size: 57, shots: [{ ...FULL, src: "/mobile/bubble-d.png" }] },
];

const BOARD_BUBBLES: { left: number; top: number; size: number; shots: Shot[] }[] = [
  { left: 45, top: 53.81, size: 59, shots: [{ ...FULL, src: "/mobile/bubble-a.png" }] },
  { left: 304, top: 98.81, size: 78, shots: [{ ...FULL, src: "/mobile/bubble-b.png" }] },
  { left: 150, top: 41.81, size: 137, shots: [CROP_C] },
  { left: 281, top: 218.81, size: 88, shots: [CROP_48] },
  { left: 85, top: 151.81, size: 53, shots: [CROP_47] },
  { left: 33, top: 226.81, size: 105, shots: [CROP_50] },
  { left: 184, top: 222.81, size: 57, shots: [{ ...FULL, src: "/mobile/bubble-d.png" }] },
];

function money(value: string) {
  const parts = value.split("₽");
  return parts.map((part, index) => (
    <span key={`${part}-${index}`}>
      {part}
      {index < parts.length - 1 ? <span className="rh-ruble">Р</span> : null}
    </span>
  ));
}

function BubbleField({ bubbles }: { bubbles: typeof PS_BUBBLES }) {
  return (
    <div className="relative h-[360px] w-full overflow-hidden rounded-[32px] border-t border-white/8 bg-white/5">
      {bubbles.map((bubble) => (
        <div
          key={`${bubble.left}-${bubble.top}`}
          className="absolute overflow-hidden rounded-full bg-white"
          style={{
            left: `${(bubble.left / 430) * 100}%`,
            top: `${(bubble.top / 360) * 100}%`,
            width: `${(bubble.size / 430) * 100}%`,
            aspectRatio: "1",
          }}
        >
          {bubble.shots.map((shot) => (
            <img
              key={shot.src}
              src={pub(shot.src)}
              alt=""
              className="absolute max-w-none object-cover"
              style={{ left: shot.left, top: shot.top, width: shot.width, height: shot.height }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function PriceRows({ rows, loose = false }: { rows: [string, string][]; loose?: boolean }) {
  return (
    <div className={`overflow-hidden rounded-[32px] border-t border-white/8 bg-white/5 p-4 ${loose ? "flex flex-col gap-2" : ""}`}>
      {rows.map(([label, value], index) => (
        <div
          key={`${label}-${index}`}
          className={`flex items-center justify-between gap-4 p-4 ${index < rows.length - 1 ? "border-b border-white/8" : ""}`}
        >
          <span className="text-base leading-5 font-medium text-white/40">{label}</span>
          <span className="font-bebas sme-end text-[25px] leading-none whitespace-nowrap text-white">{money(value)}</span>
        </div>
      ))}
    </div>
  );
}

function StoryCard({
  src,
  alt,
  title,
  text,
  fade = "to-black/60",
}: {
  src: string;
  alt: string;
  title: ReactNode;
  text: string;
  fade?: string;
}) {
  return (
    <div className="relative flex h-[520px] w-full flex-col justify-end gap-2.5 overflow-hidden rounded-[32px] px-4 pt-4 pb-6">
      <img src={src} alt={alt} className="absolute inset-0 size-full object-cover" />
      <div className={`absolute inset-0 bg-gradient-to-b from-transparent from-[63%] ${fade}`} />
      <h3 className="font-bebas sme relative text-[36px] leading-none text-white">{title}</h3>
      <p className="relative text-base leading-5 font-medium text-white/40">{text}</p>
    </div>
  );
}

function FoldCard({
  anchor,
  title,
  open,
  onToggle,
  children,
}: {
  anchor?: string;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div id={anchor} className="w-full scroll-mt-16 overflow-hidden rounded-[32px] bg-white/8">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex w-full items-center justify-between p-7 text-left"
      >
        <span className="text-base leading-5 font-medium">{title}</span>
        <img src={pub("/mobile/chevron.svg")} alt="" className={open ? "-scale-y-100" : ""} />
      </button>
      <div
        onClick={open ? onToggle : undefined}
        className={`grid motion-safe:transition-[grid-template-rows] motion-safe:duration-300 ${open ? "cursor-pointer grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-2 rounded-[32px] border border-white/8 p-2">{children}</div>
        </div>
      </div>
    </div>
  );
}

function MobilePage({
  fold,
  onToggle,
}: {
  fold: Fold[];
  onToggle: (id: Fold) => void;
}) {
  return (
    <div className="flex flex-col gap-6 overflow-x-clip">
      <section id="tariffs" className="flex scroll-mt-16 flex-col gap-6 p-4">
        <div className="relative h-[432px] overflow-hidden rounded-[30px]">
          <img src={pub("/mobile/hookah.png")} alt="Гостья River Haze с кальяном" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[52%] to-black/60" />
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="font-bebas sme text-[36px] leading-none text-white">
            Отдыхайте
            <br />
            по своим правилам
          </h2>
          <p className="text-base leading-5 font-medium text-white/40">
            Прозрачная система оплаты. Первый час фиксированный, далее — поминутная тарификация. В тариф уже входит базовый дымный кальян, безлимитный чай и печенье, игры на PlayStation и большая коллекция настольных игр.
          </p>
        </div>
        <div className="overflow-hidden rounded-[32px] border-t border-white/8 bg-white/8">
          {[
            ["Для компании", "от 2 человек", "450 ₽", "первый час · далее 6 ₽ / минута"],
            ["Соло-отдых", "1 человек", "550 ₽", "первый час / чел. · далее 6 ₽ / минута"],
          ].map(([who, whoSub, sum, per], index) => (
            <article key={who} className={`p-6 ${index === 0 ? "border-b border-white/8" : ""}`}>
              <p className="flex items-start justify-between gap-4 text-base leading-5 font-medium">
                {who}
                <span className="text-white/40">{whoSub}</span>
              </p>
              <p className="font-bebas exp pt-4 text-[60px] leading-[64.8px] text-white">{money(sum)}</p>
              <p className="pt-4 text-base leading-5 font-medium text-white/40">{per}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-4 p-1">
        <section id="about" className="relative flex scroll-mt-16 flex-col gap-4 p-4">
          <div className="pointer-events-none absolute top-[-108px] -right-32 flex h-[280px] w-[259px] items-center justify-center">
            <div className="rotate-[22.28deg]">
              <div className="relative h-[225.92px] w-[187.444px]">
                <div className="absolute inset-[-153.5%_-221.53%_-184.46%_-206.32%]">
                  <img src={pub("/mobile/shapes.svg")} alt="" className="block size-full max-w-none" />
                </div>
              </div>
            </div>
          </div>
          <h2 className="font-bebas sme relative pr-16 text-[36px] leading-none text-white">
            Место, где время останавливается,
            <br />
            а отдых начинается
          </h2>
          <p className="relative text-base leading-5 font-medium text-white/40">
            River Haze — это мультиформатное пространство для тех, кто ценит комфорт, свободу и качественный сервис. Мы объединили атмосферу закрытого лаунж-бара и демократичность тайм-кафе.
          </p>
        </section>

        <div className="flex flex-col gap-2">
          <FoldCard anchor="events" title="Караоке комната" open={fold.includes("events")} onToggle={() => onToggle("events")}>
            <StoryCard
              src={pub("/mobile/karaoke.png")}
              alt="Общий зал с диванами и экраном"
              title="Весь зал — только для вашей компании"
              text="Идеальное пространство для дня рождения, корпоратива, турнира по видеоиграм или громкого караоке-вечера без посторонних глаз."
            />
            <PriceRows
              rows={[
                ["1–5 человек", "3 000 ₽ / час"],
                ["6–9 человек", "3 500 ₽ / час"],
                ["10–15 человек", "4 000 ₽ /час"],
              ]}
            />
          </FoldCard>

          <FoldCard anchor="games" title="Play Station 5" open={fold.includes("ps")} onToggle={() => onToggle("ps")}>
            <StoryCard
              src={pub("/mobile/playstation.png")}
              alt="PlayStation и геймпады"
              title={
                <>
                  Скучно не будет
                  <br />
                  никому
                </>
              }
              text="Соберите команду или устройте дуэль один на один. В вашем распоряжении топовые игровые консоли и проверенная временем классика."
            />
            <BubbleField bubbles={PS_BUBBLES} />
          </FoldCard>

          <FoldCard title="Настольные игры" open={fold.includes("games")} onToggle={() => onToggle("games")}>
            <StoryCard
              src={pub("/mobile/board.png")}
              alt="Настольные игры"
              title={
                <>
                  Скучно не будет
                  <br />
                  никому
                </>
              }
              text="Соберите команду или устройте дуэль один на один. В вашем распоряжении топовые игровые консоли и проверенная временем классика."
            />
            <BubbleField bubbles={BOARD_BUBBLES} />
          </FoldCard>

          <FoldCard anchor="menu" title="Еда" open={fold.includes("menu")} onToggle={() => onToggle("menu")}>
            <StoryCard
              src={pub("/mobile/food.png")}
              alt="Хот-дог"
              title="Подкрепиться и освежиться"
              text="Сытный перекус или прохладный напиток — отдельно от тарифа за время."
            />
            <PriceRows
              loose
              rows={[
                ["Пицца", "740 ₽"],
                ["Хот-доги", "350 ₽"],
                ["Начос", "350 ₽"],
                ["Фисташки", "390 ₽"],
                ["Начос", "350 ₽"],
                ["Вяленое мясо", "350 ₽"],
              ]}
            />
          </FoldCard>

          <FoldCard title="Напитки" open={fold.includes("bar")} onToggle={() => onToggle("bar")}>
            <StoryCard
              src={pub("/mobile/drinks.png")}
              alt="Банки крафтового пива"
              title="Бар"
              text="Сытный перекус или прохладный напиток — отдельно от тарифа за время."
              fade="to-black"
            />
            <PriceRows
              loose
              rows={[
                ["Классический лагер", "440 ₽"],
                ["Насыщенный стаут", "440 ₽"],
                ["Ароматный IPA", "440 ₽"],
                ["Освежающий саур-эль", "440 ₽"],
                ["Фирменные лимонады", "250 ₽"],
                ["Cola /  Mountain Dew", "250 ₽"],
              ]}
            />
          </FoldCard>
        </div>
      </div>

      <section id="contacts" className="relative flex h-[498px] scroll-mt-16 flex-col gap-4 overflow-hidden p-4">
        <img src={pub("/mobile/map.png")} alt="" className="absolute inset-0 size-full object-cover object-bottom" />
        <div className="absolute inset-0 bg-gradient-to-b from-black to-50% to-transparent" />
        <address className="font-bebas sme relative text-[25px] leading-none text-white not-italic">
          Санкт-Петербург
          <br />
          Средний проспект В.О., 27б
        </address>
        <p className="relative pt-4 text-base leading-5 font-medium text-white/40">
          5 минут от м. «Василеостровская»
          <br />
          Вс–Чт 13:00–04:00
          <br />
          Пт–Сб 13:00–06:00
        </p>
      </section>
    </div>
  );
}

export default function App() {
  const [menu, setMenu] = useState(false);
  const [book, setBook] = useState<BookKind | null>(null);
  const [done, setDone] = useState("");
  const [intro, setIntro] = useState(true);
  const [shown, setShown] = useState(false);
  const [chrome, setChrome] = useState(false);
  const [fold, setFold] = useState<Fold[]>([]);
  const narrow = useNarrow();
  const logoPx = useSplashLogoSize();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => {
      setIntro(false);
      setShown(true);
    }, reduce ? 600 : 4600);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY >= 1080;
      setChrome(next);
      if (!next) setMenu(false);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu || book || intro ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu, book, intro]);

  function openBook(kind: BookKind) {
    setMenu(false);
    setDone("");
    setBook(kind);
  }

  function toggleFold(id: Fold) {
    setFold((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  return (
    <>
      {intro && (
        <div className="fixed inset-0 z-[80] bg-[#07061a]">
          <GlassIconReveal
            logo={pub("/Logo.svg")}
            look="dark"
            originalColors
            iconPlate={false}
            background="#07061a"
            loop={false}
            label="River Haze"
            tileSize={360}
            className="h-full w-full cursor-default"
          />
        </div>
      )}
      <InteractiveNebulaShader className="z-0" disableCenterDimming />
      <div className="relative z-10">
      <header className={`fixed inset-x-0 top-0 z-50 hidden h-16 grid-cols-3 items-center px-4 transition-opacity duration-500 md:grid md:h-auto md:grid-cols-[auto_1fr_auto] md:gap-8 md:bg-transparent md:px-8 md:py-4 ${chrome ? "md:opacity-100" : "md:pointer-events-none md:opacity-0"}`}>
        <span className="md:hidden" />
        <a href="#top" className="justify-self-center md:justify-self-start" aria-label="River Haze, наверх">
          <img src={pub("/Logo.svg")} alt="" width="80" height="80" className="h-9 w-9 md:h-[46px] md:w-[46px]" />
        </a>
        <nav className="hidden items-center justify-center gap-4 md:flex" aria-label="Разделы">
          {NAV.map(([href, label]) => (
            <a key={href} href={href} className="type-label no-underline">
              {label}
            </a>
          ))}
        </nav>
        <LinkButton onClick={() => openBook("стол")} className="hidden justify-self-end md:inline">
          Забронировать
        </LinkButton>
        <button
          type="button"
          className="type-label justify-self-end bg-transparent md:hidden"
          aria-expanded={menu}
          onClick={() => setMenu((v) => !v)}
        >
          {menu ? "Закрыть" : "Меню"}
        </button>
      </header>

      {menu && (
        <nav className="fixed inset-0 z-40 flex flex-col justify-end bg-ink px-4 pt-16 pb-16 md:hidden" aria-label="Разделы">
          {NAV.map(([href, label]) => (
            <a
              key={href}
              href={href}
              onClick={() => {
                setMenu(false);
                const next = FOLD_BY_HASH[href];
                if (next) setFold((current) => (current.includes(next) ? current : [...current, next]));
              }}
              className="type-title border-t border-white/15 py-4 no-underline"
            >
              {label}
            </a>
          ))}
          <p className="mute mt-8">
            Средний проспект В.О., 27б
            <br />
            Вс–Чт 13:00–04:00 · Пт–Сб 13:00–06:00
          </p>
        </nav>
      )}

      <main id="top">
        <section className="relative min-h-svh">
          {narrow ? (
            <img
              src={pub("/mobile/logo.svg")}
              alt="River Haze"
              className="pointer-events-none absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
            />
          ) : (
            <img
              src={pub("/Logo.svg")}
              alt="River Haze"
              width="80"
              height="80"
              className="logo-neon pointer-events-none absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
              style={{ width: logoPx, height: logoPx }}
            />
          )}
          <div className={`flex min-h-svh flex-col justify-end px-4 pt-16 pb-8 transition-opacity duration-700 md:px-8 md:pb-16 ${shown ? "opacity-100" : "opacity-0"}`}>
          <div className="relative hidden md:block">
            <h1 className="type-display max-w-[12em]">
              место, где время
              <br />
              останавливается,
              <br />
              а отдых начинается
            </h1>
            <div className="mt-8 grid grid-cols-[minmax(0,28rem)_auto] items-end justify-between gap-8 border-t border-[var(--rh-line)] pt-4">
              <p className="mute max-w-xl">
                Уютное лаунж-пространство: дымные кальяны, PlayStation, караоке и настольные игры. Оплата только за время.
              </p>
              <div className="flex items-center gap-8">
                <LinkButton onClick={() => openBook("стол")}>Забронировать стол</LinkButton>
                <a href="#tariffs" className="type-label mute border-b border-transparent pb-2 no-underline">
                  Тарифы
                </a>
              </div>
            </div>
          </div>
          <div className="mx-auto flex w-full max-w-[268px] flex-col gap-4 md:hidden">
            <button
              type="button"
              onClick={() => openBook("стол")}
              className="w-full rounded-[32px] bg-white/8 px-8 py-[26px] text-center text-[25px] leading-none whitespace-nowrap text-white"
            >
              <span className="font-bebas sme-center text-[25px] leading-none">Забронировать</span>
            </button>
            <a
              href={pub("/menu.pdf")}
              target="_blank"
              rel="noopener"
              className="w-full rounded-[32px] px-8 py-[26px] text-center text-[25px] leading-none whitespace-nowrap text-white no-underline"
            >
              <span className="font-bebas sme-center">Посмотреть Меню</span>
            </a>
          </div>
          </div>
        </section>

        <div className={`transition-opacity duration-700 ${shown ? "opacity-100" : "opacity-0"}`}>
        {narrow ? (
          <MobilePage fold={fold} onToggle={toggleFold} />
        ) : (
        <>
        <div className="overflow-hidden border-y border-[var(--rh-line)] py-4" aria-hidden="true">
          <Ticker />
        </div>

        <section id="about" className={`bg-about ${band}`}>
          <Index n="01" label="О нас" />
          <div className="md:grid md:grid-cols-[1.15fr_0.85fr] md:items-end md:gap-16">
            <h2 className="type-display">
              место, где время останавливается, а отдых начинается
            </h2>
            <div className="mute mt-4 flex flex-col gap-4 md:mt-0">
              <p>
                River Haze — это мультиформатное пространство для тех, кто ценит комфорт, свободу и качественный сервис. Мы объединили атмосферу закрытого лаунж-бара и демократичность тайм-кафе.
              </p>
              <p>
                Здесь не нужно переживать о счёте за каждую чашку чая или час игры в приставку — всё главное уже включено в стоимость пребывания. Приходите поработать днём в тишине, собраться с друзьями за партией в настолки или устроить шумную вечеринку до самого утра.
              </p>
            </div>
          </div>
          <div className="mt-8 md:mt-16 md:grid md:grid-cols-[1.3fr_0.7fr] md:items-end md:gap-16">
            <img src={pub("/Photo/4.webp")} alt="Кальян и карточки River Haze Lounge" className="hidden aspect-[16/10] w-full object-cover md:block" />
            <ol className="list-none border-t border-[var(--rh-line)] p-0">
              {[
                ["Без скрытых доплат", "Платите только за проведённое время."],
                ["Всё включено", "От базового кальяна до консолей и угощений."],
                ["Допоздна", "До 04:00 в будни и до 06:00 в выходные."],
              ].map(([title, text]) => (
                <li key={title} className="border-b border-[var(--rh-line)] py-4">
                  <strong className="type-label mb-2 block">{title}</strong>
                  <span className="mute">{text}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-reel" aria-label="Атмосфера">
          <img
            src={pub("/Photo/8.webp")}
            alt="Гостья River Haze с кальяном"
            className="aspect-[4/3] w-full object-cover object-[center_20%] md:hidden"
          />
          <div className="snap-row hidden gap-4 overflow-x-auto px-8 py-16 md:flex">
            {REEL.map(([src, alt, tall]) => (
              <img key={src} src={src} alt={alt} className={`h-[58vh] shrink-0 snap-start object-cover object-[center_30%] ${tall ? "w-[22vw]" : "w-[34vw]"}`} />
            ))}
          </div>
        </section>

        <section id="tariffs" className={`bg-tariffs ${band}`}>
          <Index n="02" label="Тайм-тарифы" />
          <div className="md:grid md:grid-cols-[1.15fr_0.85fr] md:items-end md:gap-16">
            <h2 className="type-display">
              Отдыхайте по своим правилам
            </h2>
            <p className="mute mt-4 md:mt-0">
              Прозрачная система оплаты. Первый час фиксированный, далее — поминутная тарификация.
            </p>
          </div>
          <div className="mt-8 border-t border-[var(--rh-line)] md:mt-16 md:grid md:grid-cols-2">
            {[
              ["Соло-отдых", "1 человек", "450 ₽", "первый час · далее 6 ₽ / минута"],
              ["Для компании", "от 2 человек", "550 ₽", "первый час / чел. · далее 6 ₽ / минута"],
            ].map(([who, whoSub, sum, per], i) => (
              <article key={who} className={`border-b border-[var(--rh-line)] py-8 md:border-b-0 ${i ? "md:border-l md:pl-8" : ""}`}>
                <p className="type-label flex justify-between gap-4">
                  {who}
                  <span className="mute">{whoSub}</span>
                </p>
                <p className="type-price my-4">{sum}</p>
                <p className="mute">{per}</p>
              </article>
            ))}
          </div>
          <p className="mute mt-8 max-w-xl">
            В тариф уже входит базовый дымный кальян, безлимитный чай и печенье, игры на PlayStation и большая коллекция настольных игр.
          </p>
          <LinkButton onClick={() => openBook("время")} className="mt-8">
            Забронировать время
          </LinkButton>
        </section>

        <section id="events" className={`bg-events ${band}`}>
          <Index n="03" label="Аренда зала" />
          <div className="md:grid md:grid-cols-[0.85fr_1.15fr] md:items-end md:gap-16">
            <img src={pub("/Photo/2.webp")} alt="Общий зал с диванами и экраном" className="-mx-4 aspect-[4/5] w-[calc(100%+2rem)] max-w-none object-cover md:mx-0 md:w-full" />
            <div className="mt-8 md:mt-0">
              <h2 className="type-display">
                Весь зал — только для вашей компании
              </h2>
              <p className="mute mt-4 max-w-xl">
                Идеальное пространство для дня рождения, корпоратива, турнира по видеоиграм или громкого караоке-вечера без посторонних глаз.
              </p>
              <ul className="mt-8 list-none p-0">
                {[
                  ["Караоке.", "Любимые хиты на полную громкость."],
                  ["Праздник.", "Свой сценарий корпоратива или дня рождения."],
                  ["Турнир.", "Баттлы на большом экране."],
                ].map(([em, rest]) => (
                  <li key={em} className="border-t border-[var(--rh-line)] py-4">
                    {em} {rest}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-[var(--rh-line)] pt-4 md:mt-16 md:grid md:grid-cols-[1.2fr_repeat(3,1fr)] md:items-end md:gap-8">
            <p className="mute mb-4 md:mb-0">Час закрытого зала. Внутри кальяны, чай и печенье.</p>
            {[
              ["1–5", "3 000 ₽"],
              ["6–9", "3 500 ₽"],
              ["10–15", "4 000 ₽"],
            ].map(([guests, price]) => (
              <div key={guests} className="flex items-baseline justify-between border-b border-[var(--rh-line)] py-4 md:block md:border-0 md:py-0">
                <span className="type-label mute">{guests}</span>
                <strong className="type-title block font-normal">{price}</strong>
              </div>
            ))}
          </div>
          <LinkButton onClick={() => openBook("мероприятие")} className="mt-8">
            Обсудить мероприятие
          </LinkButton>
        </section>

        <section id="games" className={`bg-games ${band}`}>
          <Index n="04" label="Игротека" />
          <h2 className="type-display max-w-[12ch]">
            Скучно не будет никому
          </h2>
          <p className="mute mt-4 max-w-xl">
            Соберите команду или устройте дуэль один на один. В вашем распоряжении топовые игровые консоли и проверенная временем классика.
          </p>
          <div className="mt-8 flex flex-col gap-16 md:hidden">
            {[
              [pub("/Photo/6.webp"), "PlayStation", "Актуальные хиты (FIFA, Mortal Kombat, UFC и другие) на больших экранах с отличным звуком.", "Экран с EA FC 24 и геймпады PlayStation"],
              [pub("/Photo/3.webp"), "Настольные игры", "От быстрых пати-геймов («Бункер», «Мафия», «Уно») до глубоких стратегий на всю ночь.", "Стеллаж с настольными играми: Бункер, Alias, Манчкин"],
            ].map(([src, title, text, alt]) => (
              <article key={title}>
                <img src={src} alt={alt} className="-mx-4 aspect-[4/5] w-[calc(100%+2rem)] max-w-none object-cover" />
                <h3 className="type-title mt-4">{title}</h3>
                <p className="mute mt-4">{text}</p>
              </article>
            ))}
          </div>
          <div className="mt-16 hidden md:grid md:grid-cols-[1.25fr_0.75fr] md:items-end md:gap-x-8 md:gap-y-4">
            <img src={pub("/Photo/6.webp")} alt="Экран с EA FC 24 и геймпады PlayStation" className="aspect-[16/10] w-full object-cover" />
            <div>
              <h3 className="type-title">PlayStation</h3>
              <p className="mute mt-4">Актуальные хиты (FIFA, Mortal Kombat, UFC и другие) на больших экранах с отличным звуком.</p>
            </div>
            <div>
              <h3 className="type-title">Настольные игры</h3>
              <p className="mute mt-4">От быстрых пати-геймов («Бункер», «Мафия», «Уно») до глубоких стратегий на всю ночь.</p>
            </div>
            <img src={pub("/Photo/3.webp")} alt="Стеллаж с настольными играми: Бункер, Alias, Манчкин" className="-mt-16 aspect-[4/5] w-full object-cover" />
          </div>
        </section>

        <section id="menu" className={`bg-menu ${band}`}>
          <Index n="05" label="Кухня и бар" />
          <div className="md:grid md:grid-cols-[1.15fr_0.85fr] md:items-end md:gap-16">
            <h2 className="type-display">
              Подкрепиться и освежиться
            </h2>
            <p className="mute mt-4 md:mt-0">Сытный перекус или прохладный напиток — отдельно от тарифа за время.</p>
          </div>
          <div className="mt-8 md:mt-16 md:grid md:grid-cols-[1fr_1fr_0.8fr] md:items-start md:gap-16">
            <img
              src={pub("/Photo/5.webp")}
              alt="Банки крафтового пива в холодильнике"
              className="-mx-4 mb-8 aspect-[3/4] w-[calc(100%+2rem)] max-w-none object-cover object-[center_20%] md:order-3 md:mx-0 md:mb-0 md:w-full"
            />
            <MenuColumn
              title="Кухня"
              groups={[
                ["Горячее", [["Пицца", "740 ₽"], ["Хот-доги", "350 ₽"]]],
                ["Закуски", [["Начос", "350 ₽"], ["Фисташки", "390 ₽"], ["Вяленое мясо", "390 ₽"], ["Арахис", "уточняйте"]]],
              ]}
            />
            <MenuColumn
              title="Бар"
              groups={[
                ["Пенное", [["Классический лагер"], ["Насыщенный стаут"], ["Ароматный IPA"], ["Освежающий саур-эль"]]],
                ["Безалкогольное", [["Фирменные лимонады"], ["Cola"], ["Mountain Dew"]]],
              ]}
            />
          </div>
        </section>

        <section id="contacts" className={`bg-contacts ${band}`}>
          <Index n="06" label="Контакты" />
          <h2 className="type-display max-w-[10ch]">
            Ждём вас в гости
          </h2>
          <address className="type-title mt-8 not-italic">
            Санкт-Петербург
            <br />
            Средний проспект В.О., 27б
          </address>
          <p className="mute mt-4 mb-8">
            5 минут от м. «Василеостровская»
            <br />
            Вс–Чт 13:00–04:00
            <br />
            Пт–Сб 13:00–06:00
          </p>
          <VenueMap />
          <div className="mt-8 flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-8">
            <a href={MAP} target="_blank" rel="noopener" className="type-label border-b border-current pb-2 no-underline">
              Построить маршрут
            </a>
            <LinkButton onClick={() => openBook("стол")}>Забронировать стол</LinkButton>
          </div>
        </section>
        </>
        )}
        </div>
      </main>

      {book && (
        <BookModal
          kind={book}
          done={done}
          onClose={() => setBook(null)}
          onDone={setDone}
        />
      )}
      </div>
    </>
  );
}

function MenuColumn({
  title,
  groups,
}: {
  title: string;
  groups: [string, [string, string?][]][];
}) {
  return (
    <div>
      <h3 className="type-title">{title}</h3>
      {groups.map(([label, items]) => (
        <div key={label}>
          <p className="type-label mute mt-8 mb-4">{label}</p>
          <ul className="list-none p-0">
            {items.map(([name, price]) => (
              <li key={name} className="flex justify-between gap-4 border-b border-[var(--rh-line)] py-4">
                <span>{name}</span>
                {price && <span className="mute">{price}</span>}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function BookModal({
  kind,
  done,
  onClose,
  onDone,
}: {
  kind: BookKind;
  done: string;
  onClose: () => void;
  onDone: (summary: string) => void;
}) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const summary = [
      TITLES[kind],
      data.get("name"),
      data.get("phone"),
      data.get("date"),
      `гостей: ${data.get("guests")}`,
      data.get("note") || "",
    ]
      .filter(Boolean)
      .join(" · ");
    onDone(`Заявка на экране: ${summary}`);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end bg-black/70 md:items-center md:justify-center" role="presentation" onClick={onClose}>
      <form
        role="dialog"
        aria-labelledby="book-title"
        onClick={(event) => event.stopPropagation()}
        onSubmit={submit}
        className="max-h-[92svh] w-full overflow-auto bg-paper p-4 text-ink md:w-[440px] md:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="book-title" className="type-title">
            {TITLES[kind]}
          </h2>
          <button type="button" onClick={onClose} className="type-label bg-transparent">
            Закрыть
          </button>
        </div>
        {done ? (
          <p className="mt-8">{done}</p>
        ) : (
          <>
            <p className="mt-4 mb-8 text-[#6d675f]">Оставьте контакты — перезвоним и подтвердим время.</p>
            <Field label="Имя">
              <input name="name" required autoComplete="name" className="field" />
            </Field>
            <Field label="Телефон">
              <input name="phone" required autoComplete="tel" inputMode="tel" placeholder="+7" className="field" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Дата">
                <input name="date" type="date" required className="field" />
              </Field>
              <Field label="Гостей">
                <select name="guests" defaultValue="2–4" className="field">
                  <option>1</option>
                  <option>2–4</option>
                  <option>5–9</option>
                  <option>10–15</option>
                </select>
              </Field>
            </div>
            <Field label="Комментарий">
              <textarea name="note" rows={3} className="field" />
            </Field>
            <button type="submit" className="type-label mt-8 w-full bg-ink py-4 text-paper">
              Отправить заявку
            </button>
            <p className="mt-4 text-[#6d675f]">Номера для связи пока нет — заявка останется на этом экране.</p>
          </>
        )}
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="type-label mb-4 block">
      {label}
      {children}
    </label>
  );
}
