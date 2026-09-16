interface TooltipProps {
  text: string;
}

export function Tooltip({ text }: TooltipProps) {
  return (
    <div className="relative group inline-flex items-center">
      <span className="cursor-pointer text-feedback-warning ml-2 text-sm border rounded-full w-4 h-4 inline-flex items-center justify-center p-2 ">
        i
      </span>
      <div className="absolute hidden group-hover:block right-0 top-6 w-48 bg-surface shadow-md p-2 text-sm font-normal z-10 text-feedback-error border">
        {text}
      </div>
    </div>
  );
}
