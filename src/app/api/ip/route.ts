import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<NextResponse> {
  const FALLBACK_IP_ADDRESS = "0.0.0.0";

  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    const response = new NextResponse(
      forwardedFor.split(",")[0] ?? FALLBACK_IP_ADDRESS,
    );

    return response;
  }

  const response = new NextResponse(
    request.headers.get("x-real-ip") ?? FALLBACK_IP_ADDRESS,
  );

  return response;
}
