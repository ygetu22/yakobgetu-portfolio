import { getReactions } from "@/features/posts/post-reactions-handler";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  return getReactions((await params).id);
}
