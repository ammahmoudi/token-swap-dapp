export default function CoursesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <main className="light flex min-h-screen flex-col items-center  justify-between p-12">{children}</main>
}