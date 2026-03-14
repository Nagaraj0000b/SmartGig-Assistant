import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {useState , useEffect} from "react"
import {useNavigate} from "react-router-dom"


export default function DashBoard() {
    return (
   <div className="dashboard-page">
    {/* sidebar */}
    <aside className="dashboard-sidebar">
      Side bar
    </aside>
    {/* main content */}
    <div className="dashboard-main">

      {/* topbar */}
      <header className="dashboard-topbar">
      Topbar  
      </header>

      {/* center row */}
      <div className="dashboard-center">
        <section className="ai-avatar">
          Ai avatar
        </section>

        <section className="overview panel">
          
        </section>

      </div>
    
    </div>

   </div>

  )
}
