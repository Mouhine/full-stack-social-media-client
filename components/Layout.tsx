import React, { lazy, useEffect, Suspense } from "react";
import NavBar from "./navBar";
import { useAuth } from "../context/useAuth";
import useRefreshToken from "../hooks/useRefreshToken";
import { ToastContainer } from "react-toastify";
import { BeatLoader } from "react-spinners";
const LoginModal = lazy(() => import("./modals/LoginModal"));
const Comments = lazy(() => import("./comments/Comments"));
const RegisterErrorModal = lazy(() => import("./modals/Register"));
const LoginErrorModal = lazy(() => import("./modals/LoginError"));
export default function Layout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  const {
    isOpen,
    postID,
    openLoginModal,
    openErrorRegisterModal,
    msg,
    openErrorLoginModal,
  } = useAuth();
  const refresh = useRefreshToken();
  useEffect(() => {
    refresh();
  }, []);

  return (
    <section className="relative ">
      {/* Include shared UI here e.g. a header or sidebar */}
      <nav className="mb-3">
        <NavBar />
        <ToastContainer />
      </nav>
      {isOpen && (
        <Suspense fallback={"loading..."}>
          <Comments id={postID!} />
        </Suspense>
      )}
      {openLoginModal && (
        <Suspense fallback={<BeatLoader />}>
          <LoginModal />
        </Suspense>
      )}
      {openErrorRegisterModal && (
        <Suspense fallback={<BeatLoader />}>
          <RegisterErrorModal msg={msg} />
        </Suspense>
      )}
      {openErrorLoginModal && (
        <Suspense fallback={<BeatLoader />}>
          <LoginErrorModal msg={msg} />
        </Suspense>
      )}
      {children}
    </section>
  );
}
