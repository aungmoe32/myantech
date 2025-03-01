"use client";

import { useContext, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomerLayout from "../layout/CustomerLayout";
import { DataContext } from "../context/DataContext";
import { ShoppingCart, Truck, CreditCard } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  handleFailureToast,
  handleSuccessToast,
  handleWarningToast,
} from "../helpers/ToastService";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const { cartItems, setCartItems, setRefresh, refresh } =
    useContext(DataContext);
  const [shipmentCost, setShipmentCost] = useState(10.0);
  const [total, setTotal] = useState(0.0);
  const [cities, setCities] = useState([]);

  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [shipmentInfo, setShipmentInfo] = useState({
    name: "",
    phone: "",
    city: "",
    address: "",
    zipCode: "",
  });

  const subTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const fetchCity = async () => {
    try {
      const res = await axios.get("/api/cities");
      setCities(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchCity();
  }, []);

  const handleFormChange = (field, value) => {
    setShipmentInfo((prev) => ({ ...prev, [field]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (currentUser === null) {
      handleWarningToast("You have to login first!");
      return;
    }
    if (cartItems.length === 0) {
      handleWarningToast("You haven't selected any product to buy yet!");
      return;
    }

    if (
      shipmentInfo.name === "" ||
      shipmentInfo.address === "" ||
      shipmentInfo.city === "" ||
      shipmentInfo.phone === "" ||
      shipmentInfo.phone === ""
    ) {
      handleWarningToast("Please fill all the required fields!");
      return;
    }
    const items = cartItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      unitprice_id: item.price_id,
    }));

    try {
      const res = await axios.post("/api/orders", {
        shipmentInfo: shipmentInfo,
        items: items,
        payment: "paypal",
        total: total,
        customer_id: currentUser.id,
      });

      if (res.status === 201) {
        setCartItems([]);

        setRefresh(!refresh);

        handleSuccessToast("Order has been successfully!");
        navigate("/products");
      }
    } catch (error) {
      console.log(error);
      handleFailureToast("Ordering failed: " + error.message);
    }
  };

  useEffect(() => {
    setTotal(subTotal + shipmentCost);
  }, [shipmentCost, subTotal]);

  return (
    <CustomerLayout>
      <div className="min-h-screen bg-gray-50 pb-12">
        <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-8 font-['geist']">
            Checkout
          </h1>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flow-root">
                    <ul className="-my-6 divide-y divide-gray-200">
                      {cartItems.map((item) => (
                        <li className="flex py-6" key={item.id}>
                          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <img
                              src={item.image}
                              alt="Premium Wireless Headphones"
                              className="h-full w-full object-cover object-center"
                            />
                          </div>
                          <div className="ml-4 flex flex-1 flex-col">
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {item.name}
                              </h3>
                              <p className="mt-1 text-sm text-gray-500">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                            <div className="mt-4 flex items-end justify-between flex-1 text-sm">
                              <p className="text-gray-500">
                                ${item.price.toFixed(2)} each
                              </p>
                              <p className="font-medium text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Order Total
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Subtotal</p>
                      <p className="text-sm font-medium text-gray-900">
                        ${subTotal.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Shipping</p>
                      <p className="text-sm font-medium text-gray-900">
                        ${shipmentCost.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">Tax</p>
                      <p className="text-sm font-medium text-gray-900">$0.00</p>
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                      <p className="text-base font-medium text-gray-900">
                        Order total
                      </p>
                      <p className="text-base font-bold text-primary">
                        ${total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="flex items-center text-primary">
                    <Truck className="mr-2 h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={submit}>
                    <div className="grid gap-4 sm:grid-cols-2 mb-3">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          type="text"
                          className="mt-1"
                          placeholder="John Doe"
                          value={shipmentInfo.name}
                          onChange={(e) =>
                            handleFormChange("name", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          className="mt-1"
                          placeholder="(123) 456-7890"
                          value={shipmentInfo.phone}
                          onChange={(e) =>
                            handleFormChange("phone", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="mb-3">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Select
                          onValueChange={(value) =>
                            handleFormChange("city", value)
                          }
                          value={shipmentInfo.city.toString()}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select City" />
                          </SelectTrigger>
                          <SelectContent>
                            {cities.map((city) => (
                              <SelectItem
                                key={city.id}
                                value={city.id.toString()}
                              >
                                {city.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        className="mt-1"
                        placeholder="123 Main St"
                        value={shipmentInfo.address}
                        onChange={(e) =>
                          handleFormChange("address", e.target.value)
                        }
                      />
                    </div>
                    <div className=" mt-3">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input
                        id="zip"
                        className="mt-1"
                        placeholder="12345"
                        value={shipmentInfo.zipCode}
                        onChange={(e) =>
                          handleFormChange("zipCode", e.target.value)
                        }
                      />
                    </div>
                    <div className="mt-8 flex justify-end">
                      <Button
                        size="lg"
                        type="submit"
                        className="font-semibold px-6"
                      >
                        Complete Order
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
