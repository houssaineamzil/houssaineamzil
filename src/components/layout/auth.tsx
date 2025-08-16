"use client"

import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik"
import { useEffect, useState } from "react"
import { object, string } from "yup"
import { getPassword } from "@/lib/data"

export const Auth: React.FC<{
  isProtected: boolean
  slug: string
  children: React.ReactNode
}> = ({ isProtected, slug, children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState<string>("")

  useEffect(() => {
    getPassword(slug).then((password) => setPassword(password))
  }, [slug])

  const validationSchema = object().shape({
    password: string()
      .required("Password is required")
      .test("password-match", "Incorrect password", (value) => {
        return value === password
      })
  })

  const handleSubmit = (
    values: { password: string },
    { setSubmitting }: FormikHelpers<{ password: string }>
  ) => {
    if (values.password === password) {
      setIsAuthenticated(true)
    }
    setSubmitting(false)
  }

  if (isProtected && !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <div className="w-full max-w-md">
          <div className="rounded-lg bg-white p-8 shadow-md">
            <h1 className="mb-6 text-center font-bold text-2xl">
              Protected Content
            </h1>
            <Formik
              initialValues={{ password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-6">
                  <div>
                    <label
                      htmlFor="password"
                      className="mb-1 block font-medium text-gray-700 text-sm"
                    >
                      Password
                    </label>
                    <Field
                      type="password"
                      name="password"
                      id="password"
                      className={`w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 ${
                        errors.password && touched.password
                          ? "border-red-500 focus:ring-red-200"
                          : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
                      }`}
                      placeholder="Enter password"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="mt-1 text-red-600 text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {isSubmitting ? "Verifying..." : "Submit"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    )
  }

  return children
}
