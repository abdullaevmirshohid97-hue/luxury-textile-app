import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Mail, Phone, Trash2 } from "lucide-react";
import { format } from "date-fns";
import type { Inquiry } from "@shared/schema";

const statusColors: Record<string, string> = {
  new: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  contacted: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  completed: "bg-green-500/10 text-green-600 border-green-500/20",
  archived: "bg-gray-500/10 text-gray-600 border-gray-500/20",
};

export default function AdminInquiries() {
  const { toast } = useToast();

  const { data: inquiries = [], isLoading } = useQuery<Inquiry[]>({
    queryKey: ["/api/admin/inquiries"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return apiRequest("PATCH", `/api/admin/inquiries/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Success", description: "Status updated" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/admin/inquiries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
      toast({ title: "Success", description: "Inquiry deleted" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete inquiry", variant: "destructive" });
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold" data-testid="text-inquiries-title">Inquiries</h1>
        <p className="text-body text-muted-foreground">Manage customer inquiries and requests</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : inquiries.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-body text-muted-foreground">No inquiries yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inquiries.map((inquiry) => (
                  <TableRow key={inquiry.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-body" data-testid={`text-inquiry-name-${inquiry.id}`}>
                          {inquiry.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <a
                            href={`mailto:${inquiry.email}`}
                            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                          >
                            <Mail className="h-3 w-3" />
                            {inquiry.email}
                          </a>
                          {inquiry.phone && (
                            <a
                              href={`tel:${inquiry.phone}`}
                              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                            >
                              <Phone className="h-3 w-3" />
                              {inquiry.phone}
                            </a>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-body text-sm text-muted-foreground truncate">
                        {inquiry.message}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={inquiry.status}
                        onValueChange={(value) => updateStatusMutation.mutate({ id: inquiry.id, status: value })}
                      >
                        <SelectTrigger className="w-28" data-testid={`select-status-${inquiry.id}`}>
                          <Badge variant="outline" className={statusColors[inquiry.status]}>
                            {inquiry.status}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-body text-sm text-muted-foreground">
                      {inquiry.createdAt ? format(new Date(inquiry.createdAt), "MMM d, yyyy") : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteMutation.mutate(inquiry.id)}
                        data-testid={`button-delete-inquiry-${inquiry.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
