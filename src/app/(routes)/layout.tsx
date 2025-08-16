import "@/styles/globals.css"
import ReactLenis from "lenis/react"

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        autoRaf: true
      }}
    >
      {children}
    </ReactLenis>
  )
}

export default RootLayout
