import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

const activities = [
  { id: 1, message: "Order #12345: Out for delivery → Driver: John Doe" },
  { id: 2, message: "Order #67890: Delayed, new ETA 2pm" },
  { id: 3, message: "Customer message received: 'Why is my delivery late?'" },
  { id: 4, message: "Order #54321: Delivered successfully" },
  { id: 5, message: "New escalation: Order #98765 - Missing item" },
];

export default function RecentActivity() {
  const [isShow, setIsShow] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Recent Activity</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">View All</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Activity</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <CardContent>
              <ul className="space-y-4">
                {activities.map((activity) => (
                  <li
                    key={activity.id}
                    className="bg-gray-50 p-3 rounded-md text-sm"
                  >
                    {activity.message}
                  </li>
                ))}
              </ul>
            </CardContent>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {activities.map((activity) => (
            <li key={activity.id} className="bg-gray-50 p-3 rounded-md text-sm">
              {activity.message}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
