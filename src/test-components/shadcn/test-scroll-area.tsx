import { ScrollArea } from "@bluevoid/ui";
import { lorem } from "../lorem";
import { Separator } from "@bluevoid/ui";
import { Fragment } from "react";

const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`,
);

function TestScrollArea() {
  return (
    <>
      <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
        {lorem}
        {lorem}
      </ScrollArea>
      <ScrollArea className="h-72 w-48 rounded-md border">
        <div className="p-4">
          <h4 className="mb-4 font-medium text-sm leading-none">Tags</h4>
          {tags.map((tag, index) => (
            <Fragment key={`TestScrollArea${tag}__${index}`}>
              <div className="text-sm">{tag}</div>
              <Separator className="my-2" />
            </Fragment>
          ))}
        </div>
      </ScrollArea>
    </>
  );
}

export default TestScrollArea;
