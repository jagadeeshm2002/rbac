// ts-ignore
import React, { useState } from "react";
import axios from "axios";
import { Send, Copy, Plus, Minus, Server } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Predefined endpoints
const PREDEFINED_ENDPOINTS = [
  {
    group: "Admin",
    endpoints: [
      {
        name: "Admin Roles",
        url: "http://localhost:3000/api/admin/role",
        methods: ["GET", "POST", "PUT", "DELETE"],
      },
      {
        name: "Admin Stats",
        url: "http://localhost:3000/api/admin/stats",
        methods: ["GET"],
      },
    ],
  },
  {
    group: "Users",
    endpoints: [
      {
        name: "User List",
        url: "http://localhost:3000/api/users",
        methods: ["GET", "POST"],
      },
      {
        name: "User Details",
        url: "http://localhost:3000/api/users/:id",
        methods: ["GET", "PUT", "DELETE"],
      },
    ],
  },
  {
    group: "Auth",
    endpoints: [
      {
        name: "sigin",
        url: "http://localhost:3000/api/auth",
        methods: ["POST"],
      },
    ],
  },
];

// Sample body templates for different endpoints
const BODY_TEMPLATES = {
  "http://localhost:3000/api/admin/role": {
    POST: JSON.stringify(
      {
        name: "New Role",
        permissions: ["read", "write"],
      },
      null,
      2
    ),
    PUT: JSON.stringify(
      {
        id: "role_id",
        name: "Updated Role",
        permissions: ["read", "write", "delete"],
      },
      null,
      2
    ),
  },
  "http://localhost:3000/api/users": {
    POST: JSON.stringify(
      {
        username: "newuser",
        email: "newuser@example.com",
        password: "securepassword123",
      },
      null,
      2
    ),
  },
  "http://localhost:3000/api/auth/": {
    POST: JSON.stringify(
      {
        email: "test@gmail.com",
        password: "test123",
      },
      null,
      2
    ),
  },
};

