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
        { title: `${data.post.title} 수정 - Blog App` },
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
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    if (isNaN(postId)) {
        return {
            success: false,
            error: "잘못된 포스트 ID입니다."
        };
    }

    if (!title.trim() || !content.trim()) {
        return {
            success: false,
            error: "제목과 내용을 모두 입력해주세요."
        };
    }

    if (title.length < 2) {
        return {
            success: false,
            error: "제목은 최소 2자 이상이어야 합니다."
        };
    }

    if (content.length < 10) {
        return {
            success: false,
            error: "내용은 최소 10자 이상이어야 합니다."
        };
    }

    try {
        const post = await postsAPI.update(postId, { title, content });
        return {
            success: true,
            post,
            message: "포스트가 성공적으로 수정되었습니다!"
        };
    } catch (error: unknown) {
        const apiError = error as ApiError;
        return {
            success: false,
            error: apiError.response?.data?.detail || "포스트 수정에 실패했습니다."
        };
    }
}

export default function EditPost() {
    const { post } = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    if (!isAuthenticated()) {
        return (
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <div className="rounded-md bg-yellow-50 p-4">
                        <div className="text-sm text-yellow-700">
                            포스트를 수정하려면 <a href="/login" className="font-semibold underline">로그인</a>이 필요합니다.
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <div className="rounded-md bg-red-50 p-4">
                        <div className="text-sm text-red-700">포스트를 찾을 수 없습니다.</div>
                    </div>
                </div>
            </div>
        );
    }

    if (actionData?.success) {
        return (
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <div className="rounded-md bg-green-50 p-4">
                        <div className="text-sm text-green-700">
                            {actionData.message}{" "}
                            <a href={`/posts/${post.id}`} className="font-semibold underline">
                                포스트 보기
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-8">
                        포스트 수정
                    </h1>

                    <Form method="post" className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                                제목
                            </label>
                            <div className="mt-2">
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    required
                                    minLength={2}
                                    defaultValue={post.title}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                    placeholder="포스트 제목을 입력하세요"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="content" className="block text-sm font-medium leading-6 text-gray-900">
                                내용
                            </label>
                            <div className="mt-2">
                                <textarea
                                    id="content"
                                    name="content"
                                    rows={15}
                                    required
                                    minLength={10}
                                    defaultValue={post.content}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                                    placeholder="포스트 내용을 입력하세요"
                                />
                            </div>
                        </div>

                        {actionData?.error && (
                            <div className="rounded-md bg-red-50 p-4">
                                <div className="text-sm text-red-700">{actionData.error}</div>
                            </div>
                        )}

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
                            >
                                {isSubmitting ? "수정 중..." : "포스트 수정"}
                            </button>

                            <a
                                href={`/posts/${post.id}`}
                                className="flex justify-center rounded-md bg-gray-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                            >
                                취소
                            </a>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
} 