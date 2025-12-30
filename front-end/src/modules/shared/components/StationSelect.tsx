import { useState } from "react";
import {Popover,PopoverContent,PopoverTrigger,} from "@/components/ui/popover";
import {Command,CommandInput,CommandList,CommandEmpty,CommandGroup,CommandItem,} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";

interface StationSelectProps {
  value: string;
  onChange: (value: string) => void;
  stations: { station: string; line: string }[];
  placeholder: string;
}

export function StationSelect({
  value,
  onChange,
  stations,
  placeholder,
}: StationSelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
        >
          {value ? value : placeholder}
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search station..." />
          <CommandList>
            <CommandEmpty>No station found.</CommandEmpty>

            <CommandGroup>
              {stations.map((s, i) => (
                <CommandItem
                  key={i}
                  value={s.station}
                  onSelect={() => {
                    onChange(s.station);
                    setOpen(false);
                  }}
                >
                  {s.station} ({s.line})
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
