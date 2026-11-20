import { showToast } from "@/components/ui/toast";

export const EMAIL_ADDRESS = "ygetu21@gmail.com";

// Copies the address and says so. If the browser blocks the clipboard, the address is shown instead.
export async function copyEmail() {
  try {
    await navigator.clipboard.writeText(EMAIL_ADDRESS);
    showToast("Email copied");
  } catch {
    showToast(EMAIL_ADDRESS);
  }
}
