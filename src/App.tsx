import { ThemeProvider } from "next-themes"
import ShadCN from "./shadcn"
import { TooltipProvider } from "@radix-ui/react-tooltip"

function App() {

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <ShadCN/>
      </TooltipProvider>
    </ThemeProvider>
  )
}

export default App
