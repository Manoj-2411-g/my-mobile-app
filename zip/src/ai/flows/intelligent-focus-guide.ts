'use server';
/**
 * @fileOverview An AI agent that analyzes user data to suggest an optimized focus/break schedule.
 *
 * - intelligentFocusGuide - A function that handles the intelligent focus guide process.
 * - IntelligentFocusGuideInput - The input type for the intelligentFocusGuide function.
 * - IntelligentFocusGuideOutput - The return type for the intelligentFocusGuide function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentFocusGuideInputSchema = z.object({
  pendingTasks: z
    .array(z.string())
    .describe('A list of pending study tasks for the day.'),
  totalFocusHours: z
    .number()
    .describe('The user\'s total accumulated focus hours across all sessions.'),
  dailyStreak: z.number().describe('The current daily study streak of the user.'),
});
export type IntelligentFocusGuideInput = z.infer<
  typeof IntelligentFocusGuideInputSchema
>;

const IntelligentFocusGuideOutputSchema = z.object({
  focusDurationMinutes: z
    .number()
    .describe('Suggested duration for a focus session in minutes.'),
  breakDurationMinutes: z
    .number()
    .describe('Suggested duration for a break session in minutes.'),
  recommendation: z
    .string()
    .describe(
      'A natural language explanation of the suggested schedule and its rationale.'
    ),
});
export type IntelligentFocusGuideOutput = z.infer<
  typeof IntelligentFocusGuideOutputSchema
>;

export async function intelligentFocusGuide(
  input: IntelligentFocusGuideInput
): Promise<IntelligentFocusGuideOutput> {
  return intelligentFocusGuideFlow(input);
}

const intelligentFocusGuidePrompt = ai.definePrompt({
  name: 'intelligentFocusGuidePrompt',
  input: {schema: IntelligentFocusGuideInputSchema},
  output: {schema: IntelligentFocusGuideOutputSchema},
  prompt: `You are an Intelligent Focus Guide AI. Your goal is to provide a personalized focus and break schedule for the day, optimizing study sessions based on the user's pending tasks and historical focus data. Respond with a JSON object containing suggested focus and break durations in minutes, and a clear natural language recommendation.

Consider the following data:

Pending Tasks: {{{pendingTasks}}}
Total Focus Hours: {{{totalFocusHours}}}
Daily Streak: {{{dailyStreak}}}


Based on these inputs, provide an optimized focus/break schedule. For example, if the user has many tasks and a high daily streak, suggest longer focus sessions. If total focus hours are low, suggest starting with shorter, more manageable focus sessions. Aim for a balanced and sustainable schedule.
`,
});

const intelligentFocusGuideFlow = ai.defineFlow(
  {
    name: 'intelligentFocusGuideFlow',
    inputSchema: IntelligentFocusGuideInputSchema,
    outputSchema: IntelligentFocusGuideOutputSchema,
  },
  async input => {
    const {output} = await intelligentFocusGuidePrompt(input);
    if (!output) {
      throw new Error('Failed to generate intelligent focus guide output.');
    }
    return output;
  }
);
