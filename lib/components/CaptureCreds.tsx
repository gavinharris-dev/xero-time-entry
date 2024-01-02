"use client";

import { useXeroTimeStore } from "../store";
import { Card, CardTitle, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function CaptureCreds() {
  const setCurl = useXeroTimeStore((s) => s.setCurl);
  const curl = useXeroTimeStore((s) => s.curl);

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Capture Credentials</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <Input
          value={curl}
          onChange={(v) => setCurl(v.currentTarget.value)}
          type="text"
          placeholder="CURL Command"
          className="max-w-xs"
        />
      </CardContent>
    </Card>
  );
}
