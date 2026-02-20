import { type NextRequest, NextResponse } from "next/server";

/**
 * Echoes back URL and query parameters as JSON.
 * Used to demonstrate that OpenNext's request pipeline
 * corrupts query parameter values containing special characters.
 */
export function GET(request: NextRequest) {
  const input = request.nextUrl.searchParams.get("input");

  // Try to parse the input as JSON (like tRPC does)
  let parsed: unknown = null;
  let parseError: string | null = null;
  if (input) {
    try {
      parsed = JSON.parse(input);
    } catch (e) {
      parseError = (e as Error).message;
    }
  }

  return NextResponse.json({
    url: request.url,
    searchParams: Object.fromEntries(request.nextUrl.searchParams),
    input,
    parsed,
    parseError,
  });
}
