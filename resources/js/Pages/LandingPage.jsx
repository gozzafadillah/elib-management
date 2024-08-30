import { Link, Head } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function Welcome({ auth, laravelVersion, phpVersion, buku }) {
    const [navBackground, setNavBackground] = useState(
        "bg-white dark:bg-gray-800 opacity-70"
    );
    const [currentImage, setCurrentImage] = useState(0);

    const images = [
        "/storage/images/landing-pages/hero-the-room-1.jpeg",
        "/storage/images/landing-pages/hero-the-room-2.jpeg",
        "/storage/images/landing-pages/hero-the-room-3.jpeg",
    ];

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop =
                window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > 50) {
                setNavBackground("bg-white dark:bg-gray-800 opacity-100");
            } else {
                setNavBackground("bg-white dark:bg-gray-800 opacity-70");
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentImage((prevImage) => (prevImage + 1) % images.length);
        }, 6000);

        return () => clearInterval(intervalId);
    }, [images.length]);

    return (
        <>
            <Head title="Welcome" />
            <div className="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
                {/* Sticky Navigation */}
                <header
                    id="header"
                    className={`sticky top-0 z-20 flex items-center justify-between px-6 py-4 transition-opacity duration-300 ${navBackground}`}
                >
                    <div className="flex justify-center lg:justify-start">
                        <img
                            src="/storage/images/landing-pages/the-room.png"
                            alt="The Room 19"
                            className="w-32 h-auto"
                        />
                    </div>
                    <nav className="flex justify-end">
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

                {/* Hero Section with Carousel */}
                <div className="relative z-0 h-[600px] overflow-hidden">
                    <div
                        id="carousel"
                        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
                        style={{
                            backgroundImage: `url(${images[currentImage]})`,
                        }}
                    ></div>
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                    <div className="relative flex items-center justify-center h-full text-center">
                        <div className="text-white z-10">
                            <h1 className="text-5xl font-bold mb-4">
                                Welcome to The Room 19
                            </h1>
                            <p className="text-lg mb-6">
                                Discover your favorite books
                            </p>
                            <Link
                                href={route("register")}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-lg transition duration-300"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl mx-auto mt-6">
                    <main>
                        {/* Navigation Bar */}
                        <nav className="grid grid-cols-1 gap-6 lg:grid-cols-3 py-10">
                            <div className="flex items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-2xl transition duration-300 ease-in-out cursor-pointer">
                                <i className="fa-solid fa-book text-xl"></i>
                                <div className="ml-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        List Buku
                                    </h2>
                                </div>
                            </div>
                            <div className="flex items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-2xl transition duration-300 ease-in-out cursor-pointer">
                                <i className="fa-solid fa-building text-xl"></i>
                                <div className="ml-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Tentang Kami
                                    </h2>
                                </div>
                            </div>
                            <div className="flex items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:shadow-2xl transition duration-300 ease-in-out cursor-pointer">
                                <i className="fa-solid fa-address-book text-xl"></i>
                                <div className="ml-6">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Kontak Kami
                                    </h2>
                                </div>
                            </div>
                        </nav>

                        {/* Latest Books */}
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
                                                Detail
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Top Seller Books */}
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
                                                Detail
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
        </>
    );
}
