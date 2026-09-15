import Header from "./header"
import Sidebars from "../sidebars/sidebars"

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebars />
      <div className="flex-1 flex flex-col overflow-hidden pl-120">
        <Header />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout
