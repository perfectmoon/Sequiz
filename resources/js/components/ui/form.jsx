"use client"

import { useState, useMemo } from "react"
import { Link, router, usePage } from "@inertiajs/react"
import { Overlay } from "./overlay-skeleton"

export default function Form() {
  const { url } = usePage()

  const list = {
    "/form/register": {
      cols: ["Username", "Gmail", "Password", "Re-enter password"],
      gap: 15,
      bodyHeight: "65%",
      footerHeight: "15%",
      link: (
        <Link href="/form/login" className="hover:opacity-75">
          Login
        </Link>
      ),
      submit: "/form/otp",
    },
    "/form/login": {
      cols: ["Username", "Password"],
      gap: 35,
      bodyHeight: "65%",
      footerHeight: "15%",
      link: (
        <Link href="/form/register" className="hover:opacity-75">
          Register
        </Link>
      ),
      submit: "/",
    },
    "/form/otp": {
      cols: ["OTP Code"],
      gap: 35,
      bodyHeight: "65%",
      footerHeight: "15%",
      link: (
        <Link href="/form/register" className="hover:opacity-75">
          Register
        </Link>
      ),
      submit: "/form/login",
    },
  }

  const setter = list[url] ?? { cols: [] }

  const [formData, setFormData] = useState(
    Object.fromEntries(setter.cols.map((label) => [label, ""]))
  )

  const getInputType = (label) => {
    const lower = label.toLowerCase()
    if (lower.includes("password")) return "password"
    if (lower.includes("gmail") || lower.includes("email")) return "email"
    if (lower.includes("otp")) return "text"
    return "text"
  }

  const handleChange = (label, value) => {
    setFormData((prev) => ({ ...prev, [label]: value }))
  }

  const handleSubmit = () => {
    console.log("submitted form data:", formData)
    router.visit(setter.submit)
  }

  const outerBox =
    "flex flex-col items-center " +
    "h-[75%] w-[50%] " +
    "rounded-2xl text-2xl outline outline-[2px] outline-white/90 " +
    "bg-gradient-to-tr from-lime-900/80 via-black/80 to-lime-900/80 " +
    "shadow-[0_0_40px_rgba(0,0,0,0.8)]"

  const headerBox =
    "flex flex-col items-center justify-center " +
    "h-[20%] gap-5 w-full rounded-t-2xl " +
    "bg-neutral-900/90 border-b border-white/80"

  const bodyBox = "flex flex-col items-center justify-center w-full"
  const bodyInner = "flex flex-col w-[75%] justify-center items-center text-white"

  const textInputWrapper = "w-full flex flex-col"
  const textInputStyles =
    "w-full min-h-[50px] px-4 text-white text-xl bg-transparent " +
    "border border-white rounded-full outline-none " +
    "placeholder:text-white/80 " +
    "focus:ring-4 focus:ring-white/40 focus:bg-white/5 transition duration-150 ease-in-out"

  const footerLinksRow =
    "flex justify-between items-center w-full pt-6 text-white text-xl"

  const submitBox =
    "group cursor-pointer flex flex-col items-center justify-center " +
    "w-full rounded-b-2xl bg-black border-t border-white/80 " +
    "text-4xl text-white py-8 select-none"

  const submitButton =
    "group-hover:opacity-45 transition duration-150 ease-in-out"

  const formTitle = useMemo(
    () => url.replace("/form/", "").toUpperCase(),
    [url]
  )

  return (
    <Overlay
      items={
        <div className={outerBox}>
          <div className={headerBox}>
            <h1 className="text-5xl text-white font-bold tracking-wider drop-shadow-[2px_2px_0_#000]">
              {formTitle}
            </h1>
          </div>

          <div
            style={{ height: setter.bodyHeight }}
            className={bodyBox}
          >
            <div
              style={{ gap: setter.gap }}
              className={bodyInner}
            >
              {setter.cols.map((label, index) => (
                <div
                  key={index}
                  className={textInputWrapper}
                >
                  <input
                    type={getInputType(label)}
                    value={formData[label] ?? ""}
                    onChange={(e) => handleChange(label, e.target.value)}
                    className={textInputStyles}
                    placeholder={label}
                    autoComplete="off"
                  />
                </div>
              ))}

              <div className={footerLinksRow}>
                <Link
                  href="/form/forgot-password"
                  className="hover:opacity-75"
                >
                  Forgot Password?
                </Link>
                {setter.link}
              </div>
            </div>
          </div>

          <div
            style={{ height: setter.footerHeight }}
            className={submitBox}
            onClick={handleSubmit}
          >
            <button className={submitButton}>
              Submit
            </button>
          </div>
        </div>
      }
    />
  )
}
