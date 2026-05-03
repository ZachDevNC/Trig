import { NextResponse } from "next/server";
import type { Quote } from "@/lib/types";

// For v1 the submit endpoint just logs the quote on the server.
// Wire this up to one of:
//   - SMTP / Resend / Postmark (email to a fixed showroom address)
//   - Google Apps Script webhook (append a row to a Sheet)
//   - Airtable API (create a record in a "Quotes" table)
// All of those are a few lines once we pick one.
export async function POST(req: Request) {
  let quote: Quote;
  try {
    quote = (await req.json()) as Quote;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!quote.client?.trim()) {
    return NextResponse.json({ ok: false, error: "Client name is required" }, { status: 400 });
  }
  if (!Array.isArray(quote.lines) || quote.lines.length === 0) {
    return NextResponse.json({ ok: false, error: "Quote is empty" }, { status: 400 });
  }

  console.log("[quote] received", JSON.stringify(quote, null, 2));

  return NextResponse.json({ ok: true, received: quote.lines.length });
}
