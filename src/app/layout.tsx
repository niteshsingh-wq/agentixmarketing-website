// Root layout — minimal passthrough.
// Each route group ((site), (payload)) owns its own <html><body> structure.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
