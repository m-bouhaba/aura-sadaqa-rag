// src/app/dashboard/layout.tsx
import React from "react";

export const metadata = {
  title: "Aura-Sadaqa Dashboard",
};

export default function DashboardLayout({
  children,
  chat,       // slot pour le chat
  explorer,   // slot pour l'explorer
}: {
  children: React.ReactNode;
  chat: React.ReactNode;
  explorer: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Chat slot */}
      <div className="w-1/3 border-r border-gray-200 p-4">
        {chat || <p>Chargement du chat...</p>}
      </div>

      {/* Explorer slot */}
      <div className="w-2/3 p-4">
        {explorer || <p>Chargement des familles/dons...</p>}
      </div>
    </div>
  );
}
