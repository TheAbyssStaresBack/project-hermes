import { Constants, type Enums } from '@/types/supabase';
import { google } from '@ai-sdk/google';
import { generateText, Output } from 'ai';
import { z } from 'zod';

type IncidentSeverity = Enums<'incident_severity'>;
const INCIDENT_SEVERITIES = Constants.public.Enums
  .incident_severity as readonly IncidentSeverity[];

export interface ParsedIncidentReport {
  incidentTypeName: string;
  severity: IncidentSeverity;
  description: string;
  locationDescription: string;
}

export async function parseFreeformIncidentReport({
  userInput,
  allowedIncidentTypeNames,
}: {
  userInput: string;
  allowedIncidentTypeNames: string[];
}): Promise<ParsedIncidentReport> {
  if (allowedIncidentTypeNames.length === 0) {
    throw new Error(
      'No incident types are configured yet. Please contact support.'
    );
  }

  const incidentTypeNameEnum = z.enum(
    allowedIncidentTypeNames as [string, ...string[]]
  );

  const parsedIncidentSchema = z.object({
    incidentTypeName: incidentTypeNameEnum.describe(
      'Incident type selected from the incident types table.'
    ),
    severity: z
      .enum(INCIDENT_SEVERITIES)
      .describe('Severity level of the incident.'),
    description: z
      .string()
      .min(10)
      .max(1200)
      .describe('Concise description of what happened.'),
    locationDescription: z
      .string()
      .min(3)
      .max(500)
      .describe(
        'Human-readable location (landmarks, street, barangay, city). Never coordinates.'
      ),
  });

  const result = await generateText({
    model: google('gemini-2.5-flash-lite'),
    output: Output.object({
      schema: parsedIncidentSchema,
    }),
    temperature: 0,
    system: 'Extract a structured incident report from user text.',
    prompt: userInput,
  });

  return {
    incidentTypeName: result.output.incidentTypeName,
    severity: result.output.severity,
    description: result.output.description.trim(),
    locationDescription: result.output.locationDescription.trim(),
  };
}
