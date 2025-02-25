import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomerList from "../../components/Sales/CustomerList";
import CustomerProfile from "../../components/Sales/CustomerProfile";
import ChatInterface from "../../components/Sales/ChatInterface";
import axios from "axios";
import { useEffect, useState } from "react";
import WrongOrderModal from "../../components/WrongOrderModal";
import { X } from "lucide-react";
import { Search } from "lucide-react";

export default function CustomerInteractionPage() {
  const [allComplaints, setAllComplaints] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaints, setSelectedComplaints] = useState();
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/complaints");
      setComplaints(res.data);

      setAllComplaints(res.data);
      setSelectedComplaints(res.data[0]);
      const query = new URLSearchParams(window.location.search);
      const complaintId = query.get("complaintId");

      if (complaintId) {
        setSelectedComplaints(res.data.find((c) => c.id == complaintId));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const changeOrder = (id) => {
    setSelectedComplaints(complaints.find((c) => c.id === id));
  };

  useEffect(() => {
    if (search.trim() === "") {
      setComplaints(allComplaints);
    } else {
      setComplaints(
        allComplaints.filter((c) =>
          c.customer.user.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search, allComplaints]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Customer Interaction</h1>
      <div className="flex justify-between space-x-5 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search"
            className="pl-8 pr-10 bg-white py-5 rounded-md"
          />
          {search && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full"
              onClick={() => setSearch("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
        <WrongOrderModal selectComplaint={selectedComplaints} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Customers</CardTitle>
          </CardHeader>
          <CardContent>
            {complaints.length > 0 ? (
              <CustomerList
                complaints={complaints}
                changeOrder={changeOrder}
                selectedId={selectedComplaints.id}
              />
            ) : (
              <>No Customer Complaints</>
            )}
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <Tabs defaultValue="profile">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Customer Details</CardTitle>
                <TabsList>
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent>
              <TabsContent value="profile">
                {selectedComplaints && (
                  <CustomerProfile selectedComplaints={selectedComplaints} />
                )}
              </TabsContent>
              <TabsContent value="chat">
                <ChatInterface selectedComplaints={selectedComplaints} />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
