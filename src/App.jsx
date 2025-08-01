import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Layout from "@/components/organisms/Layout"
import ContentGenerator from "@/components/pages/ContentGenerator"
import TopicClusters from "@/components/pages/TopicClusters"
import QueryTools from "@/components/pages/QueryTools"
import Analytics from "@/components/pages/Analytics"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white">
        <Layout>
          <Routes>
            <Route path="/" element={<ContentGenerator />} />
            <Route path="/content" element={<ContentGenerator />} />
            <Route path="/clusters" element={<TopicClusters />} />
            <Route path="/query-tools" element={<QueryTools />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          className="z-[9999]"
        />
      </div>
    </Router>
  )
}

export default App