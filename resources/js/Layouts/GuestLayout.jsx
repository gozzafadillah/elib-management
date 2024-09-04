import { useEffect, useState } from "react";

export default function Guest({ children }) {
    const [currentImage, setCurrentImage] = useState(0);
    const images = [
        "https://res.cloudinary.com/dt91kxctr/image/upload/v1725191475/fo2jkp5y8zldktimsigi.jpg",
        "https://res.cloudinary.com/dt91kxctr/image/upload/v1725191467/mpmw8c1uj3ysbrrg5usd.jpg",
        "https://res.cloudinary.com/dt91kxctr/image/upload/v1725191462/y4owjaxhkch6nusuj8lr.jpg",
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImage((prevImage) =>
                prevImage === images.length - 1 ? 0 : prevImage + 1
            );
        }, 5000); // Change image every 3 seconds

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, [images.length]);

    return (
        <div className="flex min-h-screen">
            {/* Left Side - Image */}
            <div className="hidden lg:flex lg:w-1/2">
                <div className="relative w-full h-100 overflow-hidden">
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt="The Room 19"
                            className={`absolute inset-0 object-cover w-full h-full transition-opacity duration-1000 ease-in-out ${
                                index === currentImage
                                    ? "opacity-100"
                                    : "opacity-0"
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex flex-col justify-center items-center lg:w-1/2 p-8 bg-gray-100 dark:bg-gray-900">
                <div className="max-w-md w-full mt-10">{children}</div>
            </div>
        </div>
    );
}
