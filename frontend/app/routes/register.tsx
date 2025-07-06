import { Form, useActionData, useNavigation } from "@remix-run/react";
import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { authAPI } from "~/lib/api";
import type { ActionResponse, ApiError } from "~/types";

export const meta: MetaFunction = () => {
    return [
        { title: "회원가입 - Blog App" },
        { name: "description", content: "새로운 계정을 만드세요" },
    ];
};

export async function action({ request }: ActionFunctionArgs): Promise<ActionResponse> {
    const formData = await request.formData();
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // 입력값 검증
    if (!username || !email || !password || !confirmPassword) {
        return {
            success: false,
            error: "모든 필드를 입력해주세요."
        };
    }

    if (password !== confirmPassword) {
        return {
            success: false,
            error: "비밀번호가 일치하지 않습니다."
        };
    }

    if (password.length < 6) {
        return {
            success: false,
            error: "비밀번호는 최소 6자 이상이어야 합니다."
        };
    }

    try {
        await authAPI.register({ username, email, password });
        return {
            success: true,
            message: "회원가입이 완료되었습니다!"
        };
    } catch (error: unknown) {
        const apiError = error as ApiError;
        return {
            success: false,
            error: apiError.response?.data?.detail || "회원가입에 실패했습니다."
        };
    }
}

export default function Register() {
    const actionData = useActionData<typeof action>();
    const navigation = useNavigation();
    const isSubmitting = navigation.state === "submitting";

    if (actionData?.success) {
        return (
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <div className="rounded-md bg-green-50 p-4">
                        <div className="text-sm text-green-700">
                            {actionData.message} <a href="/login" className="font-semibold underline">로그인</a>하세요.
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    새 계정 만들기
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <Form className="space-y-6" method="post">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                            사용자명
                        </label>
                        <div className="mt-2">
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            이메일
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                            비밀번호
                        </label>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                minLength={6}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
                            비밀번호 확인
                        </label>
                        <div className="mt-2">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                minLength={6}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    {actionData?.error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="text-sm text-red-700">{actionData.error}</div>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
                        >
                            {isSubmitting ? "가입 중..." : "회원가입"}
                        </button>
                    </div>
                </Form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    이미 계정이 있으신가요?{" "}
                    <a href="/login" className="font-semibold leading-6 text-blue-600 hover:text-blue-500">
                        로그인
                    </a>
                </p>
            </div>
        </div>
    );
} 