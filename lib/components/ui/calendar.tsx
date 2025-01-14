"use client";

import * as React from "react";
import { IconChevronLeft, IconChevronRight, IconX } from "@tabler/icons-react";
import {
  DayPicker,
  type DropdownOption,
  type DropdownProps,
} from "react-day-picker";

import { cn } from "../../utils";
import { Button, buttonVariants } from "./button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { type ChangeEvent, useId, useRef, useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

function CalendarDropdown({
  options,
  value,
  ...moreProps
}: DropdownProps & { container: HTMLDivElement | null }) {
  const selectedOption = options?.find(({ value: v }) => v === value);
  const is_month_select = Number.isNaN(
    Number.parseInt(selectedOption?.label as any),
  );
  if (options === undefined) return null;
  const Elem = is_month_select ? CalendarMonthDropdown : CalendarYearDropdown;
  return (
    <Elem
      options={options}
      value={value}
      selectedOption={selectedOption as DropdownOption}
      {...moreProps}
    />
  );
}

function CalendarMonthDropdown({
  options,
  value,
  onChange,
  container,
  selectedOption,
  ...moreProps
}: DropdownProps & {
  container: HTMLDivElement | null;
  selectedOption: DropdownOption;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const uuid = useId();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="h-7 font-medium text-sm first:rounded-r-none first:pr-2 last:rounded-l-none last:pl-2"
          size="sm"
          variant="ghost"
          onClick={() => setOpen(!open)}
        >
          {selectedOption?.label}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="absolute flex h-full w-full flex-col justify-start gap-2 border-none p-2 pt-4"
        container={container}
        hideOverlay
        hideCloseButton
      >
        <VisuallyHidden>
          <DialogTitle>Months select</DialogTitle>
          <DialogDescription />
        </VisuallyHidden>
        <Button onClick={() => setOpen(false)} variant="ghost" className="h-7">
          <IconX className="size-4" />
        </Button>

        <div className="grid grow grid-cols-3 gap-1">
          {options?.map((option) => (
            <Button
              variant={option.value === value ? "secondary" : "ghost"}
              key={`${uuid}::${option.value}`}
              ref={option.value === value ? ref : undefined}
              className="h-auto text-xs"
              size="lg"
              disabled={option.disabled}
              onLoad={() => ref.current?.scrollIntoView({ behavior: "smooth" })}
              onClick={() => {
                const event = {
                  target: { value: option.value },
                } as unknown as ChangeEvent<HTMLSelectElement>;
                onChange?.(event);
                setOpen(false);
              }}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CalendarYearDropdown({
  options,
  value,
  onChange,
  container,
  selectedOption,
  ...moreProps
}: DropdownProps & {
  container: HTMLDivElement | null;
  selectedOption: DropdownOption;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const uuid = useId();
  const validOptions = options?.filter((option) => !option.disabled);
  const max_value =
    ((validOptions as any)[(validOptions as any).length - 1].value as
      | number
      | undefined) ?? 2200;
  const min_value =
    ((validOptions as any)[0].value as number | undefined) ?? 1971;
  const [page, setPage] = useState(Math.floor(selectedOption.value / 10));

  const pageOptions = validOptions?.filter(
    (option) => option.value >= page * 10 && option.value < (page + 1) * 10,
  );

  const disable_prev_page = page - 1 < Math.floor(min_value / 10);
  const disable_next_page = page + 1 > Math.floor(max_value / 10);

  const prevPage = () => {
    if (disable_prev_page) return;
    setPage((p) => p - 1);
  };
  const nextPage = () => {
    if (disable_next_page) return;
    setPage((p) => p + 1);
  };

  const openDialog = () => {
    setOpen(true);
    setPage(Math.floor(selectedOption.value / 10));
  };

  return (
    <Dialog open={open} onOpenChange={openDialog}>
      <DialogTrigger asChild>
        <Button
          className="h-7 font-medium text-sm first:rounded-r-none first:pr-2 last:rounded-l-none last:pl-2"
          size="sm"
          variant="ghost"
          onClick={() => setOpen(!open)}
        >
          {selectedOption?.label}
        </Button>
      </DialogTrigger>
      <DialogContent
        className="absolute flex h-full w-full flex-col justify-start gap-2 border-none p-2 pt-4"
        container={container}
        hideOverlay
        hideCloseButton
      >
        <VisuallyHidden>
          <DialogTitle>Year select</DialogTitle>
          <DialogDescription />
        </VisuallyHidden>
        <div className="flex justify-between gap-2">
          <Button
            onClick={prevPage}
            variant="outline"
            className="size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
            disabled={disable_prev_page}
          >
            <IconChevronLeft className="size-4" />
          </Button>
          <Button
            onClick={() => setOpen(false)}
            variant="ghost"
            className="h-7 grow"
          >
            <IconX className="size-4" />
          </Button>
          <Button
            onClick={nextPage}
            variant="outline"
            className="size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
            disabled={disable_next_page}
          >
            <IconChevronRight className="size-4" />
          </Button>
        </div>
        <div dir="rtl" className="grid grow grid-cols-2 gap-2">
          {pageOptions?.reverse()?.map((option) => (
            <Button
              variant={option.value === value ? "secondary" : "ghost"}
              key={`${uuid}::${option.value}`}
              ref={option.value === value ? ref : undefined}
              size="lg"
              className="h-auto text-xs"
              disabled={option.disabled}
              onLoad={() => ref.current?.scrollIntoView({ behavior: "smooth" })}
              onClick={() => {
                const event = {
                  target: { value: option.value },
                } as unknown as ChangeEvent<HTMLSelectElement>;
                onChange?.(event);
                setOpen(false);
              }}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="relative" ref={ref}>
      <DayPicker
        showOutsideDays={showOutsideDays}
        captionLayout="dropdown"
        className={cn("p-3", className)}
        startMonth={new Date(1970, 12)}
        endMonth={new Date(2200, 1)}
        classNames={{
          months: "flex flex-col sm:flex-row gap-y-4 sm:gap-x-4 sm:gap-y-0",
          month: "flex flex-col gap-y-2 pt-9",
          month_caption: "flex justify-center  items-center",
          dropdowns: "flex absolute top-4 left-1/2 -translate-x-1/2",
          dropdown: "flex",
          caption_label: "text-sm font-medium",
          nav: "flex items-center absolute inset-x-0",
          button_previous: cn(
            buttonVariants({ variant: "outline" }),
            "size-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute z-10 left-2 top-1",
          ),
          button_next: cn(
            buttonVariants({ variant: "outline" }),
            "size-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute z-10 right-2 top-1",
          ),
          month_grid: "w-full border-collapse space-y-1",
          weekdays: "flex space-x-1",
          weekday:
            "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
          week: "flex w-full gap-1",
          weeks: "flex flex-col gap-1",
          day: cn(
            "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 aria-selected:bg-primary/50 aria-selected:[&.day-outside]:bg-accent/50",
            props.mode === "range"
              ? "[&.day-range-end]:rounded-r-md [&.day-range-start]:rounded-l-md aria-selected:[&.day-range-end]:rounded-r-md first:aria-selected:rounded-l-md last:aria-selected:rounded-r-md"
              : "aria-selected:rounded-md",
          ),
          day_button: cn(
            buttonVariants({ variant: "ghost" }),
            "size-8 p-0 font-normal",
          ),
          range_start:
            "day-range-start before:absolute before:-right-0.5 before:top-0 before:w-0.5 before:bg-primary/50 before:bottom-0 [&.day-outside]:before:bg-accent/50",
          range_end:
            "day-range-end before:absolute [&.day-range-start]:before:bg-transparent before:-left-0.5 before:top-0 before:w-0.5 before:bg-primary/50 before:bottom-0 [&.day-outside]:before:bg-accent/50",
          selected:
            "day-selected *:bg-primary *:text-primary-foreground *:hover:bg-primary *:hover:text-primary-foreground *:focus:bg-primary *:focus:text-primary-foreground *:opacity-100",
          today: "*:bg-secondary *:text-secondary-foreground",
          outside:
            "day-outside *:text-muted-foreground *:opacity-50 *:aria-selected:bg-accent/50 *:aria-selected:text-muted-foreground *:aria-selected:opacity-30",
          disabled: "text-muted-foreground opacity-50",
          range_middle:
            "day-range-middle *:aria-selected:bg-transparent *:aria-selected:text-accent-foreground w-9 -mx-0.5",
          hidden: "invisible",
          ...classNames,
        }}
        components={{
          Chevron: ({ ...props }) =>
            props.orientation === "left" ? (
              <IconChevronLeft className="size-4" />
            ) : (
              <IconChevronRight className="size-4" />
            ),
          Dropdown: ({ ...props }) => (
            <CalendarDropdown {...props} container={ref.current} />
          ),
        }}
        {...props}
      />
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
