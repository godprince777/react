import { useLoaderData } from "@remix-run/react";
import type { MetaFunction } from "@remix-run/node";
import { postsAPI } from "~/lib/api";
import type { LoaderResponse, ApiError } from "~/types";

export const meta: MetaFunction = () => {
    return [
        { title: "포스트 목록 - Blog App" },
        { name: "description", content: "모든 블로그 포스트를 확인하세요" },
    ];
};

export async function loader(): Promise<LoaderResponse> {
    try {
        const posts = await postsAPI.getAll();
        return { posts };
    } catch (error: unknown) {
        const apiError = error as ApiError;
        console.error("Failed to load posts:", apiError);
        return {
            posts: [],
            error: apiError.response?.data?.detail || "포스트를 불러오는데 실패했습니다."
        };
    }
}

export default function Posts() {
    const { posts, error } = useLoaderData<typeof loader>();

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">블로그 포스트</h2>
                    <p className="mt-2 text-lg leading-8 text-gray-600">
                        최신 블로그 포스트들을 확인해보세요.
                    </p>
                </div>

                {error && (
                    <div className="mt-8 rounded-md bg-red-50 p-4">
                        <div className="text-sm text-red-700">{error}</div>
                    </div>
                )}

                <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                    {!posts || posts.length === 0 ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500">
                                {error ? "포스트를 불러올 수 없습니다." : "아직 포스트가 없습니다."}
                            </p>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <article key={post.id} className="flex flex-col items-start">
                                <div className="flex items-center gap-x-4 text-xs">
                                    <time dateTime={post.created_at} className="text-gray-500">
                                        {new Date(post.created_at).toLocaleDateString('ko-KR')}
                                    </time>
                                </div>
                                <div className="group relative">
                                    <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                                        <a href={`/posts/${post.id}`}>
                                            <span className="absolute inset-0" />
                                            {post.title}
                                        </a>
                                    </h3>
                                    <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                                        {post.content.length > 150
                                            ? `${post.content.substring(0, 150)}...`
                                            : post.content
                                        }
                                    </p>
                                </div>
                                <div className="relative mt-8 flex items-center gap-x-4">
                                    <div className="text-sm leading-6">
                                        <p className="font-semibold text-gray-900">
                                            <span className="absolute inset-0" />
                                            작성자 {post.author_id}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
} 