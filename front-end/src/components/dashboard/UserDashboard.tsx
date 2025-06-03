import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, LogOut, MapPin, FileText, Camera } from "lucide-react";

interface Issue {
  _id: string;
  title: string;
  description: string;
  location: string;
  photo?: string;
  status: string;
}

interface UserDashboardProps {
  token: string;
  onLogout: () => void;
}

export default function UserDashboard({ token, onLogout }: UserDashboardProps) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    photo: null as File | null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("location", form.location);
      if (form.photo) formData.append("photo", form.photo);

      const res = await fetch("http://localhost:5000/api/issues", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();

      if (res.ok) {
        setIssues((prev) => [data, ...prev]);
        setForm({ title: "", description: "", location: "", photo: null });
        setSuccess("Issue reported successfully!");
        setTimeout(() => setSuccess(""), 5000);
      } else {
        setError(data.message || "Failed to create issue");
      }
    } catch {
      setError("Server error while creating issue");
    }

    setSubmitting(false);
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

  // Separate issues into pending and resolved arrays
  const pendingIssues = issues.filter(
    (issue) => issue.status?.toLowerCase() === "pending"
  );
  const resolvedIssues = issues.filter(
    (issue) => issue.status?.toLowerCase() === "resolved"
  );

  const renderIssueCard = (issue: Issue) => (
    <Card key={issue._id} className="overflow-hidden">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{issue.title}</CardTitle>
          <Badge variant={getStatusVariant(issue.status)}>
            {issue.status || "Pending"}
          </Badge>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          {issue.location}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm">{issue.description}</p>

        {issue.photo && (
          <div className="relative">
            <img
              src={`http://localhost:5000${issue.photo}`}
              alt="Issue"
              className="w-full h-48 object-cover rounded-md"
            />
            <div className="absolute top-2 right-2">
              <Camera className="h-4 w-4 text-white" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Report and track community issues
            </p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Alerts */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-200 bg-green-50 text-green-800">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Report Issue Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Report New Issue
            </CardTitle>
            <CardDescription>
              Help improve your community by reporting issues that need
              attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Brief description of the issue"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    required
                    disabled={submitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Where is this issue located?"
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    required
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about the issue"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  required
                  disabled={submitting}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo">Photo (optional)</Label>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setForm({ ...form, photo: e.target.files?.[0] || null })
                  }
                  disabled={submitting}
                />
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className="w-full md:w-auto"
              >
                {submitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {submitting ? "Reporting..." : "Report Issue"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Separator />

        {/* Pending Issues Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-orange-600">
            Pending Issues
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading issues...</span>
            </div>
          ) : pendingIssues.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No pending issues.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pendingIssues.map(renderIssueCard)}
            </div>
          )}
        </div>

        <Separator />

        {/* Resolved Issues Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-6 text-green-600">
            Resolved Issues
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading issues...</span>
            </div>
          ) : resolvedIssues.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No resolved issues.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resolvedIssues.map(renderIssueCard)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
