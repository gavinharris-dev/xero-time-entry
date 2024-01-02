"use client";

import { useXeroTimeStore } from "@/lib/store";
import { SelectItem, SelectViewport } from "@radix-ui/react-select";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { Button } from "./ui/button";

import { Cross1Icon } from "@radix-ui/react-icons";
import dynamic from "next/dynamic";

const CaptureProject_ = () => {
  const projects = useXeroTimeStore((s) => s.projects);
  const setProject = useXeroTimeStore((s) => s.selectProject);
  const project = useXeroTimeStore((s) => s.project);

  if (project.projectId !== "") {
    return (
      <div className="space-y-2 flex gap-2 justify-center items-center">
        <p>
          {project.contactName} {project.name}
        </p>
        <Button className="h-5">
          <Cross1Icon onClick={() => setProject(undefined)} />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="project">Project</Label>
      <Select
        disabled={!Boolean(projects)}
        onValueChange={(value) => {
          const proj = projects?.find((p) => p.projectId === value);
          proj && setProject(proj);
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a Project" />
        </SelectTrigger>
        <SelectContent>
          <SelectViewport>
            <SelectItem value="Test">Test</SelectItem>
            {projects
              ? projects.map((p) => {
                  return (
                    <SelectItem
                      id={p.projectId}
                      value={p.projectId}
                      key={p.projectId}
                      onClick={() => alert(p.name)}
                      onSelect={() => setProject(p)}
                    >
                      {p.contactName} - {p.name}
                    </SelectItem>
                  );
                })
              : null}
          </SelectViewport>
        </SelectContent>
      </Select>
    </div>
  );
};

export const CaptureProject = dynamic(() => Promise.resolve(CaptureProject_), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});
