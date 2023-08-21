"use client";
import { useEffect, useState } from "react";

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

function generateYupSchemaCodeFromInterface(interfaceCode: string): string {
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
  }

  return "";
}

// Generate Yup schema code

export default function Home() {
  const [inputVal, setInputVal] = useState("");
  const [output, setOutput] = useState("");
  useEffect(() => {
    const yupSchema = generateYupSchemaCodeFromInterface(inputVal);
    console.log(yupSchema);
    setOutput(yupSchema);
  }, [inputVal]);

  return (
    <div className="flex items-center h-screen w-screen bg-blue-200 gap-2 justify-between px-28">
      <div className="flex flex-col gap-2 w-full">
        <label
          htmlFor="message"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Input
        </label>
        <textarea
          id="message"
          rows={10}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Write your thoughts here..."
          value={inputVal}
          onChange={(e) => {
            setInputVal(e.target.value);
          }}
        ></textarea>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <label
          htmlFor="message"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Output
        </label>
        <textarea
          id="message"
          rows={10}
          className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Write your thoughts here..."
          value={output}
        ></textarea>
      </div>
    </div>
  );
}
