// Works out where each skill was actually used, from the stacks listed on jobs and projects.
// The skills list and the site search both show this ("Playwright → JPMorgan Chase ’26, Trace").

type UsedIn = { label: string; stack?: string[] };

export function buildSkillUsage(places: UsedIn[]): Map<string, string[]> {
  const usage = new Map<string, string[]>();

  for (const place of places) {
    for (const skill of place.stack ?? []) {
      const labels = usage.get(skill) ?? [];
      labels.push(place.label);
      usage.set(skill, labels);
    }
  }

  return usage;
}

// A skill name turned into something safe to use in an element id and a link, e.g. "CI/CD" -> "skill-ci-cd".
export function skillElementId(skill: string): string {
  const slug = skill.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `skill-${slug}`;
}
