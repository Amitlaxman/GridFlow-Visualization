"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { recommendAlgorithm, type AlgorithmRecommendationOutput } from "@/ai/flows/algorithm-recommendation";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Wand2, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  busCount: z.coerce.number().int().min(2, "At least 2 buses required.").max(10000, "Bus count too high."),
  nodeCount: z.coerce.number().int().min(2, "At least 2 nodes required.").max(10000, "Node count too high."),
  lineImpedancePattern: z.string().min(5, "Please provide a brief description.").max(100),
});

type FormValues = z.infer<typeof formSchema>;

export function Recommender() {
  const [recommendation, setRecommendation] = useState<AlgorithmRecommendationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      busCount: 6,
      nodeCount: 10,
      lineImpedancePattern: "Uniform with some variance",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setIsLoading(true);
    setRecommendation(null);
    try {
      const result = await recommendAlgorithm(data);
      setRecommendation(result);
    } catch (error) {
      console.error("Error getting recommendation:", error);
      toast({
        variant: "destructive",
        title: "Recommendation Failed",
        description: "Could not get a recommendation from the AI. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-transparent border-t border-border rounded-none shadow-none">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Wand2 className="text-primary" />
          Smart Algorithm Recommender
        </CardTitle>
        <CardDescription>Let AI suggest the best algorithm for your grid configuration.</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="busCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bus Count</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nodeCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Node Count</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lineImpedancePattern"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Line Impedance Pattern</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Highly variable, uniform" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Get Recommendation"
              )}
            </Button>
          </form>
        </Form>
        {recommendation && (
          <Alert className="mt-4 bg-background/50">
            <Lightbulb className="h-4 w-4 text-accent" />
            <AlertTitle className="text-foreground">Recommended: {recommendation.algorithm}</AlertTitle>
            <AlertDescription>{recommendation.reasoning}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
