import { Link, Head } from "@inertiajs/react";

export default function Welcome({ auth, laravelVersion, phpVersion, buku }) {
    const handleImageError = () => {
        document
            .getElementById("screenshot-container")
            ?.classList.add("!hidden");
        document.getElementById("docs-card")?.classList.add("!row-span-1");
        document
            .getElementById("docs-card-content")
            ?.classList.add("!flex-row");
        document.getElementById("background")?.classList.add("!hidden");
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
                <img
                    id="background"
                    className="absolute -left-20 top-0 max-w-[877px]"
                    src="https://laravel.com/assets/img/welcome/background.svg"
                />
                <div className="relative min-h-screen flex flex-col items-center justify-center selection:bg-[#FF2D20] selection:text-white">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                        <header className="grid grid-cols-2 items-center gap-2 py-5 lg:grid-cols-3">
                            <div className="flex lg:justify-center lg:col-start-2">
                                <img
                                    src="/storage/images/landing-pages/the-room.png"
                                    alt=""
                                    className="w-32 h-100"
                                />
                            </div>
                            <nav className="-mx-3 flex flex-1 justify-end">
                                {auth.user ? (
                                    <Link
                                        href={route("dashboard")}
                                        className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route("login")}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            href={route("register")}
                                            className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                        >
                                            Register
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </header>

                        <main className="mt-6">
                            {/* navigation bar */}
                            <nav className="grid grid-cols-1 gap-6 lg:grid-cols-3 py-10">
                                <div className="flex items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                                    <img
                                        src="https://laravel.com/assets/img/welcome/docs.svg"
                                        alt=""
                                        className="w-16 h-16"
                                        onError={handleImageError}
                                    />
                                    <div className="ml-6">
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            List Buku
                                        </h2>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                                    <img
                                        src="https://laravel.com/assets/img/welcome/laracasts.svg"
                                        alt=""
                                        className="w-16 h-16"
                                        onError={handleImageError}
                                    />
                                    <div className="ml-6">
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Tentang Kami
                                        </h2>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                                    <img
                                        src="https://laravel.com/assets/img/welcome/forum.svg"
                                        alt=""
                                        className="w-16 h-16"
                                        onError={handleImageError}
                                    />
                                    <div className="ml-6">
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Kontak Kami
                                        </h2>
                                    </div>
                                </div>
                            </nav>
                            {/* card buku */}
                            {/* latest buku */}
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                Buku Terbaru
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
                                {buku.map((value) => (
                                    <div
                                        key={value.id}
                                        className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-lg border border-gray-200 dark:border-gray-700"
                                    >
                                        <img
                                            src={
                                                "/storage/images/buku/" +
                                                value.image_path
                                            }
                                            alt={value.judul}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-4">
                                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                                                {value.judul}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                {value.kategori.nama}
                                            </p>
                                            <div className="flex items-center mt-4">
                                                <button className="mx-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs">
                                                    Preview
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* top seller buku */}
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                Buku Terfavorit
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-6">
                                {buku.map((value) => (
                                    <div
                                        key={value.id}
                                        className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg rounded-lg border border-gray-200 dark:border-gray-700"
                                    >
                                        <img
                                            src={
                                                "/storage/images/buku/" +
                                                value.image_path
                                            }
                                            alt={value.judul}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-4">
                                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                                                {value.judul}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                {value.kategori.nama}
                                            </p>
                                            <div className="flex items-center mt-4">
                                                <button className="mx-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs">
                                                    Preview
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </main>

                        <footer className="py-16 text-center text-sm text-black dark:text-white/70">
                            Laravel v{laravelVersion} (PHP v{phpVersion})
                        </footer>
                    </div>
                </div>
            </div>
        </>
    );
}
