import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useXeroTimeStore } from "@/lib/store";
import { format, formatISO, isSameDay } from "date-fns";
import { Button } from "./ui/button";

export function CaptureHours() {
  const [hours, setHours] = useState(8);
  const submitHoursForSelectedDays = useXeroTimeStore(
    (s) => s.submitHoursForSelectedDays,
  );

  return (
    <div className="space-y-2">
      <Label htmlFor="hours">Hours</Label>
      <Input
        id="hours"
        value={hours}
        onChange={(e) => setHours(parseFloat(e.currentTarget.value))}
      />
      <hr />
      <span className="flex gap-2 justify-evenly">
        <Button>Clear</Button>
        <Button onClick={() => submitHoursForSelectedDays(hours)}>
          Submit
        </Button>
      </span>
    </div>
  );
}
