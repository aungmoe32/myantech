"use client"

import { useState } from "react"
import { ComplaintList } from "../../../components/Warehouse/complaints/complaint-list"
import { ComplaintDetails } from "../../../components/Warehouse/complaints/complaint-details"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

// Mock data for demonstration
const mockComplaints = [
  { id: "C001", orderId: "O123", customerName: "John Doe", issueType: "Wrong Product", status: "Pending" },
  { id: "C002", orderId: "O456", customerName: "Jane Smith", issueType: "Damaged Item", status: "Investigating" },
  { id: "C003", orderId: "O789", customerName: "Bob Johnson", issueType: "Late Delivery", status: "Resolved" },
]

export default function Complaints() {
  const [complaints, setComplaints] = useState(mockComplaints)
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  const filteredComplaints = complaints.filter(
    (complaint) =>
      (complaint.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.id.includes(searchTerm) ||
        complaint.orderId.includes(searchTerm)) &&
      (statusFilter === "All" || complaint.status === statusFilter),
  )

  const handleComplaintClick = (complaint) => {
    setSelectedComplaint(complaint)
  }

  const handleStatusUpdate = (complaintId, newStatus) => {
    setComplaints(
      complaints.map((complaint) => (complaint.id === complaintId ? { ...complaint, status: newStatus } : complaint)),
    )
    if (selectedComplaint && selectedComplaint.id === complaintId) {
      setSelectedComplaint({ ...selectedComplaint, status: newStatus })
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-2xl font-bold flex items-center">
            <AlertCircle className="mr-2 h-6 w-6" />
            Complaints Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Input
              placeholder="Search by Complaint ID, Order ID or Customer Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Investigating">Investigating</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Escalated">Escalated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <ComplaintList complaints={filteredComplaints} onComplaintClick={handleComplaintClick} />
            {selectedComplaint && (
              <ComplaintDetails complaint={selectedComplaint} onStatusUpdate={handleStatusUpdate} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

