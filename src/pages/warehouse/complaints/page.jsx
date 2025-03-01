"use client";

import { useState } from "react";
import { ComplaintList } from "../../../components/Warehouse/complaints/complaint-list";
import { ComplaintDetails } from "../../../components/Warehouse/complaints/complaint-details";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

import { CheckCircleIcon } from "lucide-react";
import axios from "axios";
import { Search } from "lucide-react";
import { X } from "lucide-react";

export default function Complaints() {
  const [complaints, setComplaints] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const { toast } = useToast();

  // console.log(statusFilter, com);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data } = await axios("api/complaints");
        setComplaints(data);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      }
    };

    fetchComplaints();
  }, [refresh]);

  const filteredComplaints = complaints?.filter(
    (complaint) =>
      (complaint.customer.user.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        complaint.id.toString().includes(searchTerm) ||
        complaint.order_id.toString().includes(searchTerm)) &&
      (statusFilter === "All" || complaint.status === statusFilter)
  );

  const handleComplaintClick = async (complaint) => {
    setSelectedComplaint(complaint);
  };

  const handleStatusUpdate = async (complaintId, newStatus) => {
    console.log(complaintId, newStatus);

    try {
      await axios.patch("/api/complaints/" + complaintId, {
        status: newStatus,
      });
      setRefresh(!refresh);
      toast({
        title: (
          <span>
            <CheckCircleIcon className="h-6 w-6 mr-2 text-green-500 inline" />
            "Complaint status updated"
          </span>
        ),
        variant: "success",
      });
    } catch (error) {
      console.error("Error updating complaint status:", error);
    }
    setComplaints(
      complaints.map((complaint) =>
        complaint.id === complaintId
          ? { ...complaint, status: newStatus }
          : complaint
      )
    );
    if (selectedComplaint && selectedComplaint.id === complaintId) {
      setSelectedComplaint({ ...selectedComplaint, status: newStatus });
    }
  };

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
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="text"
                placeholder="Search by Complaint ID, Order ID or Customer Name"
                className="pl-8 pr-10 py-5 rounded-md flex-grow"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <ComplaintList
              complaints={filteredComplaints}
              onComplaintClick={handleComplaintClick}
            />
            {selectedComplaint && (
              <ComplaintDetails
                complaint={selectedComplaint}
                onStatusUpdate={handleStatusUpdate}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
