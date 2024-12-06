import { ThemeProvider } from "@/components/theme-provider"
// import { Button } from "@/components/ui/button"
// import { ModeToggle } from "@/components/mode-toggle"
import Layout from "@/layout/layout"
function App() {
  return (
    <ThemeProvider  defaultTheme="dark" storageKey="vite-ui-theme">
      <Layout></Layout>
    </ThemeProvider>
  )
}
{/* <h1 className="text-3xl font-bold underline border border-red-400">Hello world!</h1>
<Button variant="destructive">Click me</Button>
<ModeToggle></ModeToggle> */}
export default App
