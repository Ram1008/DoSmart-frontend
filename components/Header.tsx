"use client";
import React, { useEffect } from "react";
import { User } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../lib/hooks";
import { fetchUser, logout } from "../lib/features/auth/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Header = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
    const token = localStorage.getItem("token");
  useEffect(() => {
    // 1. Check if a token is already saved in localStorage
    
    if (!token) {
      // No token → do nothing (user remains unauthenticated)
      return;
    }

    // 2. If token exists, dispatch fetchUser(token)
    //    fetchUser should validate the token, pull user + tasks from the backend,
    //    and store them in Redux (and also return them so we can mirror into localStorage).
    dispatch(fetchUser(token))
      .unwrap() // unwrap to get either a thrown error or the payload
      .then((payload) => {
        // payload is whatever your fetchUser thunk returned, e.g.:
        // { username: string; token: string; tasks: Task[]; }

        // (a) Mirror username into localStorage
        localStorage.setItem("username", payload.username);

        // (b) Mirror token into localStorage (in case backend returned a refreshed token)
        localStorage.setItem("authToken", payload.token);

        // (c) Mirror tasks into localStorage (so tasks persist across reload)
        //     if your payload includes tasks
        if (payload.tasks) {
          localStorage.setItem("tasks", JSON.stringify(payload.tasks));
        }
      })
      .catch(() => {
        // If fetchUser fails (e.g. invalid/expired token), do nothing
        // or optionally force a logout:
        dispatch(logout());
      });
  }, [dispatch]);

  const handleLogout = () => {
    // 1. Remove everything from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("tasks");

    // 2. Clear Redux auth state
    dispatch(logout());

    // 3. Redirect to /login
    router.push("/login");
  };

  return (
    <header className="fixed w-full h-[65px] bg-gray-700 top-0 flex justify-between items-center px-4 md:px-8 z-50">
      <h1 className="text-white text-3xl font-semibold">Do Smart</h1>

      <div className="relative">
        <input type="checkbox" id="profile-toggle" className="peer hidden" />
        <label htmlFor="profile-toggle" className="cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
            <User className="text-white w-6 h-6" />
          </div>
        </label>

        <div
          className={`
            hidden peer-checked:flex
            flex-col
            absolute right-0
            bg-white text-gray-800 rounded-lg shadow-lg
            w-40
            transform transition-all
            /* always drop down (under the icon) */
            top-full mt-2
          `}
        >
          <ul className="flex flex-col">
            {token ? (
              <li>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link href="/signup">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                      Sign Up
                    </button>
                  </Link>
                </li>
                <li>
                  <Link href="/login">
                    <button className="w-full text-left px-4 py-2 hover:bg-gray-100">
                      Log In
                    </button>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
};

export default Header;
