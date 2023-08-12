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
const seedEl = document.querySelector<HTMLDivElement>(".seed");
const seedHex = document.querySelector<HTMLParagraphElement>('[hex-id = "0"]');
const select = document.querySelector<HTMLSelectElement>("select");
const button = document.querySelector<HTMLButtonElement>("button");
const container = document.querySelector<HTMLDivElement>(".container");

colorInput?.addEventListener("input", function (e) {
    renderSeed(e);
});

if (button) {
    button.addEventListener("click", getColorScheme);
}

let seedColor = "";
let colorScheme: string[] = [];

function renderSeed(e: Event) {
    seedColor = (e.target as HTMLInputElement)?.value;

    if (seedEl && seedHex && container) {
        seedEl.style.backgroundColor = `${seedColor}`;
        container.style.border = `5px solid ${seedColor}`;
        document.documentElement.style.setProperty(
            "--input-focus-color",
            seedColor
        );
        seedHex.innerText = seedColor;
        seedHex.style.color = seedColor;
    }
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
            `[color-id = "${id}"]`
        );
        const hexEl = document.querySelector<HTMLParagraphElement>(
            `[hex-id = "${id}"]`
        );

        if (colorEl && hexEl) {
            colorEl.style.backgroundColor = color;
            hexEl.innerText = color;
            hexEl.style.color = color;
            id++;
        }
    }
}
