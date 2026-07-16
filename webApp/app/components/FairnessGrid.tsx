import React from "react";
import { Box } from "@mui/material";
import Link from "next/link";
import { FAIRNESS_CRITERIA } from "./utils/fairnessConstants";
import { getIconComponent } from "./utils/iconMap";
import {
  normalizeFairnessValue,
  getFairnessValuesInOrder,
  getFairnessColor,
} from "./utils/fairnessUtils";

export default function FairnessGrid({ fairnessData }: { fairnessData: any }) {
  const values = getFairnessValuesInOrder(fairnessData);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 1,
        width: "100%",
        alignItems: "center",
        py: 1,
        flexWrap: "wrap",
      }}
    >
      {FAIRNESS_CRITERIA.map((crit, idx) => {
        const val = values[idx];
        const norm = normalizeFairnessValue(val);
        const Icon = getIconComponent(crit.icon || "HelpIcon");

        let color;

        // Custom rule for Key 7 (Authentication Required)
        if (crit.key === "7") {
          if (norm === "unknown") {
            color = "#a8a9ad"; // Keep it grey if unknown
          } else if (
            val === "no" ||
            val === "No" ||
            (norm as string) === "fail" || // Cast to string to fix TypeScript overlap error
            (norm as string) === "weak"
          ) {
            // "No" authentication means open access, so color it green!
            color = "var(--fairagro-primary-green, #4caf50)";
          } else {
            // If authentication IS required ("yes"), apply your default evaluation color
            color = getFairnessColor(norm);
          }
        } else {
          // Default behavior for all other keys
          color = norm === "unknown" ? "#a8a9ad" : getFairnessColor(norm);
        }

        return (
          <Link
            key={crit.key}
            href={`/indicator/${crit.key}`}
            style={{ textDecoration: "none" }}
          >
            <Box
              title={crit.label}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 28,
                height: 28,
                cursor: "pointer",
                mx: 0.25,
                background: "none",
                border: "none",
                boxShadow: "none",
                p: 0,
                transition: "transform 0.2s ease",
                "&:hover": {
                  transform: "scale(1.2)",
                },
              }}
            >
              <Icon sx={{ color, fontSize: 22 }} />
            </Box>
          </Link>
        );
      })}
    </Box>
  );
}
