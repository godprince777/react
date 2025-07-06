import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: "/app/tailwind.css" },
];

export const meta: MetaFunction = () => {
  return [
    { title: "Blog App" },
    { name: "description", content: "A modern blog built with Remix and FastAPI" },
  ];
};

export default function App() {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-50 min-h-screen">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <a href="/" className="text-xl font-bold text-gray-900">
                  Blog App
                </a>
              </div>
              <div className="flex items-center space-x-4">
                <a href="/" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  홈
                </a>
                <a href="/posts" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  포스트
                </a>
                <a href="/posts/new" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  새 포스트
                </a>
                <a href="/login" className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  로그인
                </a>
                <a href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                  회원가입
                </a>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
