import type { ReactNode } from "react";
import type { ZodTypeAny } from "zod";

type RequiredLabelProps = {
  label?: ReactNode;
  field: string;
  requiredFields?: Set<string>;
  required?: boolean;
};

// eslint-disable-next-line react-refresh/only-export-components
export function getRequiredFields(schema: ZodTypeAny): Set<string> {
  const result = schema.safeParse({});
  const requiredFields = new Set<string>();

  if (!result.success) {
    for (const issue of result.error.issues) {
      if (issue.code === "invalid_type" || issue.code === "custom") {
        if (issue.path.length > 0) {
          requiredFields.add(issue.path[0] as string);
        }
      }
    }
  }
  return requiredFields;
}


export function RequiredLabel({ label, field, requiredFields, required }: RequiredLabelProps) {
  const isRequired = requiredFields?.has(field) || required;

  return (
    <span>
      {label}
      {isRequired && <span className="text-red-500">*</span>}
    </span>
  );
}
