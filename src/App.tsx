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

type Fold = "events" | "games" | "menu" | "bar";

const FOLD_BY_HASH: Partial<Record<string, Fold>> = {
  "#events": "events",
  "#games": "games",
  "#menu": "menu",
};

function Chevron({ up }: { up: boolean }) {
  return (
    <img src={pub("/chevron.svg")} alt="" width={29} height={16} className={up ? "-scale-y-100" : ""} />
  );
}

function PriceCard({ rows }: { rows: [string, string][] }) {
  return (
    <div className="overflow-hidden rounded-[32px] border-t border-white/16 bg-white/10">
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-center justify-between gap-4 border-b border-white/16 p-4">
          <span className="type-label mute">{label}</span>
          <span className="type-title text-right">{value}</span>
        </div>
      ))}
    </div>
  );
}

function FoldRow({
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
    <div id={anchor} className="scroll-mt-16">
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex h-[76px] w-full items-center justify-between border-b border-white/16 py-[26px] pr-8 pl-6 text-left text-base uppercase"
      >
        {title}
        <Chevron up={open} />
      </button>
      <div className={`grid motion-safe:transition-[grid-template-rows] motion-safe:duration-300 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="flex flex-col gap-4 p-4">{children}</div>
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
    <>
      <section id="tariffs" className="flex scroll-mt-16 flex-col gap-8 px-4 pt-4 pb-12">
        <div className="flex flex-col gap-4 py-4">
          <h2 className="type-display">
            Отдыхайте
            <br />
            по своим
            <br />
            правилам
          </h2>
          <p className="mute">
            Прозрачная система оплаты. Первый час фиксированный, далее — поминутная тарификация. В тариф уже входит базовый дымный кальян, безлимитный чай и печенье, игры на PlayStation и большая коллекция настольных игр.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <img
            src={pub("/Photo/8.webp")}
            alt="Гостья River Haze с кальяном"
            className="h-[272px] w-full rounded-[32px] object-cover object-[center_20%]"
          />
          <div className="overflow-hidden rounded-[32px] border-t border-white/16 bg-white/10">
            {[
              ["Соло-отдых", "1 человек", "450 ₽", "первый час · далее 6 ₽ / минута"],
              ["Для компании", "от 2 человек", "550 ₽", "первый час / чел. · далее 6 ₽ / минута"],
            ].map(([who, whoSub, sum, per]) => (
              <article key={who} className="border-b border-white/16 px-6 py-8">
                <p className="type-label flex justify-between gap-4">
                  {who}
                  <span className="mute">{whoSub}</span>
                </p>
                <p className="type-price my-4">{sum}</p>
                <p className="mute">{per}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="relative flex scroll-mt-16 flex-col gap-4 p-4">
        <img
          src={pub("/shapes.svg")}
          alt=""
          width={297.221}
          height={221.987}
          className="pointer-events-none absolute top-[-90px] left-[183px]"
        />
        <h2 className="type-display">
          Место,
          <br />
          где время останавливается,
          <br />
          а отдых начинается
        </h2>
        <p className="mute">
          River Haze — это мультиформатное пространство для тех, кто ценит комфорт, свободу и качественный сервис. Мы объединили атмосферу закрытого лаунж-бара и демократичность тайм-кафе.
        </p>
      </section>

      <div className="p-4">
        <div className="flex flex-col gap-1 overflow-hidden rounded-[32px] bg-white/10">
        <FoldRow anchor="events" title="Караоке комната" open={fold.includes("events")} onToggle={() => onToggle("events")}>
          <img
            src={pub("/Photo/2.webp")}
            alt="Общий зал с диванами и экраном"
            className="h-[432px] w-full rounded-[32px] object-cover"
          />
          <h2 className="type-display">Весь зал — только для вашей компании</h2>
          <p className="mute">
            Идеальное пространство для дня рождения, корпоратива, турнира по видеоиграм или громкого караоке-вечера без посторонних глаз.
          </p>
          <PriceCard
            rows={[
              ["1–5 человек", "3 000 ₽ / час"],
              ["6–9 человек", "3 500 ₽ / час"],
              ["10–15 человек", "4 000 ₽ / час"],
            ]}
          />
        </FoldRow>

        <FoldRow anchor="games" title="Игровая зона" open={fold.includes("games")} onToggle={() => onToggle("games")}>
          <div className="snap-row flex gap-2.5 overflow-x-auto">
            {[
              [pub("/Photo/6.webp"), "Экран с EA FC 24 и геймпады PlayStation"],
              [pub("/Photo/3.webp"), "Стеллаж с настольными играми: Бункер, Alias, Манчкин"],
            ].map(([src, alt]) => (
              <img key={src} src={src} alt={alt} className="aspect-square w-full shrink-0 snap-start rounded-[30px] object-cover" />
            ))}
          </div>
          <h2 className="type-display">Скучно не будет никому</h2>
          <p className="mute">
            Соберите команду или устройте дуэль один на один. В вашем распоряжении топовые игровые консоли и проверенная временем классика.
          </p>
          <div className="rounded-[32px] bg-white/10">
            {[
              ["PlayStation", "Актуальные хиты (FIFA, Mortal Kombat, UFC и другие) на больших экранах с отличным звуком."],
              ["Настольные игры", "От быстрых пати-геймов («Бункер», «Мафия», «Уно») до глубоких стратегий на всю ночь."],
            ].map(([title, text]) => (
              <div key={title} className="flex flex-col gap-4 p-4">
                <h3 className="type-title">{title}</h3>
                <p className="mute">{text}</p>
              </div>
            ))}
          </div>
        </FoldRow>

        <FoldRow anchor="menu" title="Еда" open={fold.includes("menu")} onToggle={() => onToggle("menu")}>
          <img
            src={pub("/Photo/5.webp")}
            alt="Банки крафтового пива в холодильнике"
            className="aspect-square w-full rounded-[32px] object-cover object-[center_20%]"
          />
          <h2 className="type-display">Подкрепиться и освежиться</h2>
          <p className="mute">Сытный перекус или прохладный напиток — отдельно от тарифа за время.</p>
          <PriceCard
            rows={[
              ["Пицца", "740 ₽"],
              ["Хот-доги", "350 ₽"],
              ["Начос", "350 ₽"],
              ["Фисташки", "390 ₽"],
              ["Вяленое мясо", "390 ₽"],
              ["Арахис", "уточняйте"],
            ]}
          />
        </FoldRow>

        <FoldRow title="Напитки" open={fold.includes("bar")} onToggle={() => onToggle("bar")}>
          <img
            src={pub("/Photo/1.webp")}
            alt="Бармен наливает коктейль"
            className="aspect-square w-full rounded-[32px] object-cover"
          />
          <h2 className="type-display">Бар</h2>
          <p className="mute">Сытный перекус или прохладный напиток — отдельно от тарифа за время.</p>
          <div className="overflow-hidden rounded-[32px] border-t border-white/16 bg-white/10">
            {["Классический лагер", "Насыщенный стаут", "Ароматный IPA", "Освежающий саур-эль", "Фирменные лимонады", "Cola", "Mountain Dew"].map((name) => (
              <p key={name} className="type-label mute border-b border-white/16 p-4">
                {name}
              </p>
            ))}
          </div>
        </FoldRow>
        </div>
      </div>

      <section id="contacts" className="flex scroll-mt-16 flex-col gap-4 p-4">
        <VenueMap cropped />
        <address className="font-serif text-2xl leading-[33.6px] tracking-[-0.96px] not-italic">
          Санкт-Петербург
          <br />
          Средний проспект В.О., 27б
        </address>
        <p className="mute">
          5 минут от м. «Василеостровская»
          <br />
          Вс–Чт 13:00–04:00
          <br />
          Пт–Сб 13:00–06:00
        </p>
        <a href={MAP} target="_blank" rel="noopener" className="type-label w-fit border-b border-current pb-2 no-underline">
          Построить маршрут
        </a>
      </section>
    </>
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
      <header className={`fixed inset-x-0 top-0 z-50 grid h-16 grid-cols-3 items-center px-4 transition-opacity duration-500 md:h-auto md:grid-cols-[auto_1fr_auto] md:gap-8 md:bg-transparent md:px-8 md:py-4 ${chrome ? "opacity-100" : "pointer-events-none opacity-0"}`}>
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
          <img
            src={pub("/Logo.svg")}
            alt="River Haze"
            width="80"
            height="80"
            className="logo-neon pointer-events-none absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
            style={{ width: logoPx, height: logoPx }}
          />
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
          <div className="flex flex-col items-center gap-4 md:hidden">
            <button
              type="button"
              onClick={() => openBook("стол")}
              className="rounded-[32px] border border-white/25 bg-white/10 px-8 py-4 text-center text-sm leading-6 tracking-[1px] uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-xl backdrop-saturate-150"
            >
              Забронировать
            </button>
            <a
              href={pub("/menu.pdf")}
              target="_blank"
              rel="noopener"
              className="rounded-[32px] px-8 py-4 text-center text-sm leading-[18.72px] tracking-[1.5px] text-[rgba(244,241,234,0.6)] uppercase no-underline"
            >
              Посмотреть Меню
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
