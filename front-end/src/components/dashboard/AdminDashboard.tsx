import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  LogOut,
  MapPin,
  CheckCircle,
  Clock,
  Camera,
  Shield,
} from "lucide-react";

interface Issue {
  _id: string;
  title: string;
  description: string;
  location: string;
  photo?: string;
  status: string;
}

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
}

export default function AdminDashboard({
  token,
  onLogout,
}: AdminDashboardProps) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:5000/api/issues", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok) {
        setIssues(data);
      } else {
        setError(data.message || "Failed to fetch issues");
      }
    } catch {
      setError("Server error while fetching issues");
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const updateStatus = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    setError("");
    try {
      const res = await fetch(`http://localhost:5000/api/issues/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Failed to update status");
      } else {
        await fetchIssues();
      }
    } catch {
      setError("Server error while updating status");
    }
    setUpdatingId(null);
  };

  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return "default";
      case "pending":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case "resolved":
        return <CheckCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Separate issues by status
  const resolvedIssues = issues.filter(
    (issue) => issue.status?.toLowerCase() === "resolved"
  );
  const pendingIssues = issues.filter(
    (issue) => issue.status?.toLowerCase() === "pending" || !issue.status
  );

  const stats = {
    total: issues.length,
    resolved: resolvedIssues.length,
    pending: pendingIssues.length,
  };

  const renderIssueCard = (issue: Issue) => (
    <Card key={issue._id} className="overflow-hidden relative z-10">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{issue.title}</CardTitle>
          <Badge
            variant={getStatusVariant(issue.status)}
            className="flex items-center gap-1"
          >
            {getStatusIcon(issue.status)}
            {issue.status || "Pending"}
          </Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          {issue.location}
        </div>
      </CardHeader>
      <CardContent className="space-y-4 relative z-10">
        <p className="text-sm">{issue.description}</p>

        {issue.photo && (
          <div className="relative z-0">
            <img
              src={`http://localhost:5000${issue.photo}`}
              alt="Issue"
              className="w-full h-48 object-cover rounded-md z-0"
            />
            <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1 z-20">
              <Camera className="h-4 w-4 text-white" />
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2 z-10 relative">
          <Button
            onClick={() => updateStatus(issue._id, "Resolved")}
            disabled={updatingId === issue._id}
            variant="default"
            size="sm"
            className="flex-1 cursor-pointer"
          >
            {updatingId === issue._id ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="mr-2 h-4 w-4" />
            )}
            Mark Resolved
          </Button>

          <Button
            onClick={() => updateStatus(issue._id, "Pending")}
            disabled={updatingId === issue._id}
            variant="secondary"
            size="sm"
            className="flex-1 cursor-pointer"
          >
            {updatingId === issue._id ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Clock className="mr-2 h-4 w-4" />
            )}
            Mark Pending
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage and resolve community issues
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Issues
              </CardTitle>
              <div className="h-4 w-4 text-muted-foreground">📊</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.resolved}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.pending}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Separator />

        {/* Pending Issues */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-orange-600">
            Pending Issues
          </h2>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading issues...</span>
            </div>
          ) : pendingIssues.length === 0 ? (
            <p className="text-muted-foreground">No pending issues.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pendingIssues.map(renderIssueCard)}
            </div>
          )}
        </div>

        <Separator />

        {/* Resolved Issues */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 text-green-600">
            Resolved Issues
          </h2>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading issues...</span>
            </div>
          ) : resolvedIssues.length === 0 ? (
            <p className="text-muted-foreground">No resolved issues.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {resolvedIssues.map(renderIssueCard)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
