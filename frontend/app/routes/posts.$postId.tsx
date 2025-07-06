import { useLoaderData, Form, useActionData, useNavigation } from "@remix-run/react";
import type { LoaderFunctionArgs, ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { postsAPI } from "~/lib/api";
import { isAuthenticated } from "~/lib/auth";
import type { ActionResponse, LoaderResponse, ApiError } from "~/types";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data?.post) {
    return [
      { title: "포스트를 찾을 수 없습니다 - Blog App" },
    ];
  }

  return [
    { title: `${data.post.title} - Blog App` },
    { name: "description", content: data.post.content.substring(0, 160) },
  ];
};

export async function loader({ params }: LoaderFunctionArgs): Promise<LoaderResponse> {
  const postId = parseInt(params.postId!);

  if (isNaN(postId)) {
    throw new Response("잘못된 포스트 ID입니다", { status: 400 });
  }

  try {
    const post = await postsAPI.getById(postId);
    return { post };
  } catch (error: unknown) {
    const apiError = error as ApiError;
    console.error("Failed to load post:", apiError);
    throw new Response("포스트를 찾을 수 없습니다", { status: 404 });
  }
}

export async function action({ request, params }: ActionFunctionArgs): Promise<ActionResponse> {
  const postId = parseInt(params.postId!);
  const formData = await request.formData();
  const intent = formData.get("intent") as string;

  if (isNaN(postId)) {
    return {
      success: false,
      error: "잘못된 포스트 ID입니다."
    };
  }

  if (intent === "delete") {
    try {
      await postsAPI.delete(postId);
      return {
        success: true,
        message: "포스트가 삭제되었습니다."
      };
    } catch (error: unknown) {
      const apiError = error as ApiError;
      return {
        success: false,
        error: apiError.response?.data?.detail || "포스트 삭제에 실패했습니다."
      };
    }
  }

  return {
    success: false,
    error: "잘못된 요청입니다."
  };
}

export default function PostDetail() {
  const { post } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const isLoggedIn = isAuthenticated();

  if (!post) {
    return (
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500">포스트를 찾을 수 없습니다.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-2xl">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {post.title}
            </h1>
            <div className="mt-4 flex items-center gap-x-4 text-sm text-gray-500">
              <time dateTime={post.created_at}>
                {new Date(post.created_at).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
              <span>•</span>
              <span>작성자 {post.author_id}</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {post.content}
            </div>
          </div>

          {isLoggedIn && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="flex gap-4">
                <a
                  href={`/posts/${post.id}/edit`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  수정
                </a>

                <Form method="post" className="inline">
                  <input type="hidden" name="intent" value="delete" />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    onClick={(e) => {
                      if (!confirm("정말로 이 포스트를 삭제하시겠습니까?")) {
                        e.preventDefault();
                      }
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {isSubmitting ? "삭제 중..." : "삭제"}
                  </button>
                </Form>
              </div>
            </div>
          )}

          {actionData?.error && (
            <div className="mt-4 rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{actionData.error}</div>
            </div>
          )}

          {actionData?.success && (
            <div className="mt-4 rounded-md bg-green-50 p-4">
              <div className="text-sm text-green-700">{actionData.message}</div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
} 