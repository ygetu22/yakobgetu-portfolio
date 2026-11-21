import { postLike } from "@/features/posts/post-reactions-handler";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return postLike(request, (await params).id);
}