const ApiTesting = () => {
  const [endpoint, setEndpoint] = useState("");
  const [method, setMethod] = useState("GET");
  const [params, setParams] = useState([{ key: "", value: "" }]);
  const [headers, setHeaders] = useState([{ key: "Authorization", value: "Bearer " }]);
  const [body, setBody] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [availableMethods, setAvailableMethods] = useState(["GET"]);

  // Select a predefined endpoint
  const selectPredefinedEndpoint = (selectedEndpoint) => {
    setEndpoint(selectedEndpoint.url);
    setAvailableMethods(selectedEndpoint.methods);

    // Reset method to first available method
    setMethod(selectedEndpoint.methods[0]);

    // Set body template if available
    const bodyTemplate =
      BODY_TEMPLATES[selectedEndpoint.url]?.[selectedEndpoint.methods[0]] || "";
    setBody(bodyTemplate);
  };

  // Add a new parameter/header row
  const addRow = (type) => {
    if (type === "params") {
      setParams([...params, { key: "", value: "" }]);
    } else {
      setHeaders([...headers, { key: "", value: "" }]);
    }
  };

  // Remove a parameter/header row
  const removeRow = (type, index) => {
    if (type === "params") {
      const newParams = [...params];
      newParams.splice(index, 1);
      setParams(newParams);
    } else {
      const newHeaders = [...headers];
      newHeaders.splice(index, 1);
      setHeaders(newHeaders);
    }
  };

  // Update parameter/header row
  const updateRow = (type, index, key, value) => {
    if (type === "params") {
      const newParams = [...params];
      newParams[index] = { key, value };
      setParams(newParams);
    } else {
      const newHeaders = [...headers];
      newHeaders[index] = { key, value };
      setHeaders(newHeaders);
    }
  };

  // Perform API request
  const performRequest = async () => {
    setLoading(true);
    setResponse(null);

    try {
      // Construct query parameters
      const queryParams = Object.fromEntries(
        params.filter((p) => p.key && p.value).map((p) => [p.key, p.value])
      );

      // Construct headers
      const requestHeaders = Object.fromEntries(
        headers.filter((h) => h.key && h.value).map((h) => [h.key, h.value])
      );

      // Prepare request configuration
      const config = {
        method,
        url: endpoint,
        params: queryParams,
        headers: requestHeaders,
      };

      // Add body for methods that support it
      if (["POST", "PUT", "PATCH"].includes(method)) {
        try {
          // Try to parse body as JSON
          config.data = body ? JSON.parse(body) : {};
        } catch (parseError) {
          // If parsing fails, send body as-is
          config.data = body;
        }
      }

      // Perform axios request
      const apiResponse = await axios(config);

      setResponse({
        status: apiResponse.status,
        headers: apiResponse.headers,
        body: apiResponse.data,
      });
    } catch (error) {
      setResponse({
        error: error.response
          ? {
              status: error.response.status,
              data: error.response.data,
              headers: error.response.headers,
            }
          : { message: error.message },
      });
    } finally {
      setLoading(false);
    }
  };

  // Copy response to clipboard
  const copyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>API Tester</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Server className="mr-2 h-4 w-4" /> Predefined Endpoints
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {PREDEFINED_ENDPOINTS.map((group) => (
                <React.Fragment key={group.group}>
                  <div className="px-2 py-1 text-xs font-semibold text-muted-foreground">
                    {group.group}
                  </div>
                  {group.endpoints.map((ep) => (
                    <DropdownMenuItem
                      key={ep.url}
                      onSelect={() => selectPredefinedEndpoint(ep)}
                      className="cursor-pointer"
                    >
                      {ep.name}
                    </DropdownMenuItem>
                  ))}
                </React.Fragment>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Request Section */}
            <div>
              <div className="flex space-x-2 mb-4">
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Method" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableMethods.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Enter API Endpoint"
                  value={endpoint}
                  onChange={(e) => {
                    setEndpoint(e.target.value);
                    // Reset available methods when manually editing
                    setAvailableMethods([
                      "GET",
                      "POST",
                      "PUT",
                      "DELETE",
                      "PATCH",
                    ]);
                  }}
                  className="flex-grow"
                />
                <Button
                  onClick={performRequest}
                  disabled={!endpoint || loading}
                >
                  <Send className="mr-2 h-4 w-4" /> Send
                </Button>
              </div>

              {/* Params Section */}
              <Tabs defaultValue="params">
                <TabsList className="grid w-full grid-cols-2 mb-2">
                  <TabsTrigger value="params">Parameters</TabsTrigger>
                  <TabsTrigger value="headers">Headers</TabsTrigger>
                </TabsList>
                <TabsContent value="params">
                  <div className="space-y-2">
                    {params.map((param, index) => (
                      <div key={index} className="flex space-x-2">
                        <Input
                          placeholder="Key"
                          value={param.key}
                          onChange={(e) =>
                            updateRow(
                              "params",
                              index,
                              e.target.value,
                              param.value
                            )
                          }
                          className="flex-1"
                        />
                        <Input
                          placeholder="Value"
                          value={param.value}
                          onChange={(e) =>
                            updateRow(
                              "params",
                              index,
                              param.key,
                              e.target.value
                            )
                          }
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeRow("params", index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => addRow("params")}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Parameter
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="headers">
                  <div className="space-y-2">
                    {headers.map((header, index) => (
                      <div key={index} className="flex space-x-2">
                        <Input
                          placeholder="Key"
                          value={header.key}
                          onChange={(e) =>
                            updateRow(
                              "headers",
                              index,
                              e.target.value,
                              header.value
                            )
                          }
                          className="flex-1"
                        />
                        <Input
                          placeholder="Value"
                          value={header.value}
                          onChange={(e) =>
                            updateRow(
                              "headers",
                              index,
                              header.key,
                              e.target.value
                            )
                          }
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => removeRow("headers", index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => addRow("headers")}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add Header
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Body Section for POST/PUT/PATCH */}
              {["POST", "PUT", "PATCH"].includes(method) && (
                <div className="mt-4">
                  <Textarea
                    placeholder="Request Body (JSON)"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full min-h-[200px]"
                  />
                </div>
              )}
            </div>

            {/* Response Section */}
            <div>
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Response</CardTitle>
                  <div className="flex items-center space-x-2">
                    {response?.status && (
                      <Badge
                        variant={
                          response.status >= 200 && response.status < 300
                            ? "default"
                            : "destructive"
                        }
                      >
                        Status: {response.status}
                      </Badge>
                    )}
                    {response && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={copyResponse}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px] w-full">
                    {loading ? (
                      <div className="text-center text-muted-foreground">
                        Loading...
                      </div>
                    ) : response ? (
                      response.error ? (
                        <div className="text-destructive">
                          <pre>{JSON.stringify(response.error, null, 2)}</pre>
                        </div>
                      ) : (
                        <pre className="text-xs">
                          {JSON.stringify(response.body, null, 2)}
                        </pre>
                      )
                    ) : (
                      <div className="text-center text-muted-foreground">
                        Send a request to see the response
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiTesting;
