"use client";

import { useState } from "react";
import Link from "next/link";

export default function Generator() {
  const [idea, setIdea] = useState("");

  return (
    <main className="min-h-screen bg-zinc-50 p-10">
      <div className="max-w-3xl mx-auto">

        <Link href="/" className="text-sm text-gray-500">← Back</Link>

        <h1 className="text-3xl font-bold mt-4">AI Engineer Generator</h1>

        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="Describe your app idea..."
          className="w-full h-40 mt-6 p-4 border rounded-xl"
        />

        <button className="mt-4 bg-black text-white px-6 py-3 rounded-full">
          Generate Blueprint
        </button>

      </div>
    </main>
  );
}