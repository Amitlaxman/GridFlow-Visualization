"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { HelpCircle, Zap, Factory, Cog } from "lucide-react"

export function ExplanationGuide() {
  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader className="p-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <HelpCircle className="text-primary" />
          Understanding the Grid
        </CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>What do the elements represent?</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-3 text-sm text-muted-foreground pl-2">
                <li className="flex items-start gap-2">
                  <Cog className="h-4 w-4 mt-1 text-primary shrink-0" /> 
                  <span><strong>Circles (Buses):</strong> These are the nodes of the power grid. They can be generators, loads (consumers), or simply connection points.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="h-4 w-4 mt-1 text-primary shrink-0" />
                  <span><strong>Generator Buses:</strong> These inject power into the grid.</span>
                </li>
                 <li className="flex items-start gap-2">
                  <Factory className="h-4 w-4 mt-1 text-primary shrink-0" />
                  <span><strong>Load Buses:</strong> These consume power from the grid.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="h-4 w-4 mt-1 shrink-0 flex items-center justify-center">
                    <div className="w-1 h-4 bg-secondary" />
                  </div>
                  <span><strong>Lines:</strong> These are the transmission lines that carry electricity between buses. The moving particles represent the flow of power.</span>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>What does "p.u." mean?</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground pl-2">
              <p>
                <strong>p.u.</strong> stands for "per-unit." It is a way to normalize quantities in a power system (like voltage, current, and power) to a common base value.
              </p>
              <p className="mt-2">
                A voltage of <strong>1.0 p.u.</strong> is considered ideal. Deviations from this value indicate voltage drops or rises in the network, which these algorithms help to calculate and manage.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>What are power flow algorithms?</AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground pl-2">
              <p>
                Power flow (or load-flow) studies are essential for planning and operating power systems. These algorithms solve complex equations to determine the voltage at each bus and the power flowing through each transmission line.
              </p>
              <p className="mt-2">
                Each algorithm offers a different trade-off between speed, accuracy, and computational resources, making them suitable for different scenarios.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
