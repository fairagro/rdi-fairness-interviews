// app/resource/repository/[rdiId]/fairness/page.tsx
import React from "react";
import { getAllRdis } from "rf-rdis";
import FairnessClientPage from "./FairnessClientPage";

// This MUST be named exactly generateStaticParams and be exported
export function generateStaticParams() {
  const rdis = getAllRdis();
  return rdis.map((rdi) => ({
    rdiId: rdi.id,
  }));
}

interface PageProps {
  params: Promise<{ rdiId: string }>;
}

export default async function RdiFairnessPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <FairnessClientPage rdiId={resolvedParams.rdiId} />;
}