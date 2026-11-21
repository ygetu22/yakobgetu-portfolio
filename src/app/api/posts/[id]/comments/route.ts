import { postComment } from "@/features/posts/post-reactions-handler";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  return postComment(request, (await params).id);
}
