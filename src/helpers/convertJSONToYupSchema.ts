import * as yup from "yup";

export type JSONSchema = {
  [key: string]: JSONSchema | string | number;
};

export const convertJSONToYupSchema = (jsonSchema: any): string => {
  const fields: string[] = [];

  for (const key in jsonSchema) {
    const value = jsonSchema[key];

    if (typeof value === "object" && !Array.isArray(value)) {
      const nestedSchema = convertJSONToYupSchema(value as JSONSchema);
      fields.push(`${key}: ${nestedSchema}`);
    } else if (typeof value === "string") {
      fields.push(`${key}: yup.string()`);
    } else if (typeof value === "number") {
      fields.push(`${key}: yup.number()`);
    } else if (typeof value === "boolean") {
      fields.push(`${key}: yup.boolean()`);
    }
  }

  return `yup.object().shape({\n${fields.join(",\n")}\n});`;
};

export const addEmptyStringsToMissingKeys = (json: string): string => {
  try {
    // Preprocess input to make it valid JSON
    const validJson = json.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": ');

    const jsonObject = JSON.parse(validJson);
    const keys = Object.keys(jsonObject);

    // Iterate through all keys and add empty strings to missing keys
    for (const key in jsonObject) {
      if (!keys.includes(key)) {
        jsonObject[key] = "";
      }
    }

    return JSON.stringify(jsonObject, null, 2);
  } catch (error) {
    console.error("Error parsing or processing JSON:", error);
    return json; // Return the original JSON if there's an error
  }
};
