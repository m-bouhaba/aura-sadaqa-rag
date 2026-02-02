// src/app/dashboard/@explorer/page.tsx
import React from "react";

export default function ExplorerPage() {
  // Ici tu afficherais les listes de familles, dons, stats...
  const familles = ["Famille A", "Famille B", "Famille C"];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Explorer les familles</h2>
      <ul className="space-y-2">
        {familles.map((famille, i) => (
          <li key={i} className="p-2 border rounded-md bg-white">
            {famille}
          </li>
        ))}
      </ul>
    </div>
  );
}
