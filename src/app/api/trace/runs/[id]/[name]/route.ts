export function GET() {
  return Response.json({ error: "Artifact downloads are not part of the basic checker." }, { status: 404 });
}
export const runtime = "nodejs";
