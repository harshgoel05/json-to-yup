"use client";
import { useEffect, useState } from "react";
import { generateYupSchemaCodeFromInterface } from "../helpers/generateYupSchemaCodeFromInterface";

// Generate Yup schema code

export default function Home() {
  const [inputVal, setInputVal] = useState("");
  const [output, setOutput] = useState("");

  useEffect(() => {
    const yupSchema = generateYupSchemaCodeFromInterface(inputVal);
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
          placeholder="Input a valid JSON or Interface for typescript.     Nested doesn't work now :( "
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
          value={output}
          readOnly
        ></textarea>
      </div>
    </div>
  );
}
