"use client";
import React, { useEffect, useState } from "react";
import type { School } from "../types";
import { school } from "../services/api";
import toast from "react-hot-toast";

const School = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Load schools
  const fetchSchools = async () => {
    try {
      const data = await school.getAllSchools();
      setSchools(data);
    } catch (err) {
      console.error("Error fetching schools:", err);
    }
  };

  // Create new school
  const createSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await school.createSchool({ name, email });
      if (data.success !== false) {
        toast.success(" School created successfully!");
        setName("");
        setEmail("");
        setShowForm(false);
        fetchSchools();
      } else {
        toast.error(data.message || "Error creating school");
      }
    } catch (err) {
      console.error("Error creating school:", err);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  return (
    <div className="p-8 min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold"> Schools</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {showForm ? "Close" : " New School"}
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
            <tr>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-3">
                ID
              </th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-3">
                Name
              </th>
              <th className="border border-gray-300 dark:border-gray-700 px-4 py-3">
                Email
              </th>
            </tr>
          </thead>
          <tbody>
            {schools.length > 0 ? (
              schools.map((school) => (
                <tr
                  key={school._id}
                  className="transition transform hover:scale-[1.01] hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-600 dark:text-gray-300">
                    {school._id}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 font-medium">
                    {school.name}
                  </td>
                  <td className="border border-gray-300 dark:border-gray-700 px-4 py-2 text-gray-600 dark:text-gray-300">
                    {school.email}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="text-center text-gray-500 dark:text-gray-400 py-4 border border-gray-300 dark:border-gray-700"
                >
                  No schools found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="mt-6 p-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg transition">
          <h3 className="text-lg font-semibold mb-4">Create New School</h3>
          <form onSubmit={createSchool} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="School Name"
              className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-3 py-2 rounded-md focus:ring focus:ring-blue-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="School Email"
              className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white px-3 py-2 rounded-md focus:ring focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
            >
               Create School
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default School;
