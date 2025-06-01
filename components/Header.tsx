"use client";
import React, { useEffect } from "react";
import { User } from "lucide-react";
import { useAppDispatch } from "../lib/hooks";
import { fetchUser, logout } from "../lib/features/auth/authSlice";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Header = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [token, setToken] = React.useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      setToken(storedToken);
      if (!storedToken) {
        return;
      }

      dispatch(fetchUser(storedToken))
        .unwrap()
        .then((payload) => {
          localStorage.setItem("username", payload.username);
          localStorage.setItem("authToken", payload.token);
        })
        .catch(() => {
          dispatch(logout());
        });
    }
  }, [dispatch]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("tasks");

      dispatch(logout());

      router.push("/login");
    }
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
