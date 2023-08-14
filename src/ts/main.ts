interface HexColor {
    value: string;
}

interface Color {
    hex: HexColor;
}

interface ColorApiResponse {
    colors: Color[];
}

const colorInput = document.querySelector<HTMLInputElement>(".color-input");
const colorContainers: NodeListOf<HTMLDivElement> | null =
    document.querySelectorAll<HTMLDivElement>(".color-container");

const seedEl = document.querySelector<HTMLDivElement>(".seed");
const seedHex = document.querySelector<HTMLParagraphElement>(
    'p.hex-code[data-id = "0"]'
);

const select = document.querySelector<HTMLSelectElement>("select");
const button = document.querySelector<HTMLButtonElement>("button");
const appContainer = document.querySelector<HTMLDivElement>(".app-container");

let seedColor = "";
let copiedCode: string | null = "";
let colorScheme: string[] = [];

colorInput?.addEventListener("input", function (e) {
    renderSeedColor(e);
});

if (button) {
    button.addEventListener("click", getColorScheme);
}

if (colorContainers) {
    colorContainers.forEach((container) => {
        container.style.cursor = "pointer";
        container.addEventListener("click", function (e: MouseEvent) {
            copiedCode = getColorCode(e);
            const copiedText =
                document.querySelector<HTMLParagraphElement>(".copied-text");
            const copiedContainer =
                document.querySelector<HTMLDivElement>(".copied-container");

            if (appContainer) {
                appContainer.style.border = `5px solid ${copiedCode}`;
            }

            if (copiedCode && copiedText && copiedContainer) {
                navigator.clipboard.writeText(copiedCode).then(() => {
                    document.documentElement.style.setProperty(
                        "--copied-color",
                        copiedCode
                    );
                    copiedContainer.style.display = "block";
                    copiedText.innerText = `Copied ${copiedCode}`;
                });
            }
        });
    });
}

function renderSeedColor(e: Event) {
    seedColor = (e.target as HTMLInputElement)?.value;

    if (seedEl && seedHex) {
        seedEl.style.backgroundColor = `${seedColor}`;
        document.documentElement.style.setProperty(
            "--input-focus-color",
            seedColor
        );
        seedHex.innerText = seedColor;
    }
}

function getColorCode(e: MouseEvent) {
    const target = e.target;

    if (target) {
        const targetEl = document.querySelector(
            `p.hex-code[data-id = "${(target as HTMLDivElement).dataset.id}"]`
        );
        return (targetEl as HTMLElement)?.textContent ?? null;
    }

    return null;
}

function getColorScheme() {
    const cleanSeed = seedColor.slice(1);
    const scheme = select?.value;
    colorScheme = [];

    fetch(
        `https://www.thecolorapi.com/scheme?hex=${cleanSeed}&mode=${scheme}&count=4`
    )
        .then((res) => {
            if (!res.ok) throw new Error(res.statusText);
            return res.json();
        })
        .then((data: ColorApiResponse) =>
            data.colors.forEach((color: Color) => {
                colorScheme.push(color.hex.value);
            })
        )
        .then(renderColorScheme)
        .catch((error) => {
            console.error(error);
        });
}

function renderColorScheme() {
    let id = 1;

    for (const color of colorScheme) {
        const colorEl = document.querySelector<HTMLDivElement>(
            `div.color[data-id = "${id}"]`
        );
        const hexEl = document.querySelector<HTMLParagraphElement>(
            `p.hex-code[data-id = "${id}"]`
        );

        if (colorEl && hexEl) {
            colorEl.style.backgroundColor = color;
            hexEl.innerText = color;
            id++;
        }
    }
}
