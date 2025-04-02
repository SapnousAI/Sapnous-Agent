
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function RecordingsGallery() {
  return (
    <Card id="recordings" className="animated-panel">
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="dashboard-subtitle">🎥 Recordings</h2>
          <Button variant="outline" size="sm">
            <RefreshCw size={14} className="mr-2" />
            Refresh Recordings
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border overflow-hidden card-hover">
              <div className="aspect-video bg-muted flex items-center justify-center">
                <div className="text-muted-foreground text-sm">Recording {i}</div>
              </div>
              <div className="p-3">
                <p className="text-sm font-medium truncate">Recording_{i}.mp4</p>
                <p className="text-xs text-muted-foreground">Today, 12:34 PM</p>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
