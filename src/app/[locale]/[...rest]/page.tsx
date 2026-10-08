import { notFound } from "next/navigation";

// Sends unknown URLs like /ar/does-not-exist to the localized not-found page.
export default function CatchAll() {
  notFound();
}
