// Crops an image file to a centered square and shrinks it, returning a JPEG data URL.
// Keeps profile photos small enough to store directly in a Firestore document.
export async function resizeImageToDataUrl(file: File, size = 256, quality = 0.85): Promise<string> {
  const bitmap = await createImageBitmap(file).catch(() => {
    throw new Error("This file isn't an image the browser can read.");
  });
  const side = Math.min(bitmap.width, bitmap.height);
  const canvas = document.createElement("canvas");

  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not process the image.");

  context.drawImage(bitmap, (bitmap.width - side) / 2, (bitmap.height - side) / 2, side, side, 0, 0, size, size);
  bitmap.close();

  return canvas.toDataURL("image/jpeg", quality);
}
