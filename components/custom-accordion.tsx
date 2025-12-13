import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface CustomAccordionProps {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const CustomAccordion = ({
  label,
  children,
  defaultOpen = false,
}: CustomAccordionProps) => {
  return (
    <div className="w-full border rounded-lg bg-card shadow-sm overflow-hidden">
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue={defaultOpen ? "item-1" : undefined}
      >
        <AccordionItem value="item-1" className="border-0">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 transition-colors group">
            <div className="flex items-center justify-between w-full mr-4">
              <span className="font-semibold text-foreground">{label}</span>
              <span className="text-sm font-medium text-muted-foreground">
                <span className="group-data-[state=open]:hidden">Open</span>
                <span className="group-data-[state=closed]:hidden">Close</span>
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6 pt-2">
            {children}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
