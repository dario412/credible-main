export type AirtableAttachment = {
  id?: string;
  url: string;
  filename?: string;
  type?: string;
  width?: number;
  height?: number;
};

export type AirtableRecord = {
  id: string;
  createdTime?: string;
  fields: Record<string, unknown>;
};

type ListResponse = {
  records: AirtableRecord[];
  offset?: string;
};

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing ${name}. Add it to your environment.`);
  }
  return value;
}

export function getAirtableConfig() {
  return {
    pat: requireEnv("AIRTABLE_PAT"),
    baseId: requireEnv("AIRTABLE_BASE_ID"),
    table: requireEnv("AIRTABLE_TABLE"),
  };
}

export function isAirtableConfigured() {
  return Boolean(
    process.env.AIRTABLE_PAT?.trim() &&
      process.env.AIRTABLE_BASE_ID?.trim() &&
      process.env.AIRTABLE_TABLE?.trim(),
  );
}

/**
 * Paginated list of all records from the configured Airtable table.
 * Uses the official REST API with a Personal Access Token.
 */
export async function listAllAirtableRecords(): Promise<AirtableRecord[]> {
  const { table } = getAirtableConfig();
  return listAirtableTable(table);
}

/** Paginated list from any table in the configured base. */
export async function listAirtableTable(
  tableName: string,
  options?: { filterByFormula?: string },
): Promise<AirtableRecord[]> {
  const { pat, baseId } = getAirtableConfig();
  const encodedTable = encodeURIComponent(tableName);
  const records: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const url = new URL(
      `https://api.airtable.com/v0/${baseId}/${encodedTable}`,
    );
    url.searchParams.set("pageSize", "100");
    if (offset) url.searchParams.set("offset", offset);
    if (options?.filterByFormula) {
      url.searchParams.set("filterByFormula", options.filterByFormula);
    }

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${pat}`,
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(
        `Airtable API ${res.status}: ${body.slice(0, 400) || res.statusText}`,
      );
    }

    const data = (await res.json()) as ListResponse;
    records.push(...(data.records ?? []));
    offset = data.offset;
  } while (offset);

  return records;
}
