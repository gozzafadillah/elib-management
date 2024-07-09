import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import React, { useState } from "react";
import { Inertia } from "@inertiajs/inertia";

export default function DashboardPelanggan({ auth, pelanggan }) {
    console.log(pelanggan);
    const { data, setData, post, processing, errors, reset } = useForm({
        id: null,
        nama: "",
        email: "",
        password: "",
        role: 1,
        no_telp: "",
    });

    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const openModal = (pelanggan = null) => {
        if (pelanggan) {
            setData({
                id: pelanggan.id,
                nama: pelanggan.nama,
                email: pelanggan.email,
                password: pelanggan.password,
                role: pelanggan.role,
                no_telp: pelanggan.no_telp,
            });
            setEditMode(true);
        } else {
            reset();
            setData({
                id: null,
                nama: "",
                email: "",
                password: "",
                role: 1,
                no_telp: "",
            });
            setEditMode(false);
        }
        setShowModal(true);
    };

    const submit = (e) => {
        e.preventDefault();
        const routeName = editMode ? `pelanggan.update` : `pelanggan.store`;
        if (editMode) {
            Inertia.put(`pelanggan/${data.id}`, data);
            reset();
            setEditMode(false);
            setShowModal(false);
        } else {
            post(route(routeName), {
                onFinish: () => reset(),
                onSuccess: () => {
                    setShowModal(false);
                    setEditMode(false);
                },
                onError: (errors) => {
                    console.log("Submission errors:", errors);
                },
            });
        }
    };

    const deletePelanggan = async (id) => {
        if (confirm("Are you sure you want to delete this book?")) {
            Inertia.delete(`pelanggan/${id}`);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    List Pelanggan
                </h2>
            }
        >
            <Head title="Pelanggan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            Data Pelanggan
                        </div>

                        {/* Button to add books */}
                        <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => openModal()}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Add Pelanggan
                            </button>
                        </div>

                        {/* table pelanggan */}
                        <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                            <table className="table-auto w-full">
                                <thead>
                                    <tr>
                                        <th className="border px-4 py-2 ">
                                            Nama
                                        </th>
                                        <th className="border px-4 py-2 ">
                                            Email
                                        </th>
                                        <th className="border px-4 py-2 ">
                                            No Telp
                                        </th>
                                        <th className="border px-4 py-2 ">
                                            Role
                                        </th>
                                        <th className="border px-4 py-2 ">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pelanggan.map((pelanggan) => (
                                        <tr key={pelanggan.id}>
                                            <td className="border px-4 py-2 ">
                                                {pelanggan.nama}
                                            </td>
                                            <td className="border px-4 py-2 ">
                                                {pelanggan.email}
                                            </td>
                                            <td className="border px-4 py-2 ">
                                                {pelanggan.no_telp}
                                            </td>
                                            <td className="border px-4 py-2 ">
                                                {pelanggan.user.role === 1
                                                    ? "Pelanggan"
                                                    : "Admin"}
                                            </td>
                                            <td className="border px-4 py-2 ">
                                                {/* justify between */}
                                                <div className="flex justify-between gap-2">
                                                    <button
                                                        onClick={() =>
                                                            openModal(pelanggan)
                                                        }
                                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            deletePelanggan(
                                                                pelanggan.id
                                                            )
                                                        }
                                                        className="bg-red-500 hover:bg-red-700  text-white font-bold py-2 px-4 rounded"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Form */}
            {showModal && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h2 className="text-lg font-bold mb-4">
                            {editMode ? "Edit Buku" : "Add New Buku"}
                        </h2>
                        <form onSubmit={submit}>
                            <div className="mb-4">
                                <label
                                    htmlFor="nama"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Nama
                                </label>
                                <input
                                    type="text"
                                    id="nama"
                                    name="nama"
                                    value={data.nama}
                                    onChange={(e) =>
                                        setData("nama", e.target.value)
                                    }
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="noTelp"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    No Telp
                                </label>
                                <input
                                    type="text"
                                    id="no_telp"
                                    name="no_telp"
                                    value={data.no_telp}
                                    onChange={(e) =>
                                        setData("no_telp", e.target.value)
                                    }
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="role"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Role
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={data.role}
                                    onChange={(e) =>
                                        setData("role", e.target.value)
                                    }
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                >
                                    <option value="1">Pelanggan</option>
                                    <option value="2">Admin</option>
                                </select>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    {editMode ? "Update" : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
