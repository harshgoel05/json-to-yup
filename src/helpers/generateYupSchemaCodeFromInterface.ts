import {
  addEmptyStringsToMissingKeys,
  convertJSONToYupSchema,
} from "./convertJSONToYupSchema";

function convertFieldToYupCode(
  fieldName: string,
  fieldDefinition: string,
  isReadonly: boolean = false
): string {
  let yupCode = "";
  const fieldReadonly = isReadonly || fieldDefinition.includes("readonly");

  if (fieldDefinition.includes("string")) yupCode = ".string()";
  if (fieldDefinition.includes("number")) yupCode = ".number()";
  if (fieldDefinition.includes("boolean")) yupCode = ".boolean()";

  if (fieldReadonly) {
    yupCode += `.meta({ readonly: true })`;
  }

  return `${fieldName}: yup${yupCode},`;
}

function convertObjectToYupCode(
  objectDefinition: string,
  isReadonly: boolean = false
): string {
  const fieldLines: string[] = [];
  const fieldRegex = /\s*(\w+): ([\w\s{}]+);/g;
  let match;
  while ((match = fieldRegex.exec(objectDefinition)) !== null) {
    const [, fieldName, fieldDefinition] = match;
    const fieldCode = convertFieldToYupCode(
      fieldName,
      fieldDefinition,
      isReadonly
    );
    fieldLines.push(fieldCode);
  }
  return `{
  ${fieldLines.join("\n  ")}
  }`;
}

export function generateYupSchemaCodeFromInterface(
  interfaceCode: string
): string {
  const lines: string[] = [];

  const interfaceRegex = /interface (\w+)\s?{([\s\S]*?)}/;
  const interfaceMatches = interfaceCode.match(interfaceRegex);

  if (interfaceMatches && interfaceMatches.length >= 3) {
    const interfaceName = interfaceMatches[1];
    const interfaceBody = interfaceMatches[2];

    lines.push(`import * as yup from 'yup';`);
    lines.push(``);
    lines.push(
      `const ${interfaceName}Schema = yup.object().shape(${convertObjectToYupCode(
        interfaceBody
      )});`
    );

    return lines.join("\n");
  } else if (interfaceCode.startsWith("{")) {
    try {
      const a = JSON.parse(addEmptyStringsToMissingKeys(interfaceCode));
      const res = convertJSONToYupSchema(a);
      return res;
    } catch (err) {
      return "Invalid JSON";
    }
  }
  return "Invalid Interface";
}
