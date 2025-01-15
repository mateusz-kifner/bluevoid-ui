import { Checkbox } from "@bluevoid/ui";
import { Input } from "@bluevoid/ui";
import { Label } from "@bluevoid/ui";

function TestLabel() {
  return (
    <>
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label label="Picture" htmlFor="picture" />
        <Input id="picture" type="file" />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="checkbox_unchecked" />
        <Label label="Unchecked" htmlFor="checkbox_unchecked" />
      </div>
    </>
  );
}

export default TestLabel;
