import React from "react";
import componentify from "../componentify";
import type { WAMLComponent } from "../types";

const HR:WAMLComponent<'HR'> = ({ node, ...props }) => <hr {...props} />;
HR.displayName = "HR";
export default componentify(HR);