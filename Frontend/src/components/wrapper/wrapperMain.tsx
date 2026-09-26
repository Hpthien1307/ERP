import React from "react"

const WrapperMain = ({ classCustom, children }: { classCustom: string; children: React.ReactNode }) => {
  return <main className={`${classCustom}`}>{children}</main>
}

export default WrapperMain
