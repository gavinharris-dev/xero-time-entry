import { useXeroTimeStore } from "@/lib/store";
import { Calendar } from "./ui/calendar";
import { DayClickEventHandler, DayModifiers } from "react-day-picker";
import { isSameDay, parse } from "date-fns";
import { Button } from "./ui/button";

export function CaptureDates() {
  const days = useXeroTimeStore((s) => s.days);
  const setDays = useXeroTimeStore((s) => s.selectDays);
  const task = useXeroTimeStore((s) => s.task);

  const daysWithTimeEntries = useXeroTimeStore((s) => {
    return (
      s.timeEntries?.map((te) => {
        return te && new Date(Date.parse(te.dateUtc));
      }) || []
    );
  });

  console.log(daysWithTimeEntries);
  if (!task) return null;
  const handleDayClick: DayClickEventHandler = (day, modifiers) => {
    const newSelectedDays = [...days];
    if (modifiers.selected) {
      const index = days.findIndex((selectedDay) =>
        isSameDay(day, selectedDay),
      );
      newSelectedDays.splice(index, 1);
    } else {
      newSelectedDays.push(day);
    }
    setDays(newSelectedDays);
  };

  const handleResetClick = () => setDays([]);

  let footer = <p>Please pick one or more days.</p>;

  if (days.length > 0)
    footer = (
      <p>
        You selected {days.length} days.{" "}
        <Button onClick={handleResetClick}>Reset</Button>
      </p>
    );

  return (
    <div className="space-y-2">
      <Calendar
        mode="multiple"
        selected={days}
        modifiers={{ booked: daysWithTimeEntries }}
        modifiersStyles={{ booked: { border: "2px solid red" } }}
        onMonthChange={(month) => console.log(month)}
        onDayClick={handleDayClick}
        max={31}
        min={1}
        toDate={new Date()}
        footer={footer}
      />
    </div>
  );
}
