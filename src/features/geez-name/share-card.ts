import { tibebBand } from "@/components/culture/tibeb";

// Draws the name card as a 1080×1350 picture (the shape Instagram and iMessage show best),
// for sharing or saving. Drawn on a canvas in the visitor's browser; nothing is uploaded.

const WIDTH = 1080;
const HEIGHT = 1350;
const BAND_SCALE = 4;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

// The largest font size (up to `max`) at which `text` fits in `maxWidth`.
function fitFont(context: CanvasRenderingContext2D, text: string, weight: number, max: number, maxWidth: number) {
  let size = max;
  do {
    context.font = `${weight} ${size}px -apple-system, BlinkMacSystemFont, system-ui, sans-serif`;
    size -= 4;
  } while (context.measureText(text).width > maxWidth && size > 24);
}

export async function drawNameCard(geezName: string, typedName: string): Promise<Blob | null> {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context = canvas.getContext("2d");
  if (!context) return null;

  // Use the site's current theme colours.
  const styles = getComputedStyle(document.documentElement);
  const paper = styles.getPropertyValue("--surface").trim() || "#fffdf8";
  const ink = styles.getPropertyValue("--foreground").trim() || "#1c150d";

  context.fillStyle = paper;
  context.fillRect(0, 0, WIDTH, HEIGHT);

  // A tibeb band along the top and the bottom, like the edge of a netela.
  const band = await loadImage(tibebBand.src);
  const bandWidth = tibebBand.width * BAND_SCALE;
  const bandHeight = tibebBand.height * BAND_SCALE;
  context.imageSmoothingEnabled = false;
  for (let x = 0; x < WIDTH; x += bandWidth) {
    context.drawImage(band, x, 90, bandWidth, bandHeight);
    context.drawImage(band, x, HEIGHT - 90 - bandHeight, bandWidth, bandHeight);
  }

  context.fillStyle = ink;
  context.textAlign = "center";
  context.textBaseline = "middle";

  fitFont(context, geezName, 600, 230, WIDTH - 160);
  context.fillText(geezName, WIDTH / 2, HEIGHT / 2 - 50);

  context.globalAlpha = 0.6;
  fitFont(context, typedName, 400, 64, WIDTH - 200);
  context.fillText(typedName, WIDTH / 2, HEIGHT / 2 + 120);

  context.font = "500 34px -apple-system, BlinkMacSystemFont, system-ui, sans-serif";
  context.fillText("My name in Ge'ez · yakobgetu.com", WIDTH / 2, HEIGHT - 90 - bandHeight - 70);

  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}
