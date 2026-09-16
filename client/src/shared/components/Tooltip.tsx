interface TooltipProps {
  text: string;
}

export function Tooltip({ text }: TooltipProps) {
  return (
    <div className="relative group inline-block">
      <span className="cursor-pointer text-text-muted p-2 text-lg">?</span>
      <div className="absolute hidden group-hover:block right-0 top-6 w-48 bg-surface shadow-md p-2 text-sm font-normal z-10">
        {text}
      </div>
    </div>
  );
}
