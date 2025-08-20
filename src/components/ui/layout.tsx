import * as React from "react"

function Layout({ children }: { children: React.ReactNode }) {
     return (
          <section className="min-h-svh flex justify-center items-center">
               {children}
          </section>
     )
}

export { Layout }
