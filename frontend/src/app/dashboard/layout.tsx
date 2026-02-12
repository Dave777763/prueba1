"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { LogOut, Home } from "lucide-react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-xl">Cargando...</div>
            </div>
        );
    }

    if (!user) {
        return null; // Evita flash de contenido antes del redirect
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <Home className="h-6 w-6 text-indigo-600" />
                        <h1 className="text-xl font-bold tracking-tight text-gray-900">
                            EventosApp Dashboard
                        </h1>
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500 hidden sm:block">
                            {user.email}
                        </span>
                        <button
                            onClick={() => {
                                logout();
                                router.push("/login");
                            }}
                            className="flex items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            </header>
            <main className="flex-1">
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">{children}</div>
            </main>
        </div>
    );
}
