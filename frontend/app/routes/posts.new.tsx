import { Form, useActionData, useNavigation } from "@remix-run/react";
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { postsAPI } from "~/lib/api";
import { isAuthenticated } from "~/lib/auth";
import type { ActionResponse, ApiError } from "~/types";

export const meta: MetaFunction = () => {
    return [
        { title: "새 포스트 작성 - Blog App" },
        { name: "description", content: "새로운 블로그 포스트를 작성하세요" },
    ];
};

export async function action({ request }: ActionFunctionArgs): Promise<ActionResponse> {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

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
        const post = await postsAPI.create({ title, content });
        return {
            success: true,
            postId: post.id,
            message: "포스트가 성공적으로 작성되었습니다!"
        };
    } catch (error: unknown) {
        const apiError = error as ApiError;
        return {
            success: false,
            error: apiError.response?.data?.detail || "포스트 작성에 실패했습니다."
        };
    }
}

export default function NewPost() {
    const actionData = useActionData<typeof action>();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    if (!isAuthenticated()) {
        return (
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <div className="rounded-md bg-yellow-50 p-4">
                        <div className="text-sm text-yellow-700">
                            포스트를 작성하려면 <a href="/login" className="font-semibold underline">로그인</a>이 필요합니다.
                        </div>
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
                            <a href={`/posts/${actionData.postId}`} className="font-semibold underline">
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
                        새 포스트 작성
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
                                {isSubmitting ? "작성 중..." : "포스트 작성"}
                            </button>

                            <a
                                href="/posts"
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