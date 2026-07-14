"use client";

import jsPDF from "jspdf";

type ItineraryDay = {
  day: number;
  places: { name: string; type: string; description: string }[];
  food: { meal: string; description: string; costEstimate: number }[];
  estimatedCost: number;
  tips: string;
};

export default function ExportPDFButton({
  destination,
  itinerary,
}: {
  destination: string;
  itinerary: { days: ItineraryDay[] } | null;
}) {
  const generatePDF = () => {
    if (!itinerary) {
      alert("No itinerary to export.");
      return;
    }

    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text(`${destination} — Travel Itinerary`, 15, y);
    y += 12;

    itinerary.days.forEach((day) => {
      if (y > 250) { doc.addPage(); y = 20; }

      doc.setFontSize(14);
      doc.setTextColor(60, 60, 200);
      doc.text(`Day ${day.day}`, 15, y);
      y += 8;

      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);

      day.places?.forEach((p) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(`📍 ${p.name} (${p.type})`, 15, y);
        y += 5;
        const wrapped = doc.splitTextToSize(`   ${p.description}`, 180);
        doc.text(wrapped, 15, y);
        y += wrapped.length * 5 + 2;
      });

      day.food?.forEach((f) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(`🍽 ${f.meal} — ₹${f.costEstimate}`, 15, y);
        y += 5;
        const wrapped = doc.splitTextToSize(`   ${f.description}`, 180);
        doc.text(wrapped, 15, y);
        y += wrapped.length * 5 + 2;
      });

      if (day.tips) {
        if (y > 270) { doc.addPage(); y = 20; }
        const wrapped = doc.splitTextToSize(`💡 Tip: ${day.tips}`, 180);
        doc.text(wrapped, 15, y);
        y += wrapped.length * 5 + 2;
      }

      doc.setTextColor(100);
      doc.text(`Estimated cost: ₹${day.estimatedCost}`, 15, y);
      y += 10;
    });

    doc.save(`${destination.replace(/\s+/g, "-").toLowerCase()}-itinerary.pdf`);
  };

  return (
    <button
      onClick={generatePDF}
      className="inline-flex items-center gap-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 hover:border-green-500/60 text-green-400 transition px-4 py-2.5 rounded-xl text-sm font-medium"
    >
      📄 Export PDF
    </button>
  );
}
