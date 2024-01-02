"use client";

import { CaptureCreds } from "@/components/CaptureCreds";
import { CaptureDates } from "@/components/CaptureDates";
import { CaptureHours } from "@/components/CaptureHours";
import { CaptureProject } from "@/components/CaptureProject";
import { CaptureTask } from "@/components/CaptureTask";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Time Capture</CardTitle>
          <CardDescription>
            Input the details of your project and track time.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <CaptureProject />
          <CaptureTask />
          <CaptureDates />
          <CaptureHours />
        </CardContent>
      </Card>

      <CaptureCreds />
    </main>
  );
}
